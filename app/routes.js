
var User = require('./models/User');
var Restaurant = require('./models/Restaurant');
var Review = require('./models/Review');
var ObjectId = require('mongodb').ObjectID;
var crypto = require('crypto');
/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    console.log('UserPassword = '+userpassword);
    console.log('Passwordhash = '+passwordData.passwordHash);
    console.log('nSalt = '+passwordData.salt);
}
    module.exports = function(app) {

        app.get('/api/user/:name', function(req, res) {
            var username = req.params.name;
            User.findOne({"username" : username}, function(err, user) {
                
                if (err)
                    res.send(err);
                if (!user)
                    res.send(404);
                else
                    res.json(user); 
            });
        });

        app.post('/api/user', function(req, res) {
            var salt = genRandomString(16);
            var passwordData = sha512(req.body.password, salt);
            var rest = User({
                username: req.body.username,
                password: passwordData.passwordHash,
                salt: passwordData.salt
            });
            rest.save(function(err, rest) {
                
                if (err)
                    res.send(err);
                else
                    res.send(200, rest)
            });
        });

        app.post('/api/user/authenticate', function(req, res) {
            var username = req.body.username;
            var password = req.body.password;

            User.findOne({"username" : username}, function(err, user) {
                if (err)
                    res.send(err);
                if (!user)
                    res.send(404);
                else {
                    var passwordData = sha512(password, user.salt);
                    if (passwordData.passwordHash.localeCompare(user.password) == 0){
                        res.send(200);
                    } else {
                        res.send(403);
                    } 
                }
            });
            
        });

        app.get('/api/restaurant/:name', function(req, res) {
            var restaurant_name = req.params.name;
            Restaurant.findOne({"name" : restaurant_name}, function(err, restaurant) {
                
                if (err)
                    res.send(err);
                
                if (!restaurant)
                    res.send(404);
                else
                    res.send(restaurant); 
            });
            
        });

        app.post('/api/restaurant', function(req, res) {
            var rest = Restaurant({
                name: req.body.name,
                lat: req.body.lat,
                lon: req.body.lon
            });
            rest.save(function(err, rest) {
                
                if (err)
                    res.send(err);
                else
                    res.send(200, rest)
            });
        });

        app.get('/api/review/:restaurant_name', function(req, res) {
            var restaurant_name = req.params.restaurant_name;
            var restaurant;
            Restaurant.findOne({"name" : restaurant_name}, function(err, rest) {
                if (err)
                    res.send(err);
                else if (rest){
                    Review.find({"restaurant_id" : new ObjectId(rest._id)}, function(err, reviews) {
                        if (err)
                            res.send(err);
                        else
                            res.send(200, reviews);
                    });
                } else{
                     res.send(200);
                }
            });
        });

        app.post('/api/review', function(req, res) {
            var rev = Review({
                restaurant_id: req.body.restaurant_id,
                user_id: req.body.user_id,
                comment: req.body.comment,
                rating: req.body.rating
            });

            rev.save(function(err, rev) {
                
                if (err)
                    res.send(err);
                else
                    res.send(200, rev);
            });
        });

        app.get('*', function(req, res) {
            res.send(404)
        });

        
    };