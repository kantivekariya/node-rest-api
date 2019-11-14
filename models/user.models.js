const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    firtsName: {
        type: String,
        require: false
    },
    lastName: {
        type: String,
        require: false
    },
    age: {
        type: Number,
        require: false
    },
    phone: {
        type: Number,
        require: false
    },
    email: {
        type: String,
        require: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Users', postSchema);