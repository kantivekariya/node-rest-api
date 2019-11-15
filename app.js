const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv/config');

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
const connectWithRetry = () => {
    console.log('MongoDB connection with retry')
    mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }).then(() => {
        console.log('MongoDB is connected');
    }).catch(err => {
        console.log('MongoDB connection unsuccessful, retry after 5 seconds. ');
        setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();
// Start listening Server
// app.listen(process.env.SERVER_PORT, () => {
//     console.log("Server Listening at", process.env.SERVER_PORT);
// })
module.exports = app;