# 🚀 Jobs Placements Portal

[![Production Status](https://img.shields.io/badge/status-production--ready-green)]() [![License](https://img.shields.io/badge/license-MIT-blue)]() [![Node](https://img.shields.io/badge/node-%3E%3D16.x-brightgreen)]() [![MongoDB](https://img.shields.io/badge/mongodb-%3E%3D5.x-green)]()

A comprehensive job placement platform connecting job seekers with recruiters. Built with modern technologies and production-ready architecture.

## ✨ Features

### For Job Seekers
- 👤 Complete profile management with resume upload
- 🔍 Advanced job search with filters (location, salary, experience)
- 📝 One-click job applications
- 📨 Real-time application status tracking
- 💬 Direct messaging with recruiters
- 🔔 Instant notifications for application updates
- 📊 Personalized dashboard with analytics

### For Recruiters/Companies
- 🏢 Company profile creation and management
- 💼 Post and manage job listings
- 📄 Review applications and resumes
- 👥 Candidate management system
- 💬 Communication with applicants
- 📈 Recruitment analytics dashboard
- 🎯 Advanced candidate filtering

### Technical Features
- 🔒 JWT-based authentication with refresh tokens
- 🔌 Real-time chat using Socket.IO
- ☁️ Cloud file storage (Cloudinary)
- 🛡️ Rate limiting and security middleware
- 📊 API monitoring and logging
- 🐳 Docker support for easy deployment
- 🚀 CI/CD pipeline ready
- 🎯 Production-grade error handling

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18.x
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.IO
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Cloudinary / AWS S3
- **Process Manager**: PM2
- **Validation**: Express-validator
- **Security**: Helmet, express-rate-limit, xss-clean

### Frontend
- **Framework**: React 18 with Vite
- **State Management**: Redux Toolkit / Context API
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client
- **Routing**: React Router v6

### DevOps
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx
- **SSL**: Let's Encrypt (Certbot)
- **CI/CD**: GitHub Actions
- **Monitoring**: PM2, Winston Logger

---

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v16.x or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5.x or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager
- **Git** for version control

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/aakashjoshi252/Jobs_placements.git
cd Jobs_placements
```

### 2. Server Setup
```bash
cd server
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Required Environment Variables:**
```env
NODE_ENV=development
PORT=3000
MONGO_URL=mongodb://localhost:27017/jobs_placements
JWT_SECRET=your_super_secure_random_secret_key_here
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
CLIENT_URL=http://localhost:5173
```

### 3. Client Setup
```bash
cd ../client
npm install

# Create .env for client
echo "VITE_API_URL=http://localhost:3000/api/v1" > .env
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

**Terminal 3 - MongoDB (if not running as service):**
```bash
mongod
```

🎉 **Application Running:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Docs: http://localhost:3000/api/v1

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Setup
```bash
# Build server image
cd server
docker build -t jobs-placements-api .

# Run container
docker run -p 3000:3000 --env-file .env jobs-placements-api
```

---

## 🛡️ Production Deployment

For production deployment, follow our comprehensive guide:

📚 **[Production Deployment Guide](./PRODUCTION_DEPLOYMENT.md)**

Key steps:
1. Server provisioning and configuration
2. MongoDB security setup
3. Application deployment with PM2
4. Nginx reverse proxy configuration
5. SSL certificate installation
6. Monitoring and logging setup
7. Automated backups

---

## 📚 API Documentation

Comprehensive API documentation is available:

🔗 **[API Documentation](./API_DOCUMENTATION.md)**

### Quick Reference

**Base URL:** `http://localhost:3000/api/v1`

**Authentication:**
```bash
# Register
POST /user/register

# Login
POST /user/login

# Get Profile
GET /user/profile
Headers: Authorization: Bearer <token>
```

**Jobs:**
```bash
# Get all jobs
GET /jobs?page=1&limit=10

# Get job details
GET /jobs/:id

# Create job (Recruiter only)
POST /jobs
Headers: Authorization: Bearer <token>
```

**Applications:**
```bash
# Apply for job
POST /application/apply/:jobId
Headers: Authorization: Bearer <token>

# My applications
GET /application/my-applications
Headers: Authorization: Bearer <token>
```

---

## 📋 Project Structure

```
Jobs_placements/
├── server/                 # Backend application
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middlewares/        # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── uploads/            # File uploads directory
│   ├── logs/               # Application logs
│   ├── server.js           # Entry point
│   ├── ecosystem.config.js # PM2 configuration
│   └── package.json
│
├── client/                # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── redux/          # State management
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx
│   └── package.json
│
├── .github/
│   └── workflows/         # CI/CD pipelines
│
├── docker-compose.yml     # Docker orchestration
├── API_DOCUMENTATION.md   # API documentation
├── PRODUCTION_DEPLOYMENT.md # Deployment guide
└── README.md              # This file
```

---

## 🔒 Security Features

- ✅ JWT authentication with HTTP-only cookies
- ✅ Password hashing with bcrypt
- ✅ Rate limiting on API endpoints
- ✅ CORS configuration
- ✅ Helmet.js for security headers
- ✅ XSS protection
- ✅ NoSQL injection prevention
- ✅ HPP (HTTP Parameter Pollution) protection
- ✅ Input validation and sanitization
- ✅ File upload restrictions

---

## 🧑‍💻 Development

### Available Scripts

**Server:**
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm test             # Run tests
npm run lint         # Run ESLint
```

**Client:**
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Style
This project follows:
- ESLint for code linting
- Prettier for code formatting
- Conventional Commits for commit messages

---

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Failed**
```bash
# Check MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Check connection string in .env
MONGO_URL=mongodb://localhost:27017/jobs_placements
```

**2. Port Already in Use**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=3001
```

**3. CORS Errors**
```bash
# Add your frontend URL to .env
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

**Developer**: Aakash Joshi  
**Email**: aakashjoshi252@gmail.com  
**GitHub**: [@aakashjoshi252](https://github.com/aakashjoshi252)  
**Repository**: [Jobs_placements](https://github.com/aakashjoshi252/Jobs_placements)

---

## 🚀 Roadmap

- [ ] AI-powered job recommendations
- [ ] Video interview integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Integration with LinkedIn API
- [ ] Automated resume parsing
- [ ] Skill assessment tests

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ by Aakash Joshi**
