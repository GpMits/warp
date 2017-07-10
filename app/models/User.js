var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    username: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    salt: {
        type: String,
        default: ''
    }
});