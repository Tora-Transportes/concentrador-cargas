module.exports = {
  apps: [
    {
      name: "BACKEND_CONCENTRADOR",
      script: "./src/index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      exec_mode: "fork",
      max_memory_restart: "300M",
    },
  ],
};
