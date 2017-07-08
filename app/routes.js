
var User = require('./models/User');
var Restaurant = require('./models/Restaurant');
var Review = require('./models/Review');
var ObjectId = require('mongodb').ObjectID;

    module.exports = function(app) {

        app.get('/api/user/:name', function(req, res) {
            var username = req.params.name;
            User.findOne({"name" : username}, function(err, user) {
                
                if (err)
                    res.send(err);

                res.json(user); 
            });
        });

        app.get('/api/restaurant/:name', function(req, res) {
            var restaurant_name = req.params.name;
            Restaurant.findOne({"name" : restaurant_name}, function(err, restaurant) {
                
                if (err)
                    res.send(err);

                res.json(restaurant); 
            });
        });

        app.post('/api/restaurant', function(req, res) {
            var rest = Restaurant({
                name: req.body.name,
                lat: req.body.lat,
                lon: req.body.lon
            });
            console.log(rest)
            rest.save(function(err, rest) {
                
                if (err)
                    res.send(err);

                res.send(200, rest._id)
            });
        });

        app.get('/api/review/:restaurant_name', function(req, res) {
            var restaurant_name = req.params.restaurant_name;
            var restaurant;
            Restaurant.findOne({"name" : restaurant_name}, function(err, rest) {
                if (err)
                    res.send(err);
                else if(!rest)
                    res.send(404);
                else {
                    Review.find({"restaurant_id" : new ObjectId(rest._id)}, function(err, reviews) {
                        if (err)
                            res.send(err);
                        res.send(200, reviews);
                    });
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

                res.send(200, reviews);
            });
        });

        app.get('*', function(req, res) {
            res.send(404)
        });

    };