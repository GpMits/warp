var User = require('./models/User');
var Restaurant = require('./models/Restaurant');
var Review = require('./models/Review');
var ObjectId = require('mongodb').ObjectID;
var crypto = require('crypto');

var genRandomString = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length); /** return required number of characters */
};

var sha512 = function (password, salt) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};

module.exports = function (app) {

    //Get User by username
    app.get('/api/user/:name', function (req, res) {
        var username = req.params.name;
        User.findOne({
            "username": username
        }, function (err, user) {

            if (err)
                res.send(err);
            else if (!user)
                res.send(404);
            else
                res.send(user);
        });
    });

    //Get user by _id
    app.get('/api/user/id/:user_id', function (req, res) {
        var user_id = req.params.user_id;
        User.findOne({
            "_id": user_id
        }, function (err, user) {

            if (err)
                res.send(err);
            else if (!user)
                res.send(404);
            else
                res.send(user);
        });
    });

    //Create new User
    app.post('/api/user', function (req, res) {
        var salt = genRandomString(16);
        var passwordData = sha512(req.body.password, salt);
        var user = User({
            username: req.body.username,
            password: passwordData.passwordHash,
            salt: passwordData.salt
        });
        user.save(function (err, user) {

            if (err)
                res.send(err);
            else
                res.status(200).send(user)
        });
    });

    //Authenticate user using post data
    app.post('/api/user/authenticate', function (req, res) {
        var username = req.body.username;
        var password = req.body.password;

        User.findOne({
            "username": username
        }, function (err, user) {
            if (err)
                res.send(err);
            if (!user)
                res.send(404);
            else {
                var passwordData = sha512(password, user.salt);
                if (passwordData.passwordHash.localeCompare(user.password) == 0) {
                    res.send(200);
                } else {
                    res.send(403);
                }
            }
        });

    });

    //Get Restaurant by name
    app.get('/api/restaurant/:name', function (req, res) {
        var restaurant_name = req.params.name;
        Restaurant.findOne({
            "name": restaurant_name
        }, function (err, restaurant) {

            if (err)
                res.send(err);

            if (!restaurant)
                res.send(404);
            else
                res.send(restaurant);
        });

    });

    //Create new Restaurant
    app.post('/api/restaurant', function (req, res) {
        var rest = Restaurant({
            name: req.body.name,
            lat: req.body.lat,
            lon: req.body.lon,
            average_rating: req.body.average_rating
        });
        rest.save(function (err, rest) {

            if (err)
                res.send(err);
            else
                res.send(200, rest)
        });
    });

    //Update Restaurant average rating
    app.put('/api/restaurant/:rest_name', function (req, res) {
        name = req.params.rest_name,
            average_rating = req.body.average_rating
        Restaurant.update({
            "name": name
        }, {
            $set: {
                "average_rating": average_rating
            }
        }, function (err, rest) {

            if (err)
                res.send(err);
            else
                res.send(200)
        });
    });

    //Get Reviews by restaurant name
    app.get('/api/review/:restaurant_name', function (req, res) {
        var restaurant_name = req.params.restaurant_name;
        var restaurant;
        Restaurant.findOne({
            "name": restaurant_name
        }, function (err, rest) {
            if (err)
                res.send(err);
            else if (rest) {
                Review.find({
                    "restaurant_id": new ObjectId(rest._id)
                }, function (err, reviews) {
                    if (err)
                        res.send(err);
                    else
                        res.send(200, reviews);
                });
            } else {
                res.send(200, []);
            }
        });
    });

    //Create new Review
    app.post('/api/review', function (req, res) {
        var rev = Review({
            restaurant_id: req.body.restaurant_id,
            user_id: req.body.user_id,
            comment: req.body.comment,
            rating: req.body.rating,
            created_at: new Date()
        });

        rev.save(function (err, rev) {
            if (err)
                res.send(err);
            else
                res.send(200, rev);
        });
    });

    //Remaining requests
    app.get('*', function (req, res) {
        res.send(404)
    });


};