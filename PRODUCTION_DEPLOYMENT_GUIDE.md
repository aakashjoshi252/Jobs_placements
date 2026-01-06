# 🚀 Production Deployment Guide - Jobs Placements Portal

Comprehensive guide for deploying your Jobs_placements application to production environments.

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup](#database-setup)
4. [Deployment Platforms](#deployment-platforms)
   - [Vercel (Recommended for Frontend)](#vercel-frontend)
   - [Railway (Recommended for Backend)](#railway-backend)
   - [Render](#render)
   - [AWS](#aws)
   - [DigitalOcean](#digitalocean)
5. [Post-Deployment](#post-deployment)
6. [Monitoring & Maintenance](#monitoring--maintenance)
7. [Troubleshooting](#troubleshooting)

---

## 🔍 Pre-Deployment Checklist

### Security
- [ ] All sensitive data moved to environment variables
- [ ] Strong JWT_SECRET generated (64+ characters)
- [ ] CORS origins properly configured
- [ ] Rate limiting enabled
- [ ] Helmet security headers configured
- [ ] SQL injection protection in place
- [ ] Input validation on all endpoints
- [ ] File upload restrictions configured

### Database
- [ ] MongoDB Atlas cluster created (or alternative)
- [ ] Database indexes created for performance
- [ ] Backup strategy implemented
- [ ] Connection string secured

### Code Quality
- [ ] All tests passing
- [ ] No console.log statements (use logger)
- [ ] Error handling implemented
- [ ] API documentation up to date
- [ ] Dependencies updated and audited

### Performance
- [ ] Compression enabled
- [ ] Static files optimized
- [ ] Database queries optimized
- [ ] Connection pooling configured

---

## ⚙️ Environment Configuration

### 1. Generate Secure Secrets

```bash
# Generate JWT Secret (64 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate Session Secret (32 characters)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### 2. Configure Environment Variables

Copy `.env.production.template` and fill in all required values:

```bash
cp .env.production.template .env
# Edit .env with your actual production values
```

**Critical Variables:**
- `NODE_ENV=production`
- `MONGO_URL` - Your MongoDB connection string
- `JWT_SECRET` - Strong random secret
- `CLIENT_URL` - Your frontend domain
- `PORT` - Server port (usually 3000)

---

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create Account**: https://www.mongodb.com/cloud/atlas

2. **Create Cluster**:
   - Choose M0 (Free tier) or M10+ for production
   - Select region closest to your users
   - Enable backup (paid plans)

3. **Configure Network Access**:
   ```
   Security → Network Access → Add IP Address
   - Add 0.0.0.0/0 (Allow from anywhere)
   - Or add specific IPs of your deployment platform
   ```

4. **Create Database User**:
   ```
   Security → Database Access → Add New User
   - Username: your_app_user
   - Password: [Generate secure password]
   - Role: Read and write to any database
   ```

5. **Get Connection String**:
   ```
   Deployment → Database → Connect → Connect your application
   mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```

6. **Create Indexes** (run in MongoDB shell):
   ```javascript
   // Users collection
   db.users.createIndex({ email: 1 }, { unique: true })
   db.users.createIndex({ role: 1 })
   
   // Jobs collection
   db.jobs.createIndex({ company: 1, status: 1 })
   db.jobs.createIndex({ createdAt: -1 })
   
   // Applications collection
   db.applications.createIndex({ job: 1, applicant: 1 }, { unique: true })
   db.applications.createIndex({ status: 1 })
   ```

---

## 🌐 Deployment Platforms

### Vercel (Frontend)

**Best for**: Next.js/React frontend

#### Setup:

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Configure `vercel.json` in client directory**:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist"
         }
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/"
       }
     ],
     "env": {
       "VITE_API_URL": "@api-url"
     }
   }
   ```

3. **Deploy**:
   ```bash
   cd client
   vercel --prod
   ```

4. **Add Environment Variables** in Vercel Dashboard:
   - `VITE_API_URL` - Your backend URL
   - `VITE_SOCKET_URL` - Your Socket.IO URL

---

### Railway (Backend)

**Best for**: Node.js backend with database

#### Setup:

1. **Create Account**: https://railway.app

2. **Install Railway CLI**:
   ```bash
   npm i -g @railway/cli
   railway login
   ```

3. **Initialize Project**:
   ```bash
   cd server
   railway init
   ```

4. **Add Environment Variables**:
   ```bash
   railway variables set NODE_ENV=production
   railway variables set MONGO_URL="your_mongodb_url"
   railway variables set JWT_SECRET="your_jwt_secret"
   railway variables set CLIENT_URL="https://your-frontend.vercel.app"
   ```

5. **Deploy**:
   ```bash
   railway up
   ```

6. **Get Public URL**:
   ```bash
   railway open
   ```
   Copy the generated URL for your frontend configuration.

#### Railway Configuration:

Create `railway.json` in server directory:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

### Render

**Best for**: Full-stack deployment

#### Backend Setup:

1. **Create Account**: https://render.com

2. **New Web Service**:
   - Connect GitHub repository
   - Select `server` directory
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables** (in Render dashboard):
   ```
   NODE_ENV=production
   MONGO_URL=your_mongodb_url
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=https://your-frontend.onrender.com
   ```

4. **Configure Health Check**:
   - Path: `/health`
   - Port: `3000`

#### Frontend Setup:

1. **New Static Site**:
   - Connect same repository
   - Select `client` directory
   - Build Command: `npm run build`
   - Publish Directory: `dist`

2. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```

---

### AWS (Advanced)

**Best for**: Enterprise-scale applications

#### EC2 Setup:

1. **Launch EC2 Instance**:
   - Ubuntu Server 22.04 LTS
   - t2.micro (free tier) or larger
   - Configure security group (ports 22, 80, 443, 3000)

2. **Connect and Setup**:
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Clone repository
   git clone https://github.com/aakashjoshi252/Jobs_placements.git
   cd Jobs_placements/server
   
   # Install dependencies
   npm install --production
   
   # Create .env file
   nano .env
   # Paste your production environment variables
   
   # Start with PM2
   pm2 start server.js --name jobs-api
   pm2 startup
   pm2 save
   ```

3. **Install Nginx**:
   ```bash
   sudo apt install nginx
   
   # Configure reverse proxy
   sudo nano /etc/nginx/sites-available/jobs-api
   ```

   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/jobs-api /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. **SSL with Let's Encrypt**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

### DigitalOcean

**Best for**: Simple VPS hosting

#### Droplet Setup:

1. **Create Droplet**:
   - Ubuntu 22.04
   - Basic plan ($6/month)
   - Add SSH key

2. **Follow AWS EC2 setup steps** (similar process)

3. **Alternative: App Platform**:
   - Connect GitHub repository
   - Auto-detected Node.js
   - Configure environment variables
   - Deploy

---

## ✅ Post-Deployment

### 1. Verify Deployment

```bash
# Test API health
curl https://your-api-url.com/health

# Test root endpoint
curl https://your-api-url.com/

# Test authentication
curl -X POST https://your-api-url.com/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test@123"}'
```

### 2. DNS Configuration

If using custom domain:

```
Type    Name    Value
A       @       your-server-ip
A       www     your-server-ip
CNAME   api     your-backend-url
```

### 3. SSL Certificate

Ensure HTTPS is enabled:
- Vercel/Render: Automatic
- Railway: Automatic
- AWS/DO: Use Let's Encrypt (certbot)

### 4. Setup Monitoring

**Uptime Monitoring**:
- UptimeRobot (free): https://uptimerobot.com
- Pingdom
- StatusCake

**Error Tracking**:
- Sentry: https://sentry.io
  ```bash
  npm install @sentry/node
  ```

**Application Monitoring**:
- New Relic
- Datadog
- PM2 Plus (for PM2 deployments)

---

## 📊 Monitoring & Maintenance

### Daily Checks
- [ ] Application uptime
- [ ] Error logs
- [ ] Database connections
- [ ] API response times

### Weekly Tasks
- [ ] Review error reports
- [ ] Check disk space
- [ ] Monitor database performance
- [ ] Review security logs

### Monthly Tasks
- [ ] Update dependencies
- [ ] Rotate secrets
- [ ] Review user feedback
- [ ] Performance optimization
- [ ] Database backup verification

### Logging

**View Logs**:
```bash
# Railway
railway logs

# Render
# View in dashboard

# PM2
pm2 logs jobs-api
pm2 monit

# Docker
docker logs <container-id> --follow
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Failed

**Symptoms**: "MongoServerError: Authentication failed"

**Solutions**:
- Verify MONGO_URL is correct
- Check database user credentials
- Ensure IP whitelist includes deployment platform
- Test connection string locally

```bash
# Test MongoDB connection
node -e "require('mongodb').MongoClient.connect(process.env.MONGO_URL, (err, client) => { console.log(err || 'Connected!'); process.exit(); })"
```

#### 2. CORS Errors

**Symptoms**: "Access to fetch has been blocked by CORS policy"

**Solutions**:
- Add frontend URL to `CLIENT_URL` environment variable
- Check `allowedOrigins` array in server.js
- Ensure credentials: true in both frontend and backend

#### 3. 502 Bad Gateway

**Symptoms**: Nginx shows 502 error

**Solutions**:
- Check if Node.js server is running: `pm2 status`
- Verify port configuration
- Check firewall rules
- Review nginx error logs: `sudo tail -f /var/log/nginx/error.log`

#### 4. High Memory Usage

**Solutions**:
- Implement connection pooling
- Add memory limits to PM2:
  ```bash
  pm2 start server.js --max-memory-restart 500M
  ```
- Optimize database queries
- Enable compression

#### 5. Socket.IO Not Connecting

**Solutions**:
- Enable WebSocket in reverse proxy
- Check CORS configuration for Socket.IO
- Verify firewall allows WebSocket connections
- Test with polling fallback

---

## 📱 Platform-Specific Commands

### Railway
```bash
# View logs
railway logs

# Shell access
railway shell

# Redeploy
railway up --detach

# Check status
railway status
```

### Render
```bash
# Trigger deployment
git push origin main

# View in dashboard
open https://dashboard.render.com
```

### PM2 (VPS)
```bash
# Restart
pm2 restart jobs-api

# Stop
pm2 stop jobs-api

# View logs
pm2 logs jobs-api

# Monitor
pm2 monit

# List processes
pm2 list
```

---

## 🎯 Performance Optimization

### Backend

1. **Enable Caching**:
   ```javascript
   // Add Redis for session storage
   const Redis = require('ioredis');
   const redis = new Redis(process.env.REDIS_URL);
   ```

2. **Database Indexing**:
   - Index frequently queried fields
   - Use compound indexes for complex queries

3. **Connection Pooling**:
   Already configured in `config/config.js`

4. **Compression**:
   Already enabled in server.js

### Frontend

1. **Code Splitting**
2. **Lazy Loading**
3. **Image Optimization**
4. **CDN for Static Assets**

---

## 🔐 Security Best Practices

1. **Never commit secrets** to Git
2. **Use environment variables** for all sensitive data
3. **Rotate secrets** regularly (every 90 days)
4. **Enable 2FA** on all accounts (GitHub, hosting, database)
5. **Keep dependencies updated**: `npm audit fix`
6. **Monitor for vulnerabilities**: `npm audit`
7. **Use HTTPS** everywhere
8. **Implement rate limiting** (already configured)
9. **Sanitize user input** (already implemented)
10. **Regular security audits**

---

## 📞 Support & Resources

- **Documentation**: See README.md and other guides
- **Issues**: https://github.com/aakashjoshi252/Jobs_placements/issues
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **Railway Docs**: https://docs.railway.app/
- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs

---

## ✅ Production Deployment Checklist

### Pre-Launch
- [ ] All environment variables configured
- [ ] Database indexed and backed up
- [ ] SSL certificate installed
- [ ] Custom domain configured (if applicable)
- [ ] Error monitoring setup (Sentry)
- [ ] Uptime monitoring configured
- [ ] Email service tested
- [ ] File uploads tested
- [ ] Socket.IO connections tested
- [ ] All API endpoints tested
- [ ] Load testing completed
- [ ] Security audit performed

### Launch Day
- [ ] Final backup of database
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Verify all services running
- [ ] Test critical user flows
- [ ] Monitor error logs
- [ ] Announce launch 🎉

### Post-Launch
- [ ] Monitor performance metrics
- [ ] Respond to user feedback
- [ ] Fix any critical bugs immediately
- [ ] Plan for scaling if needed

---

**🎉 Congratulations on your production deployment!**

For questions or issues, create an issue in the repository or refer to the troubleshooting section above.
