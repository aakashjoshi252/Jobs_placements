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
const chatRoute = require("./routes/chat.route.js"); // ✅ ADD THIS

// SOCKET
const { Server } = require("socket.io");
const chatController = require("./controllers/chat.controller.js"); // ✅ ADD THIS

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

/* ================= DATABASE ================= */
connectDb;

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
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
app.use("/chat", chatRoute); // ✅ ADD THIS

/* ================= SOCKET.IO ================= */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // User joins their personal room
  socket.on("userOnline", (userId) => {
    socket.userId = userId;
    socket.join(`user_${userId}`);
    console.log(`User ${userId} is online`);
  });

  // Join a specific chat room
  socket.on("joinChat", (chatId) => {
    socket.join(`chat_${chatId}`);
    console.log(`Socket ${socket.id} joined chat ${chatId}`);
  });

  // Send message
  socket.on("sendMessage", async (data) => {
    try {
      const { chatId, senderId, text } = data;
      
      // Save to database
      const message = await chatController.sendMessage({
        chatId,
        senderId,
        text,
      });

      // Emit to all users in the chat room
      io.to(`chat_${chatId}`).emit("receiveMessage", {
        _id: message._id,
        chatId,
        senderId: message.senderId,
        text: message.text,
        createdAt: message.createdAt,
      });

      // Get chat and notify other participant
      const Chat = require("./models/chatbox.model.js");
      const chat = await Chat.findById(chatId);
      if (chat) {
        const otherUserId = chat.participants.find(
          (id) => id.toString() !== senderId.toString()
        );
        
        io.to(`user_${otherUserId}`).emit("newMessageNotification", {
          chatId,
          message: text,
          senderId,
        });
      }
    } catch (error) {
      console.error("Socket sendMessage error:", error);
      socket.emit("messageError", { error: error.message });
    }
  });

  // Typing indicator
  socket.on("typing", ({ chatId, userName }) => {
    socket.to(`chat_${chatId}`).emit("userTyping", { chatId, userName });
  });

  socket.on("stopTyping", ({ chatId }) => {
    socket.to(`chat_${chatId}`).emit("userStoppedTyping", { chatId });
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

/* ================= 404 HANDLER ================= */
app.use((req, res) => {
  res.status(req.method === "GET" ? 404 : 400).json({
    message: "Page not found",
  });
});

/* ================= START SERVER ================= */
server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
