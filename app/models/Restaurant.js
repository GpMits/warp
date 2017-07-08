var mongoose = require('mongoose');

module.exports = mongoose.model('Restaurant', {
	name : {type : String, default: ''},
	location : {
        lat : {type: String, default: ''},
        lon : {type: String, default: ''},
    }
});
