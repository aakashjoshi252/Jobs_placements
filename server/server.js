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

// SOCKET
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

/* ================= DATABASE ================= */
connectDb; // ✅ FIXED

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

/* ================= SOCKET.IO ================= */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("sendMessage", (data) => {
    io.to(data.chatId).emit("receiveMessage", data);
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
  console.log(` Server running on http://localhost:${port}`);
});
