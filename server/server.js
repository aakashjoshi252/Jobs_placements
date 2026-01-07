require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');

// Database
const connectDb = require('./config/config.js');

// Middleware
const { limiter, authLimiter } = require('./middlewares/security');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
const logger = require('./utils/logger');

// Routes
const userRoute = require('./routes/user.route.js');
const companyRoute = require('./routes/company.route.js');
const jobsRoute = require('./routes/jobs.route.js');
const resumeRoute = require('./routes/resume.route.js');
const applicationsRoute = require('./routes/applications.route.js');
const dashboardRoutes = require('./routes/dashboard.route.js');
const chatRoute = require('./routes/chat.route.js');
const notificationRoute = require('./routes/notification.route.js');
const blogRouter = require('./routes/blog.route.js');
const healthRouter = require('./routes/health.route.js');
const adminRouter = require('./routes/admin.route.js');

// Socket.IO
const { Server } = require('socket.io');
const messageController = require('./controllers/message.controller.js');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || 'development';

/* ================= DATABASE CONNECTION ================= */
connectDb();

/* ================= SECURITY MIDDLEWARE ================= */
app.use(
  helmet({
    contentSecurityPolicy: nodeEnv === 'production' ? undefined : false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(compression());

/* ================= CORS CONFIGURATION ================= */
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  process.env.PRODUCTION_URL,
].filter(Boolean);

// Reusable CORS origin validator
const isOriginAllowed = (origin) => {
  if (!origin) return true; // Allow requests with no origin
  if (allowedOrigins.includes(origin)) return true;
  
  // Allow local network IPs in development
  if (nodeEnv === 'development') {
    return /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.).*:\d+$/.test(origin);
  }
  
  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400,
};

app.use(cors(corsOptions));

/* ================= LOGGING ================= */
if (nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) },
      skip: (req) => req.url === '/health' || req.url === '/health/ready',
    })
  );
}

/* ================= BODY PARSING ================= */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

/* ================= STATIC FILES ================= */
app.use('/uploads', express.static('uploads'));

/* ================= RATE LIMITING ================= */
app.use('/api', limiter);

/* ================= TRUST PROXY ================= */
if (nodeEnv === 'production') {
  app.set('trust proxy', 1);
}

/* ================= ROOT & HEALTH CHECKS ================= */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Job Placements Portal API',
    version: '1.0.0',
    environment: nodeEnv,
    timestamp: new Date().toISOString(),
    documentation: '/api/v1/docs',
    endpoints: {
      health: '/health',
      api: '/api/v1',
      users: '/api/v1/user',
      companies: '/api/v1/company',
      jobs: '/api/v1/jobs',
      applications: '/api/v1/application',
      resume: '/api/v1/resume',
      chat: '/api/v1/chat',
      notifications: '/api/v1/notifications',
      blog: '/api/v1/blog',
      dashboard: '/api/v1/dashboard',
      admin: '/api/v1/admin',
    },
  });
});

app.use('/health', healthRouter);

/* ================= API v1 ROUTES ================= */
const API_VERSION = '/api/v1';

app.use(`${API_VERSION}/user`, authLimiter, userRoute);
app.use(`${API_VERSION}/company`, companyRoute);
app.use(`${API_VERSION}/jobs`, jobsRoute);
app.use(`${API_VERSION}/resume`, resumeRoute);
app.use(`${API_VERSION}/application`, applicationsRoute);
app.use(`${API_VERSION}/dashboard`, dashboardRoutes);
app.use(`${API_VERSION}/chat`, chatRoute);
app.use(`${API_VERSION}/notifications`, notificationRoute);
app.use(`${API_VERSION}/blog`, blogRouter);
app.use(`${API_VERSION}/admin`, adminRouter);

