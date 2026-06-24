import http from 'http';
import app from './src/app.js';
import { setupSocket } from './src/socket/index.js';
import env from './src/config/env.js';
import fs from 'fs';

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}

const server = http.createServer(app);

// Setup Socket.io
const io = setupSocket(server);
app.set('io', io);

const PORT = env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║   🎓 Campus Skill Exchange API              ║
║   Server running on port ${PORT}               ║
║   Environment: ${env.NODE_ENV.padEnd(28)}║
║   Health: http://localhost:${PORT}/api/health   ║
╚══════════════════════════════════════════════╝
  `);
});

export default server;
