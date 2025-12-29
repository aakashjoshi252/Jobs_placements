# 🚀 Job Placements Portal

A full-stack MERN application for managing job postings, applications, and recruitment workflows with role-based access control.

![Project Status](https://img.shields.io/badge/status-in%20development-yellow)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.x-brightgreen)
![License](https://img.shields.io/badge/license-ISC-blue)

## 📸 Screenshots

> 📝 **Note:** Screenshots will be added after deployment

## ✨ Features

### For Candidates
- ✅ User registration and authentication with JWT
- ✅ Browse and search job listings with filters
- ✅ Apply to jobs with resume upload (PDF/DOC supported)
- ✅ Track application status in real-time
- ✅ Update profile and resume
- ✅ Real-time notifications for application updates
- ✅ Dashboard with applied jobs overview

### For Recruiters
- ✅ Post and manage job openings
- ✅ Review and manage applications
- ✅ Shortlist, accept, or reject candidates
- ✅ Analytics dashboard with hiring metrics
- ✅ Application status management
- ✅ Search and filter candidates

### Admin Features
- ✅ User management (view, edit, delete users)
- ✅ System analytics and reports
- ✅ Content moderation
- ✅ Platform-wide settings

### Technical Features
- ✅ Secure authentication with HTTP-only cookies
- ✅ File upload with validation
- ✅ Real-time updates using Socket.IO
- ✅ Rate limiting to prevent abuse
- ✅ Comprehensive error handling
- ✅ Request validation
- ✅ Logging system
- ✅ CORS protection

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.0 - UI library
- **Redux Toolkit** 2.11.0 - State management
- **React Router** 7.9.5 - Client-side routing
- **Tailwind CSS** 4.1.17 - Utility-first CSS framework
- **Formik** 2.4.9 & **Yup** 1.7.1 - Form handling and validation
- **Axios** 1.13.2 - HTTP client
- **Socket.IO Client** 4.8.1 - Real-time bidirectional communication
- **React Icons** 5.5.0 - Icon library
- **Vite** 7.2.2 - Next generation build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express** 5.1.0 - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** 8.19.3 - MongoDB object modeling
- **JWT** 9.0.3 - JSON Web Tokens for authentication
- **Bcrypt.js** 3.0.3 - Password hashing
- **Multer** 2.0.2 - File upload handling
- **Socket.IO** 4.8.1 - Real-time communication
- **Winston** - Logging library
- **Helmet** - Security headers
- **Express Rate Limit** - API rate limiting
- **Express Validator** - Request validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** >= 18.x ([Download](https://nodejs.org/))
- **MongoDB** >= 6.x ([Download](https://www.mongodb.com/try/download/community)) or MongoDB Atlas account
- **npm** or **yarn** package manager
- **Git** for version control

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/aakashjoshi252/Jobs_placements.git
cd Jobs_placements
```

### 2. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file from template
cp .env.example .env

# Edit .env file with your configurations
# Required variables: MONGO_URI, JWT_SECRET, CLIENT_URL
nano .env  # or use any text editor
```

**Important Environment Variables:**
- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT (use a strong random string)
- `CLIENT_URL`: Frontend URL (default: http://localhost:5173)

### 3. Frontend Setup
```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Create environment file from template
cp .env.example .env

# Edit .env with your backend API URL
nano .env  # or use any text editor
```

### 4. Run the Application

**Development Mode (Recommended):**

```bash
# Terminal 1 - Start Backend Server
cd server
npm run dev
# Server will run on http://localhost:5000

# Terminal 2 - Start Frontend Development Server
cd client
npm run dev
# Client will run on http://localhost:5173
```

**Production Mode:**
```bash
# Backend
cd server
npm start

# Frontend (build first)
cd client
npm run build
npm run preview
```

### 5. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api/v1
- **Health Check:** http://localhost:5000/health

## 📁 Project Structure

```
Jobs_placements/
├── client/                     # React frontend
│   ├── src/
│   │   ├── api/               # API service functions
│   │   ├── components/        # Reusable React components
│   │   ├── pages/             # Page components (routes)
│   │   ├── redux/             # Redux store, slices, actions
│   │   ├── utils/             # Helper functions
│   │   ├── App.jsx            # Main App component
│   │   └── main.jsx           # Entry point
│   ├── public/                # Static assets
│   ├── .env.example           # Environment template
│   ├── package.json           # Dependencies
│   ├── vite.config.js         # Vite configuration
│   └── tailwind.config.js     # Tailwind CSS config
│
├── server/                     # Express backend
│   ├── config/                # Configuration files
│   │   └── db.js              # Database connection
│   ├── controllers/           # Route controllers
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   └── applicationController.js
│   ├── middlewares/           # Custom middleware
│   │   ├── auth.js            # Authentication middleware
│   │   ├── errorMiddleware.js # Error handling
│   │   ├── security.js        # Rate limiting
│   │   └── validator.js       # Request validation
│   ├── models/                # Mongoose schemas
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   └── applicationRoutes.js
│   ├── utils/                 # Utility functions
│   │   ├── logger.js          # Winston logger
│   │   └── errorHandler.js    # Custom error class
│   ├── constants/             # Application constants
│   │   └── index.js
│   ├── uploads/               # File upload directory
│   ├── logs/                  # Application logs
│   ├── .env.example           # Environment template
│   ├── server.js              # Entry point
│   └── package.json           # Dependencies
│
├── .gitignore                 # Git ignore rules
├── README.md                  # Project documentation
└── CONTRIBUTING.md            # Contribution guidelines
```

## 🔐 Environment Variables

### Server Environment (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/jobs_placements

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Frontend
CLIENT_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=600000
RATE_LIMIT_MAX_REQUESTS=100
```

### Client Environment (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000

# App Settings
VITE_APP_NAME=Job Placements Portal
VITE_MAX_FILE_SIZE=5242880
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login user | No |
| GET | `/api/v1/auth/logout` | Logout user | Yes |
| GET | `/api/v1/auth/me` | Get current user | Yes |
| PUT | `/api/v1/auth/updateprofile` | Update profile | Yes |
| PUT | `/api/v1/auth/updatepassword` | Update password | Yes |

### Jobs
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/jobs` | Get all jobs | No |
| GET | `/api/v1/jobs/:id` | Get single job | No |
| POST | `/api/v1/jobs` | Create job | Yes (Recruiter) |
| PUT | `/api/v1/jobs/:id` | Update job | Yes (Recruiter) |
| DELETE | `/api/v1/jobs/:id` | Delete job | Yes (Recruiter) |
| GET | `/api/v1/jobs/recruiter/me` | Get my jobs | Yes (Recruiter) |

### Applications
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/applications` | Get user applications | Yes |
| GET | `/api/v1/applications/:id` | Get single application | Yes |
| POST | `/api/v1/applications` | Apply to job | Yes (Candidate) |
| PUT | `/api/v1/applications/:id/status` | Update status | Yes (Recruiter) |
| DELETE | `/api/v1/applications/:id` | Withdraw application | Yes (Candidate) |
| GET | `/api/v1/applications/job/:jobId` | Get job applications | Yes (Recruiter) |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health status |

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test

# Run tests with coverage
npm test -- --coverage
```

## 🚢 Deployment

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set root directory to `client`
4. Configure environment variables
5. Deploy

### Backend Deployment (Railway/Render)

1. Create account on [Railway](https://railway.app) or [Render](https://render.com)
2. Connect GitHub repository
3. Set root directory to `server`
4. Configure environment variables
5. Set start command: `npm start`
6. Deploy

### Environment Variables for Production

Ensure you set these in your deployment platform:
- `MONGO_URI` (Use MongoDB Atlas)
- `JWT_SECRET` (Strong random string)
- `NODE_ENV=production`
- `CLIENT_URL` (Your deployed frontend URL)

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Quick Contributing Steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Aakash Joshi**
- GitHub: [@aakashjoshi252](https://github.com/aakashjoshi252)
- Repository: [Jobs_placements](https://github.com/aakashjoshi252/Jobs_placements)

## 🐛 Known Issues

- [ ] Email notifications not yet implemented
- [ ] Advanced search filters need improvement
- [ ] Mobile responsiveness can be enhanced
- [ ] Add pagination for large job listings

## 🗺️ Roadmap

### Phase 1 (Current)
- [x] Basic authentication system
- [x] Job posting and application flow
- [x] Real-time notifications
- [x] Dashboard for both roles

### Phase 2 (Upcoming)
- [ ] Email verification for new users
- [ ] Password reset functionality
- [ ] Advanced search with filters
- [ ] Export applications to CSV/PDF
- [ ] Admin dashboard with analytics

### Phase 3 (Future)
- [ ] Real-time chat between recruiters and candidates
- [ ] Video interview integration
- [ ] AI-powered job recommendations
- [ ] Resume parser using ML
- [ ] Mobile app (React Native)
- [ ] Payment integration for premium features

## 📞 Support

For support, open an issue in the repository or contact the maintainer.

## 🙏 Acknowledgments

- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- UI inspiration from modern job portals
- Community support from Stack Overflow and GitHub

---

⭐ **Star this repository if you find it helpful!**

💼 **Perfect for portfolio projects and learning MERN stack development**