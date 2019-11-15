const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dbConfig = require('./comman/services/mongoose.service');

app.use(bodyParser.json());
// Routes
const routes = require('./routes/routes.config');
app.use('/', routes);

// Content header
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});

// Connect Database
dbConfig();

module.exports = app;