/**
 * PM2 Ecosystem Configuration for Production
 * 
 * Usage:
 * - Start: pm2 start ecosystem.config.js
 * - Reload: pm2 reload ecosystem.config.js
 * - Stop: pm2 stop ecosystem.config.js
 * - Monitor: pm2 monit
 * - Logs: pm2 logs
 */

module.exports = {
  apps: [
    {
      name: 'jobs-placements-api',
      script: './server.js',
      
      // Instance configuration
      instances: process.env.NODE_ENV === 'production' ? 'max' : 1,
      exec_mode: 'cluster',
      
      // Environment variables
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      
      // Auto-restart configuration
      autorestart: true,
      watch: false, // Set to true in development if needed
      max_memory_restart: '1G',
      
      // Logging
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Advanced configuration
      merge_logs: true,
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Source maps support
      source_map_support: true,
      
      // Kill timeout
      kill_timeout: 5000,
      
      // Graceful shutdown
      listen_timeout: 10000,
      shutdown_with_message: false,
      
      // Wait for ready
      wait_ready: false,
      
      // Cron restart (restart daily at 4 AM)
      cron_restart: '0 4 * * *',
      
      // Monitoring
      instance_var: 'INSTANCE_ID',
      
      // Node.js args
      node_args: '--max-old-space-size=2048',
      
      // Ignore watch
      ignore_watch: [
        'node_modules',
        'logs',
        'uploads',
        '.git',
        '*.log',
        '.env',
      ],
    },
  ],
  
  // Deployment configuration
  deploy: {
    production: {
      user: 'ubuntu', // SSH user
      host: ['your-server-ip'], // Server IP(s)
      ref: 'origin/main',
      repo: 'git@github.com:aakashjoshi252/Jobs_placements.git',
      path: '/var/www/jobs-placements',
      'ssh_options': 'StrictHostKeyChecking=no',
      'post-deploy': 'cd server && npm install && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production',
      },
    },
  },
};
