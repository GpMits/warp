
var User = require('./models/user');
var Restaurant = require('./models/restaurant');
var Review = require('./models/review');

    module.exports = function(app) {

        app.get('/api/user/:name', function(req, res) {
            var username = res.params.name;
            User.find(function({"name" : username}, err, user) {
                
                if (err)
                    res.send(err);

                res.json(user); 
            });
        });

        app.get('/api/restaurant/:name', function(req, res) {
            var restaurant_name = res.params.name;
            Restaurant.find(function({"name" : restaurant_name}, err, restaurant) {
                
                if (err)
                    res.send(err);

                res.json(restaurant); 
            });
        });

        app.post('/api/restaurant', function(req, res) {
            var name = req.body.name;
            var lat = req.body.lat;
            var lon = req.body.lon;

            Restaurant.save(function(err, rest) {
                
                if (err)
                    res.send(err);

                res.json({"status":"OK"})
            });
        });

        app.get('/api/review/:restaurant_name', function(req, res) {
            var restaurant_name = res.params.restaurant_name;
            var restaurant;
            Restaurant.find(function({"name" : restaurant_name}, err, rest) {
                
                if (err)
                    res.send(err);

                restaurant = rest;
            });

            if(restaurant){
                restaurant_id = restaurant._id;
                Review.find(function({"restaurant_id" : restaurant_id}, err, reviews) {
                
                    if (err)
                        res.send(err);

                    res.json(reviews);
                });
            }else{
                res.json({"status":"NOT_FOUND"});
            }
        });

        app.post('/api/restaurant', function(req, res) {
            var restaurant_id = req.body.restaurant_id;
            var user_id = req.body.user_id;
            var comment = req.body.comment;
            var rating = req.body.rating;

            Review.save(function(err, rev) {
                
                if (err)
                    res.send(err);

                res.json({"status":"OK"})
            });
        });

        // frontend routes =========================================================
        // route to handle all angular requests
        app.get('*', function(req, res) {
            res.sendfile('./public/views/index.html'); // load our public/index.html file
        });

    };