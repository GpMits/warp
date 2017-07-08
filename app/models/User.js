var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    _id: { type: String, default: uuid.v1 },
	username : {type : String, default: ''},
	password : {type : String, default: ''}
});
