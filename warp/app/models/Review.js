var mongoose = require('mongoose');

module.exports = mongoose.model('Review', {
	_id: { type: String, default: uuid.v1 },
	user_id : {type : String, default: ''},
	restaurant_id : {type : String, default: ''},
	comment: {type : String, default: ''},
	rating: {type: int, default: 0}
});
