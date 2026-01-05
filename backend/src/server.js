const http = require('http');
const app = require('./app');
const env = require('./config/env');
const initSocket = require('./socket');

const server = http.createServer(app);

// Initialize Socket.io
const io = initSocket(server);

// Make io accessible globally via app
app.set('io', io);

// Start server
server.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Ngulikang API running on port ${env.port}`);
});
