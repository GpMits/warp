var mongoose = require('mongoose');

module.exports = mongoose.model('Review', {
    user_id: {
        type: String,
        default: ''
    },
    restaurant_id: {
        type: String,
        default: ''
    },
    comment: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: new Date()
    }
});