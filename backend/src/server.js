const http = require('http');
const app = require('./app');
const env = require('./config/env');
const { Server } = require('socket.io');
const socketHandler = require('./socket');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"]
  }
});

socketHandler(io);

// Make io accessible globally if needed (optional)
global.io = io;

server.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Ngulikang API running on port ${env.port}`);
});
