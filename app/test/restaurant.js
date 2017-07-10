process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var Restaurant = require('../models/Restaurant');

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../server');
var should = chai.should();

chai.use(chaiHttp);
describe('Restaurants', () => {
    beforeEach((done) => {
        Restaurant.remove({}, (err) => {
            done();
        });
    });

    describe('/POST restaurant', () => {
        it('it should POST a restaurant', (done) => {
            var restaurant = {
                name: "Restaurant Test",
                location: {
                    lat: 10,
                    lon: -10
                },
                average_rating: 3
            }
            chai.request(server)
                .post('/api/restaurant')
                .send(restaurant)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });

    });

    describe('/GET/:name restaurant', () => {
        it('it should GET a restaurant by the given name', (done) => {
            var restaurant = new Restaurant({
                name: "Restaurant Test",
                location: {
                    lat: 10,
                    lon: -10
                },
                average_rating: 3
            });
            restaurant.save((err, restaurant) => {
                chai.request(server)
                    .get('/api/restaurant/' + restaurant.name)
                    .send(restaurant)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('name');
                        res.body.should.have.property('location');
                        res.body.should.have.property('average_rating');
                        res.body.should.have.property('_id').eql(restaurant.id);
                        done();
                    });
            });
        });
    });

    describe('/PUT/:name restaurant', () => {
        it('it should UPDATE a restaurant average_rating given the name', (done) => {
            var restaurant = new Restaurant({
                name: "Restaurant Test",
                location: {
                    lat: 10,
                    lon: -10
                },
                average_rating: 3
            });
            restaurant.save((err, restaurant) => {
                chai.request(server)
                    .put('/api/restaurant/' + restaurant.name)
                    .send({
                        name: "Restaurant Test",
                        location: {
                            lat: 10,
                            lon: -10
                        },
                        average_rating: 2
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        done();
                    });
            });
        });
    });

});