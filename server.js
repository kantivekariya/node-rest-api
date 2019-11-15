const config = require('./comman/config/env.config');
const http = require('http');
const app = require('./app');

const port = config.SERVER_PORT || 3000;
const server = http.createServer(app);

server.listen(port);