#!/usr/bin/env node

/**
 * Production Readiness Check Script
 * Validates configuration and setup before production deployment
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class ProductionChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.passed = [];
    this.envPath = path.join(__dirname, '..', '.env');
  }

  check(name, fn) {
    try {
      const result = fn();
      if (result === true) {
        this.passed.push(`✅ ${name}`);
      } else if (result === 'warning') {
        this.warnings.push(`⚠️  ${name}`);
      } else {
        this.errors.push(`❌ ${name}: ${result}`);
      }
    } catch (error) {
      this.errors.push(`❌ ${name}: ${error.message}`);
    }
  }

  getEnvValue(key) {
    if (!fs.existsSync(this.envPath)) {
      throw new Error('.env file not found');
    }
    const content = fs.readFileSync(this.envPath, 'utf8');
    const match = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
    return match ? match[1].trim() : null;
  }

  run() {
    console.log('\n🔍 Running Production Readiness Checks...\n');

    // Environment File
    this.check('Environment file exists', () => {
      return fs.existsSync(this.envPath) || '.env file not found';
    });

    // Node Environment
    this.check('NODE_ENV set to production', () => {
      const env = this.getEnvValue('NODE_ENV');
      return env === 'production' || `NODE_ENV is '${env}', should be 'production'`;
    });

    // Database Configuration
    this.check('MongoDB URL configured', () => {
      const url = this.getEnvValue('MONGO_URL');
      if (!url) return 'MONGO_URL not set';
      if (url.includes('localhost') || url.includes('127.0.0.1')) {
        return 'MONGO_URL points to localhost, should use cloud database';
      }
      if (!url.startsWith('mongodb://') && !url.startsWith('mongodb+srv://')) {
        return 'Invalid MongoDB connection string format';
      }
      return true;
    });

    // JWT Secret
    this.check('JWT_SECRET is strong', () => {
      const secret = this.getEnvValue('JWT_SECRET');
      if (!secret) return 'JWT_SECRET not set';
      if (secret.length < 32) return `JWT_SECRET is only ${secret.length} characters, should be 32+`;
      if (secret === 'your_jwt_secret_here' || secret.includes('example')) {
        return 'JWT_SECRET appears to be placeholder value';
      }
      return true;
    });

    // Frontend URLs
    this.check('Frontend URL configured', () => {
      const clientUrl = this.getEnvValue('CLIENT_URL');
      const frontendUrl = this.getEnvValue('FRONTEND_URL');
      if (!clientUrl && !frontendUrl) return 'CLIENT_URL or FRONTEND_URL not set';
      const url = clientUrl || frontendUrl;
      if (url.includes('localhost') || url.includes('127.0.0.1')) {
        return 'Frontend URL points to localhost, should be production domain';
      }
      if (!url.startsWith('https://') && !url.startsWith('http://')) {
        return 'Frontend URL should include protocol (https://)';
      }
      return true;
    });

    // Port Configuration
    this.check('PORT configured', () => {
      const port = this.getEnvValue('PORT');
      if (!port) return 'warning'; // Will use default
      return true;
    });

    // Email Configuration (optional)
    this.check('Email service configured (optional)', () => {
      const smtpHost = this.getEnvValue('SMTP_HOST');
      const smtpUser = this.getEnvValue('SMTP_USER');
      if (!smtpHost || !smtpUser) return 'warning';
      return true;
    });

    // File Upload Configuration
    this.check('File upload service configured', () => {
      const cloudName = this.getEnvValue('CLOUDINARY_CLOUD_NAME');
      const apiKey = this.getEnvValue('CLOUDINARY_API_KEY');
      const apiSecret = this.getEnvValue('CLOUDINARY_API_SECRET');
      
      if (!cloudName || !apiKey || !apiSecret) {
        return 'warning'; // File uploads might not work
      }
      return true;
    });

    // Dependencies
    this.check('package.json exists', () => {
      return fs.existsSync(path.join(__dirname, '..', 'package.json')) || 'package.json not found';
    });

    this.check('node_modules installed', () => {
      const nodeModules = path.join(__dirname, '..', 'node_modules');
      if (!fs.existsSync(nodeModules)) {
        return 'node_modules not found, run npm install';
      }
      return true;
    });

    // Security Files
    this.check('No .env in .gitignore check', () => {
      const gitignorePath = path.join(__dirname, '..', '..', '.gitignore');
      if (!fs.existsSync(gitignorePath)) return 'warning';
      const content = fs.readFileSync(gitignorePath, 'utf8');
      return content.includes('.env') || '.env should be in .gitignore';
    });

    // Critical Files
    const criticalFiles = [
      'server.js',
      'config/config.js',
      'middlewares/errorMiddleware.js',
      'middlewares/security.js',
    ];

    criticalFiles.forEach(file => {
      this.check(`${file} exists`, () => {
        return fs.existsSync(path.join(__dirname, '..', file)) || `${file} not found`;
      });
    });

    // Display Results
    this.displayResults();
  }

  displayResults() {
    console.log('\n' + '='.repeat(60));
    console.log('PRODUCTION READINESS CHECK RESULTS');
    console.log('='.repeat(60) + '\n');

    if (this.passed.length > 0) {
      console.log('🎉 Passed Checks:');
      this.passed.forEach(msg => console.log(`  ${msg}`));
      console.log('');
    }

    if (this.warnings.length > 0) {
      console.log('⚠️  Warnings (optional features):');
      this.warnings.forEach(msg => console.log(`  ${msg}`));
      console.log('');
    }

    if (this.errors.length > 0) {
      console.log('❌ Failed Checks (must fix):');
      this.errors.forEach(msg => console.log(`  ${msg}`));
      console.log('');
    }

    console.log('='.repeat(60));
    console.log(`Total: ${this.passed.length} passed, ${this.warnings.length} warnings, ${this.errors.length} errors`);
    console.log('='.repeat(60) + '\n');

    if (this.errors.length === 0) {
      console.log('✅ 🎉 All critical checks passed! Ready for production deployment.\n');
      process.exit(0);
    } else {
      console.log('❌ 🚫 Not ready for production. Please fix the errors above.\n');
      console.log('💡 Tips:');
      console.log('  - Copy .env.production.template to .env');
      console.log('  - Replace all placeholder values with actual production credentials');
      console.log('  - Use MongoDB Atlas for production database');
      console.log('  - Generate strong secrets: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))")\n');
      process.exit(1);
    }
  }
}

// Run checks
if (require.main === module) {
  const checker = new ProductionChecker();
  checker.run();
}

module.exports = ProductionChecker;
