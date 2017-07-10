process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var Review = require('../models/Review');
var User = require('../models/User');
var Restaurant = require('../models/Restaurant');

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../server');
var should = chai.should();

chai.use(chaiHttp);

describe('Reviews', () => {
    beforeEach((done) => {
        Review.remove({}, (err) => {
            User.remove({}, (err) => {
                Restaurant.remove({}, (err) => {
                    done();
                });
            });
        });
    });


    describe('/GET/:name review', () => {
        it('it should GET a review by the given restaurant name', (done) => {
            var user = new Review({
                username: "User Test",
                salt: "salt",
                password: "pass"
            });
            var restaurant = new Restaurant({
                name: "Restaurant Test",
                location: {
                    lat: 10,
                    lon: -10
                },
                average_rating: 3
            });
            var review = new Review({
                user_id: user.id,
                restaurant_id: restaurant.id,
                comment: "comment",
                rating: 5
            });
            restaurant.save((err, restaurant) => {
                user.save((err, user) => {
                    review.save((err, review) => {
                        chai.request(server)
                            .get('/api/review/' + restaurant.name)
                            .send(review)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.an('array');
                                res.body.should.have.lengthOf(1);
                                res.body[0].should.have.property('comment');
                                res.body[0].should.have.property('rating');
                                res.body[0].should.have.property('_id').eql(review.id);
                                done();
                            });
                    });
                });
            });
        });
    });
});