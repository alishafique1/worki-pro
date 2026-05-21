module.exports = {
  apps: [
    {
      name: 'thehelper-api',
      cwd: './',
      script: 'node',
      args: 'scripts/start-production.mjs',
      env: {
        NODE_ENV: 'production',
        PORT: '3001',
      },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      restart_delay: 5000,
      max_restarts: 10,
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      kill_timeout: 10000,
      listen_timeout: 3000,
      shutdown_with_message: true,
    },
  ],
}
