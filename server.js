const config = require('./comman/config/env.config');
const http = require('http');
const app = require('./app');

const port = config.SERVER_PORT;
const server = http.createServer(app);

server.listen(port);