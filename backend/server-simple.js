require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

// Start server immediately (don't wait for DB)
const server = require('http').createServer(app);

// Try to initialize Socket.io when running inside Docker/dev
try {
  const { initSocket } = require('./src/sockets');
  initSocket(server);
} catch (err) {
  // If socket init fails, log and continue — useful during local debugging
  console.error('Socket.io not initialized in server-simple:', err.message || err);
}

server.listen(PORT, () => {
  console.log(`🚀 Escambo API running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Server started successfully!`);
});

module.exports = server;
