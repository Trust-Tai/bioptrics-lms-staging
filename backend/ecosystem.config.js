module.exports = {
  apps: [
    {
      name: 'bioptrics-lms-backend',
      script: 'src/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        // Local Development Environment
        NODE_ENV: 'development',
        PORT: 5000,
        MONGO_URL: 'mongodb://localhost:27017/bioptrics-lms-local',
        JWT_SECRET: 'lms-local-development-secret-key-2024',
        JWT_EXPIRE: '7d',
        FRONTEND_URL: 'http://localhost:4000',
        LOG_LEVEL: 'debug'
      },
      env_production: {
        // Production Environment - Same Atlas cluster as survey, different database
        NODE_ENV: 'production',
        PORT: 5000,
        MONGO_URL: 'mongodb+srv://tayeshobajo:1Manchester_sm@kv8slwx.mongodb.net/bioptrics-lms?retryWrites=true&w=majority',
        JWT_SECRET: 'lms-production-secret-key-2024-super-secure',
        JWT_EXPIRE: '7d',
        FRONTEND_URL: 'https://pulse-dev.bioptrics.com',
        LOG_LEVEL: 'info'
      },
    },
  ],
};
