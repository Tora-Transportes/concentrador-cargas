module.exports = {
  apps: [
    {
      name: 'SCRAPING_CONCENTRADOR',
      script: './job.js',
      instances: 1,
      autorestart: true,
      watch: false,
      exec_mode: 'fork',
      max_memory_restart: '300M',
    },
  ],
};
