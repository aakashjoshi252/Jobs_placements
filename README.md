# Job Placements Portal

 A comprehensive MERN stack application for job placements, recruitment, and candidate management.

## 🚀 Features

- **User Management**: Separate roles for candidates and recruiters
- **Job Listings**: Create, update, and manage job postings
- **Application Tracking**: Apply to jobs and track application status
- **Real-time Chat**: Socket.io powered messaging between recruiters and candidates
- **Resume Management**: Upload and manage resumes
- **Dashboard**: Analytics and insights for recruiters
- **Blog System**: Company blog and content management
- **Notifications**: Real-time notifications for important events

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 6.0
- npm >= 9.0.0

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/aakashjoshi252/Jobs_placements.git
cd Jobs_placements
```

### 2. Setup Server

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
```

### 3. Setup Client (if applicable)

```bash
cd client
npm install
cp .env.example .env
# Edit .env with your configuration
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the server directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobplacements
JWT_SECRET=your-super-secure-jwt-secret-at-least-32-characters
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

See `.env.example` for all configuration options.

## 🚀 Running the Application

### Development Mode

```bash
# Server
cd server
npm run dev

# Client (in another terminal)
cd client
npm run dev
```

### Production Mode

```bash
cd server
npm start
```

### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🧪 Testing

```bash
cd server

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Generate coverage report
npm test -- --coverage
```

## 📊 Database Setup

### Create Indexes (Important for Performance)

```bash
cd server
node scripts/create-indexes.js
```

## 🔍 Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

## 📚 API Documentation

API documentation is available at `/api/v1/docs` when the server is running.

### Main Endpoints

#### Authentication
- `POST /user/register` - Register new user
- `POST /user/login` - Login user
- `POST /user/logout` - Logout user
- `GET /user/me` - Get current user

#### Jobs
- `GET /jobs` - Get all jobs
- `GET /jobs/:id` - Get single job
- `POST /jobs` - Create job (Recruiter only)
- `PUT /jobs/:id` - Update job (Recruiter only)
- `DELETE /jobs/:id` - Delete job (Recruiter only)

#### Applications
- `GET /application` - Get user applications
- `POST /application` - Apply to job
- `PUT /application/:id/status` - Update status (Recruiter only)

#### Health Checks
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health with dependencies
- `GET /health/ready` - Kubernetes readiness probe
- `GET /health/live` - Kubernetes liveness probe

## 🏗️ Project Structure

```
server/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middlewares/     # Express middlewares
├── models/          # Mongoose models
├── routes/          # API routes
├── utils/           # Utility functions
├── scripts/         # Utility scripts
├── tests/           # Test files
│   ├── unit/        # Unit tests
│   └── integration/ # Integration tests
└── server.js        # Entry point
```

## 🐳 Docker Deployment

### Build Docker Image

```bash
cd server
docker build -t job-placements-api .
```

### Run with Docker

```bash
docker run -p 5000:5000 --env-file .env job-placements-api
```

## 🔐 Security

- **Authentication**: JWT-based authentication
- **Password Hashing**: bcrypt with configurable salt rounds
- **Rate Limiting**: Express rate limit middleware
- **Helmet**: Security headers
- **CORS**: Configurable CORS policy
- **Input Validation**: Express-validator and Joi
- **XSS Protection**: Input sanitization

## 📈 Performance

- **Compression**: Response compression middleware
- **Database Indexing**: Optimized indexes for common queries
- **Connection Pooling**: MongoDB connection pooling
- **Caching**: Ready for Redis integration

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## 📝 License

ISC License - See LICENSE file for details

## 👨‍💻 Author

Aakash Joshi
- GitHub: [@aakashjoshi252](https://github.com/aakashjoshi252)

## 🆘 Support

For support, please open an issue in the GitHub repository.

## 📌 Roadmap

- [ ] Add unit and integration tests
- [ ] Implement Redis caching
- [ ] Add email notifications
- [ ] Implement advanced search and filters
- [ ] Add analytics dashboard
- [ ] Mobile app development
- [ ] CI/CD pipeline setup
- [ ] Performance monitoring integration