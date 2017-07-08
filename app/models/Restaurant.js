var mongoose = require('mongoose');

module.exports = mongoose.model('Restaurant', {
    _id: { type: String, default: uuid.v1 },
	name : {type : String, default: ''},
	location : {
        lat : {type: String, default: ''},
        lon : {type: String, default: ''},
    }
});