/* ================= SOCKET.IO CONFIGURATION ================= */
const io = new Server(server, {
  cors: {
    origin: isOriginAllowed,
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
  connectTimeout: 45000,
  maxHttpBufferSize: 1e6,
});

const connectedUsers = new Map();

/* ================= SOCKET.IO EVENT HANDLERS ================= */
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  socket.on('userOnline', (userId) => {
    if (!userId) {
      logger.warn('userOnline called without userId');
      socket.emit('error', { message: 'User ID required' });
      return;
    }

    socket.userId = userId;
    socket.join(`user_${userId}`);
    connectedUsers.set(userId, socket.id);
    logger.info(`User ${userId} is online (Socket: ${socket.id})`);

    io.emit('userStatusChange', {
      userId,
      status: 'online',
      timestamp: new Date().toISOString(),
    });
  });

  socket.on('joinChat', (chatId) => {
    if (!chatId) {
      logger.warn('joinChat called without chatId');
      socket.emit('error', { message: 'Chat ID required' });
      return;
    }

    socket.join(`chat_${chatId}`);
    logger.info(`Socket ${socket.id} joined chat ${chatId}`);
    socket.emit('joinedChat', { chatId, success: true });
  });

  socket.on('leaveChat', (chatId) => {
    if (!chatId) return;
    
    socket.leave(`chat_${chatId}`);
    logger.info(`Socket ${socket.id} left chat ${chatId}`);
    socket.emit('leftChat', { chatId, success: true });
  });

  socket.on('sendMessage', async (data) => {
    try {
      const { chatId, senderId, text } = data;

      if (!chatId || !senderId || !text?.trim()) {
        socket.emit('messageError', {
          error: 'Missing required fields',
          details: 'chatId, senderId, and text are required',
        });
        return;
      }

      logger.info(`Message from ${senderId} in chat ${chatId}`);

      const message = await messageController.createMessage({
        chatId,
        senderId,
        text: text.trim(),
      });

      if (!message) throw new Error('Failed to create message');

      logger.info(`Message saved: ${message._id}`);

      const messageData = {
        _id: message._id,
        chatId: message.chatId,
        senderId: message.senderId?._id || message.senderId,
        senderName: message.senderId?.fullName || 'Unknown',
        text: message.text,
        createdAt: message.createdAt,
        isRead: message.isRead,
      };

      io.to(`chat_${chatId}`).emit('receiveMessage', messageData);

      // Notify other participant
      const Chat = require('./models/chatbox.model.js');
      const chat = await Chat.findById(chatId);

      if (chat) {
        const otherUserId = chat.participants.find(
          (id) => id.toString() !== senderId.toString()
        );

        if (otherUserId) {
          io.to(`user_${otherUserId}`).emit('newMessageNotification', {
            chatId,
            message: text,
            senderId: messageData.senderId,
            senderName: messageData.senderName,
            timestamp: message.createdAt,
          });
          logger.info(`Notification sent to user ${otherUserId}`);
        }
      }

      socket.emit('messageSent', {
        success: true,
        messageId: message._id,
        timestamp: message.createdAt,
      });
    } catch (error) {
      logger.error(`Socket sendMessage error: ${error.message}`, { stack: error.stack });
      socket.emit('messageError', {
        error: error.message,
        details: 'Failed to send message. Please try again.',
      });
    }
  });

  socket.on('typing', ({ chatId, userName }) => {
    if (!chatId || !userName) return;
    socket.to(`chat_${chatId}`).emit('userTyping', { chatId, userName });
  });

  socket.on('stopTyping', ({ chatId }) => {
    if (!chatId) return;
    socket.to(`chat_${chatId}`).emit('userStoppedTyping', { chatId });
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);

    if (socket.userId) {
      connectedUsers.delete(socket.userId);
      io.emit('userStatusChange', {
        userId: socket.userId,
        status: 'offline',
        timestamp: new Date().toISOString(),
      });
    }
  });

  socket.on('error', (error) => {
    logger.error(`Socket error: ${error.message}`, { socketId: socket.id });
  });
});

/* ================= ERROR HANDLING ================= */
app.use(notFound);
app.use(errorHandler);

/* ================= GRACEFUL SHUTDOWN ================= */
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received: Closing server gracefully...`);

  server.close(() => {
    logger.info('HTTP server closed');

    if (mongoose.connection.readyState !== 0) {
      mongoose.connection.close(false, () => {
        logger.info('MongoDB connection closed');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });

  setTimeout(() => {
    logger.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`, { stack: error.stack });
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', { promise, reason });
  gracefulShutdown('UNHANDLED_REJECTION');
});

/* ================= START SERVER ================= */
server.listen(port, '0.0.0.0', () => {
  const dbStatus = mongoose.connection.readyState === 1 ? ' Connected' : ' Connecting...';
  
//   console.log(`
// ╭${'─'.repeat(63)}╮
// │ 🚀 Job Placements Portal API Server Started${' '.repeat(17)}│
// ├${'─'.repeat(63)}┤
// │ 📍 Local:      http://localhost:${port}${' '.repeat(24 - port.toString().length)}│
// │ 🔧 Environment: ${nodeEnv.toUpperCase()}${' '.repeat(39 - nodeEnv.length)}│
// │ 📊 Database:    ${dbStatus}${' '.repeat(40 - dbStatus.length)}│
// │ 🔌 Socket.IO:   Enabled${' '.repeat(35)}│
// ╰${'─'.repeat(63)}╯
// `);

  logger.info(`Server started on port http://localhost:${port}`);
});

module.exports = { app, server, io };
