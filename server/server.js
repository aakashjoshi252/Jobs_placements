require('dotenv').config();
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

// Socket.IO
const { Server } = require('socket.io');
const messageController = require('./controllers/message.controller.js');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || 'development';

/* ================= DATABASE CONNECTION ================= */
// CRITICAL FIX: Call the database connection function
connectDb;

/* ================= SECURITY MIDDLEWARE ================= */
// Helmet - Secure HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable for Socket.IO compatibility
    crossOriginEmbedderPolicy: false,
  })
);

// Compression - Compress responses
app.use(compression());

/* ================= CORS CONFIGURATION ================= */
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://192.168.1.17:5173',
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Check if origin is in allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else if (
      origin.match(/^http:\/\/(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)\d+\.\d+:\d+$/)
    ) {
      // Allow local network IPs in development
      if (nodeEnv === 'development') {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked in production: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      logger.warn(`CORS blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

/* ================= LOGGING ================= */
if (nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  // Production logging with Winston
  app.use(
    morgan('combined', {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
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
// Apply general rate limiting to API routes
app.use('/api', limiter);

/* ================= ROOT & HEALTH CHECKS ================= */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Job Placements Portal API',
    version: '1.0.0',
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
    },
  });
});

// Health check routes
app.use('/health', healthRouter);

/* ================= API v1 ROUTES ================= */
const API_VERSION = '/api/v1';

// Authentication & Users
app.use(`${API_VERSION}/user`, userRoute);

// Company Management
app.use(`${API_VERSION}/company`, companyRoute);

// Job Listings
app.use(`${API_VERSION}/jobs`, jobsRoute);

// Resume Management
app.use(`${API_VERSION}/resume`, resumeRoute);

// Applications
app.use(`${API_VERSION}/application`, applicationsRoute);

// Dashboard & Analytics
app.use(`${API_VERSION}/dashboard`, dashboardRoutes);

// Chat & Messaging
app.use(`${API_VERSION}/chat`, chatRoute);

// Notifications
app.use(`${API_VERSION}/notifications`, notificationRoute);

// Blog (Fixed: was /blogs, now standardized to /blog)
app.use(`${API_VERSION}/blog`, blogRouter);

// Legacy routes for backward compatibility (optional - can be removed after frontend update)
app.use('/user', userRoute);
app.use('/company', companyRoute);
app.use('/jobs', jobsRoute);
app.use('/resume', resumeRoute);
app.use('/application', applicationsRoute);
app.use('/dashboard', dashboardRoutes);
app.use('/chat', chatRoute);
app.use('/notifications', notificationRoute);
app.use('/blog', blogRouter); // Legacy endpoint

/* ================= SOCKET.IO CONFIGURATION ================= */
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else if (
        origin.match(/^http:\/\/(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)\d+\.\d+:\d+$/) &&
        nodeEnv === 'development'
      ) {
        callback(null, true);
      } else {
        logger.warn(`Socket.IO CORS blocked: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Store connected users
const connectedUsers = new Map();

/* ================= SOCKET.IO EVENT HANDLERS ================= */
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  // User joins their personal room
  socket.on('userOnline', (userId) => {
    try {
      if (!userId) {
        logger.warn('userOnline called without userId');
        return;
      }

      socket.userId = userId;
      socket.join(`user_${userId}`);
      connectedUsers.set(userId, socket.id);
      logger.info(`User ${userId} is online (Socket: ${socket.id})`);

      // Broadcast online status
      io.emit('userStatusChange', {
        userId,
        status: 'online',
      });
    } catch (error) {
      logger.error(`Error in userOnline: ${error.message}`);
      socket.emit('error', { message: 'Failed to set user online status' });
    }
  });

  // Join a specific chat room
  socket.on('joinChat', (chatId) => {
    try {
      if (!chatId) {
        logger.warn('joinChat called without chatId');
        return;
      }

      socket.join(`chat_${chatId}`);
      logger.info(`Socket ${socket.id} joined chat ${chatId}`);
      socket.emit('joinedChat', { chatId });
    } catch (error) {
      logger.error(`Error in joinChat: ${error.message}`);
      socket.emit('error', { message: 'Failed to join chat' });
    }
  });

  // Leave a chat room
  socket.on('leaveChat', (chatId) => {
    try {
      if (!chatId) {
        logger.warn('leaveChat called without chatId');
        return;
      }

      socket.leave(`chat_${chatId}`);
      logger.info(`Socket ${socket.id} left chat ${chatId}`);
      socket.emit('leftChat', { chatId });
    } catch (error) {
      logger.error(`Error in leaveChat: ${error.message}`);
    }
  });

  // Send message
  socket.on('sendMessage', async (data) => {
    try {
      const { chatId, senderId, text } = data;

      // Validation
      if (!chatId || !senderId || !text) {
        socket.emit('messageError', {
          error: 'Missing required fields',
          details: 'chatId, senderId, and text are required',
        });
        return;
      }

      logger.info(`Message from ${senderId} in chat ${chatId}`);

      // Save to database
      const message = await messageController.createMessage({
        chatId,
        senderId,
        text,
      });

      logger.info(`Message saved: ${message._id}`);

      // Broadcast to chat room
      io.to(`chat_${chatId}`).emit('receiveMessage', {
        _id: message._id,
        chatId: message.chatId,
        senderId: message.senderId,
        text: message.text,
        createdAt: message.createdAt,
        isRead: message.isRead,
      });

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
            senderId: message.senderId,
            timestamp: message.createdAt,
          });
          logger.info(`Notification sent to user ${otherUserId}`);
        }
      }

      // Send confirmation to sender
      socket.emit('messageSent', {
        success: true,
        messageId: message._id,
      });
    } catch (error) {
      logger.error(`Socket sendMessage error: ${error.message}`, { stack: error.stack });
      socket.emit('messageError', {
        error: error.message,
        details: 'Failed to send message. Please try again.',
      });
    }
  });

  // Typing indicators
  socket.on('typing', ({ chatId, userName }) => {
    try {
      if (!chatId || !userName) {
        logger.warn('typing called with missing parameters');
        return;
      }

      socket.to(`chat_${chatId}`).emit('userTyping', { chatId, userName });
      logger.debug(`User ${userName} typing in chat ${chatId}`);
    } catch (error) {
      logger.error(`Error in typing event: ${error.message}`);
    }
  });

  socket.on('stopTyping', ({ chatId }) => {
    try {
      if (!chatId) {
        logger.warn('stopTyping called without chatId');
        return;
      }

      socket.to(`chat_${chatId}`).emit('userStoppedTyping', { chatId });
    } catch (error) {
      logger.error(`Error in stopTyping event: ${error.message}`);
    }
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);

    if (socket.userId) {
      connectedUsers.delete(socket.userId);
      io.emit('userStatusChange', {
        userId: socket.userId,
        status: 'offline',
      });
    }
  });

  // Socket error handler
  socket.on('error', (error) => {
    logger.error(`Socket error: ${error.message}`, { socketId: socket.id });
  });
});

/* ================= ERROR HANDLING ================= */
// 404 Handler - must be after all routes
app.use(notFound);

// Global Error Handler - must be last
app.use(errorHandler);

/* ================= GRACEFUL SHUTDOWN ================= */
const gracefulShutdown = () => {
  logger.info('Received shutdown signal, closing server gracefully...');
  
  server.close(() => {
    logger.info('HTTP server closed');
    
    // Close database connection
    const mongoose = require('mongoose');
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });

  // Force close after 30 seconds
  setTimeout(() => {
    logger.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 30000);
};

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`, { stack: error.stack });
  gracefulShutdown();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
  gracefulShutdown();
});

/* ================= START SERVER ================= */
server.listen(port, '0.0.0.0', () => {
  console.log(` Server running on http://localhost:${port}`);
  console.log(` Network: http://192.168.1.17:${port}`);
  console.log(` CORS enabled for local network`);
  console.log(` API Documentation: http://localhost:${port}/api/v1/docs`);
  console.log(` Health Check: http://localhost:${port}/health`);
  console.log(` Environment: ${nodeEnv}`);
});

// Export for testing
module.exports = { app, server, io };