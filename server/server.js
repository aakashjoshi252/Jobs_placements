require("dotenv").config();
const cors = require("cors");
const express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/config.js");

// ROUTES
const userRoute = require("./routes/user.route.js");
const companyRoute = require("./routes/company.route.js");
const jobsRoute = require("./routes/jobs.route.js");
const resumeRoute = require("./routes/resume.route.js");
const applicationsRoute = require("./routes/applications.route.js");
const dashboardRoutes = require("./routes/dashboard.route.js");
const chatRoute = require("./routes/chat.route.js");
const notificationRoute = require("./routes/notification.route.js");

// SOCKET
const { Server } = require("socket.io");
const messageController = require("./controllers/message.controller.js");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

/* ================= DATABASE ================= */
connectDb;

/* ================= MIDDLEWARE ================= */
// Allow multiple origins (localhost and network IP)
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://192.168.1.17:5173", // Your network IP
  process.env.FRONTEND_URL, // Environment variable for production
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if the origin is in the allowed list
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else if (origin.match(/^http:\/\/(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)\d+\.\d+:\d+$/)) {
        // Allow any local network IP (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
        callback(null, true);
      } else {
        console.warn(`⚠️  Blocked by CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

/* ================= ROUTES ================= */
app.use("/user", userRoute);
app.use("/company", companyRoute);
app.use("/jobs", jobsRoute);
app.use("/resume", resumeRoute);
app.use("/application", applicationsRoute);
app.use("/dashboard", dashboardRoutes);
app.use("/chat", chatRoute);
app.use("/notifications", notificationRoute);

/* ================= SOCKET.IO ================= */
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin
      if (!origin) return callback(null, true);
      
      // Check if the origin is in the allowed list
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else if (origin.match(/^http:\/\/(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)\d+\.\d+:\d+$/)) {
        // Allow any local network IP
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

// Store connected users
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // User joins their personal room
  socket.on("userOnline", (userId) => {
    socket.userId = userId;
    socket.join(`user_${userId}`);
    connectedUsers.set(userId, socket.id);
    console.log(`✅ User ${userId} is online (Socket: ${socket.id})`);

    // Broadcast online status to all users
    io.emit("userStatusChange", {
      userId,
      status: "online",
    });
  });

  // Join a specific chat room
  socket.on("joinChat", (chatId) => {
    socket.join(`chat_${chatId}`);
    console.log(`✅ Socket ${socket.id} joined chat ${chatId}`);
  });

  // Leave a chat room
  socket.on("leaveChat", (chatId) => {
    socket.leave(`chat_${chatId}`);
    console.log(`👋 Socket ${socket.id} left chat ${chatId}`);
  });

  // Send message
  socket.on("sendMessage", async (data) => {
    try {
      const { chatId, senderId, text } = data;

      if (!chatId || !senderId || !text) {
        socket.emit("messageError", {
          error: "Missing required fields",
          details: "chatId, senderId, and text are required",
        });
        return;
      }

      console.log("📨 Sending message:", { chatId, senderId, text: text.substring(0, 50) });

      // Save to database using message controller
      const message = await messageController.createMessage({
        chatId,
        senderId,
        text,
      });

      console.log("💾 Message saved to DB:", message._id);

      // Emit to all users in the chat room (including sender)
      io.to(`chat_${chatId}`).emit("receiveMessage", {
        _id: message._id,
        chatId: message.chatId,
        senderId: message.senderId,
        text: message.text,
        createdAt: message.createdAt,
        isRead: message.isRead,
      });

      console.log("✅ Message broadcasted to chat room", `chat_${chatId}`);

      // Get chat and notify other participant
      const Chat = require("./models/chatbox.model.js");
      const chat = await Chat.findById(chatId);

      if (chat) {
        const otherUserId = chat.participants.find(
          (id) => id.toString() !== senderId.toString()
        );

        if (otherUserId) {
          io.to(`user_${otherUserId}`).emit("newMessageNotification", {
            chatId,
            message: text,
            senderId: message.senderId,
            timestamp: message.createdAt,
          });
          console.log(`🔔 Notification sent to user ${otherUserId}`);
        }
      }
    } catch (error) {
      console.error("❌ Socket sendMessage error:", error);
      socket.emit("messageError", {
        error: error.message,
        details: "Failed to send message. Please try again.",
      });
    }
  });

  // Typing indicator
  socket.on("typing", ({ chatId, userName }) => {
    socket.to(`chat_${chatId}`).emit("userTyping", { chatId, userName });
    console.log(`⌨️  User typing in chat ${chatId}`);
  });

  socket.on("stopTyping", ({ chatId }) => {
    socket.to(`chat_${chatId}`).emit("userStoppedTyping", { chatId });
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);

    // Remove from connected users and broadcast offline status
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
      io.emit("userStatusChange", {
        userId: socket.userId,
        status: "offline",
      });
    }
  });

  socket.on("error", (error) => {
    console.error("🔴 Socket error:", error);
  });
});

/* ================= 404 HANDLER ================= */
app.use((req, res) => {
  res.status(req.method === "GET" ? 404 : 400).json({
    message: "Page not found",
  });
});

/* ================= START SERVER ================= */
server.listen(port, '0.0.0.0', () => {
  console.log(` Server running on http://localhost:${port}`);
  console.log(` Network: http://192.168.1.17:${port}`);
  console.log(` CORS enabled for local network`);
});
