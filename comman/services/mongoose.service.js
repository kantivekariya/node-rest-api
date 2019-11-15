const mongoose = require('mongoose');
const config = require('../config/env.config');

const connectWithRetry = async () => {
    console.log('MongoDB connection with retry')
    await mongoose.connect(config.DB_CONNECTION, { useNewUrlParser: true }).then(() => {
        console.log('MongoDB is connected');
    }).catch(err => {
        console.log('MongoDB connection unsuccessful, retry after 5 seconds. ');
        setTimeout(connectWithRetry, 5000);
    });
};

module.exports = connectWithRetry;