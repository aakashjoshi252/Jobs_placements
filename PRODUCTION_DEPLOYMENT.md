# 🚀 Production Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Server Setup](#server-setup)
3. [Database Configuration](#database-configuration)
4. [Application Deployment](#application-deployment)
5. [SSL/HTTPS Setup](#ssl-https-setup)
6. [Monitoring & Logging](#monitoring--logging)
7. [Backup Strategy](#backup-strategy)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js**: v16.x or higher (LTS recommended)
- **MongoDB**: v5.x or higher
- **Nginx**: Latest stable version
- **PM2**: Latest version (`npm install -g pm2`)
- **Git**: For code deployment

### Recommended Specifications
- **CPU**: 2+ cores
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 50GB+ SSD
- **OS**: Ubuntu 20.04 LTS or higher

---

## Server Setup

### 1. Initial Server Configuration

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (using NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2. Create Application User

```bash
# Create dedicated user for application
sudo adduser jobsapp
sudo usermod -aG sudo jobsapp

# Switch to application user
su - jobsapp
```

---

## Database Configuration

### 1. MongoDB Security

```bash
# Connect to MongoDB
mongosh

# Create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "your_secure_password_here",
  roles: [{ role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase"]
})

# Create application database and user
use jobs_placements_prod
db.createUser({
  user: "jobsapp",
  pwd: "your_app_password_here",
  roles: [{ role: "readWrite", db: "jobs_placements_prod" }]
})

exit
```

### 2. Enable MongoDB Authentication

```bash
# Edit MongoDB config
sudo nano /etc/mongod.conf

# Add/modify:
security:
  authorization: enabled

# Restart MongoDB
sudo systemctl restart mongod
```

### 3. MongoDB Connection String

```env
MONGO_URL=mongodb://jobsapp:your_app_password_here@localhost:27017/jobs_placements_prod?authSource=jobs_placements_prod
```

---

## Application Deployment

### 1. Clone Repository

```bash
# Create application directory
sudo mkdir -p /var/www/jobs-placements
sudo chown -R jobsapp:jobsapp /var/www/jobs-placements

# Clone repository
cd /var/www/jobs-placements
git clone https://github.com/aakashjoshi252/Jobs_placements.git .
```

### 2. Install Dependencies

```bash
# Server dependencies
cd /var/www/jobs-placements/server
npm install --production

# Client dependencies
cd /var/www/jobs-placements/client
npm install
npm run build
```

### 3. Configure Environment

```bash
# Copy and edit production environment file
cd /var/www/jobs-placements/server
cp .env.production .env
nano .env

# Fill in all production values:
# - Database credentials
# - JWT secrets
# - API keys
# - Domain URLs
# - Email configuration
# etc.
```

### 4. Create Required Directories

```bash
# Create logs directory
mkdir -p /var/www/jobs-placements/server/logs

# Create uploads directory
mkdir -p /var/www/jobs-placements/server/uploads

# Set proper permissions
chmod 755 /var/www/jobs-placements/server/logs
chmod 755 /var/www/jobs-placements/server/uploads
```

### 5. Start Application with PM2

```bash
cd /var/www/jobs-placements/server

# Start application
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
# Copy and run the command it outputs

# Monitor application
pm2 monit

# View logs
pm2 logs jobs-placements-api
```

---

## SSL/HTTPS Setup

### 1. Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Configure Nginx

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/jobs-placements
```

```nginx
# Upstream Node.js application
upstream nodejs_backend {
    least_conn;
    server 127.0.0.1:3000 max_fails=3 fail_timeout=30s;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name api.yourcompany.com;
    
    # Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.yourcompany.com;
    
    # SSL Configuration (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/api.yourcompany.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourcompany.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Logging
    access_log /var/log/nginx/jobs-placements-access.log;
    error_log /var/log/nginx/jobs-placements-error.log;
    
    # Client body size limit
    client_max_body_size 10M;
    
    # Proxy settings
    location / {
        proxy_pass http://nodejs_backend;
        proxy_http_version 1.1;
        
        # Headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Caching
        proxy_cache_bypass $http_upgrade;
    }
    
    # Socket.IO specific configuration
    location /socket.io/ {
        proxy_pass http://nodejs_backend/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket timeout
        proxy_read_timeout 86400;
    }
    
    # Static files
    location /uploads/ {
        alias /var/www/jobs-placements/server/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3. Enable Site and Obtain SSL

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/jobs-placements /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Obtain SSL certificate
sudo certbot --nginx -d api.yourcompany.com

# Setup auto-renewal
sudo certbot renew --dry-run
```

---

## Monitoring & Logging

### 1. PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# Application status
pm2 status

# View logs
pm2 logs
pm2 logs jobs-placements-api --lines 100

# Clear logs
pm2 flush
```

### 2. Setup Log Rotation

```bash
# Install PM2 log rotate module
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

### 3. System Monitoring

```bash
# Install monitoring tools
sudo apt install -y htop iotop netstat

# Monitor system resources
htop

# Check disk usage
df -h

# Check memory usage
free -m
```

### 4. MongoDB Monitoring

```bash
# MongoDB status
sudo systemctl status mongod

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Database stats
mongosh jobs_placements_prod --eval "db.stats()"
```

---

## Backup Strategy

### 1. Database Backup Script

```bash
# Create backup script
sudo nano /usr/local/bin/backup-mongodb.sh
```

```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/backup/mongodb"
DATE=$(date +"%Y%m%d_%H%M%S")
DB_NAME="jobs_placements_prod"
RETENTION_DAYS=7

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
mongodump --db $DB_NAME --out $BACKUP_DIR/$DATE

# Compress backup
tar -czf $BACKUP_DIR/$DATE.tar.gz -C $BACKUP_DIR $DATE
rm -rf $BACKUP_DIR/$DATE

# Remove old backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: $DATE.tar.gz"
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-mongodb.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-mongodb.sh >> /var/log/mongodb-backup.log 2>&1
```

### 2. Application Backup

```bash
# Backup uploads directory daily
rsync -avz /var/www/jobs-placements/server/uploads/ /backup/uploads/
```

---

## Troubleshooting

### Common Issues

#### 1. Application Won't Start

```bash
# Check PM2 logs
pm2 logs jobs-placements-api --lines 50

# Check environment variables
pm2 env 0

# Restart application
pm2 restart jobs-placements-api
```

#### 2. Database Connection Failed

```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Test connection
mongosh "mongodb://jobsapp:password@localhost:27017/jobs_placements_prod"
```

#### 3. High Memory Usage

```bash
# Check memory usage
pm2 monit

# Restart with lower memory
pm2 restart jobs-placements-api --max-memory-restart 800M
```

#### 4. Nginx Errors

```bash
# Check Nginx logs
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Health Checks

```bash
# Check API health
curl https://api.yourcompany.com/health

# Check specific endpoints
curl https://api.yourcompany.com/api/v1/

# Check Socket.IO
curl https://api.yourcompany.com/socket.io/
```

---

## Security Checklist

- [ ] MongoDB authentication enabled
- [ ] Strong passwords for all accounts
- [ ] JWT secrets are random and secure (32+ characters)
- [ ] Environment variables properly set
- [ ] Firewall configured (UFW)
- [ ] SSL/HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Regular security updates
- [ ] Backup strategy in place
- [ ] Log rotation configured
- [ ] Monitoring enabled

---

## Maintenance Commands

```bash
# Update application
cd /var/www/jobs-placements
git pull origin main
cd server
npm install --production
pm2 reload ecosystem.config.js

# View application status
pm2 status

# Restart application
pm2 restart jobs-placements-api

# Stop application
pm2 stop jobs-placements-api

# Delete from PM2
pm2 delete jobs-placements-api

# Clear logs
pm2 flush

# Update PM2
pm2 update
```

---

## Support

For issues or questions:
- Check logs: `pm2 logs`
- Review documentation
- Contact: aakashjoshi252@gmail.com

---

**Last Updated**: January 2026
