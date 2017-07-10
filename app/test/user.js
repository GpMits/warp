process.env.NODE_ENV = 'test';

var mongoose = require("mongoose");
var User = require('../models/User');

var crypto = require('crypto');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../server');
var should = chai.should();

chai.use(chaiHttp);

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

describe('Users', () => {
    beforeEach((done) => {
        User.remove({}, (err) => {
            done();
        });
    });


    describe('/GET/:name user', () => {
        it('it should GET a user by the given name', (done) => {
            var user = new User({
                username: "User Test",
                salt: "salt",
                password: "pass"
            });
            user.save((err, user) => {
                chai.request(server)
                    .get('/api/user/' + user.username)
                    .send(user)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('username');
                        res.body.should.have.property('salt');
                        res.body.should.have.property('password');
                        res.body.should.have.property('_id').eql(user.id);
                        done();
                    });
            });
        });
    });

    describe('/GET/:id user', () => {
        it('it should GET a user by the given id', (done) => {
            var user = new User({
                username: "User Test",
                salt: "salt",
                password: "pass"
            });
            user.save((err, user) => {
                chai.request(server)
                    .get('/api/user/id/' + user.id)
                    .send(user)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('username');
                        res.body.should.have.property('salt');
                        res.body.should.have.property('password');
                        res.body.should.have.property('_id').eql(user.id);
                        done();
                    });
            });
        });
    });

    describe('/POST user', () => {
        it('it should POST a user', (done) => {
            var user = new User({
                username: "User Test",
                password: "pass"
            });
            chai.request(server)
                .post('/api/user')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });

    });

    describe('Authenticate a user', () => {
        it('it should POST an user authentication', (done) => {
            var salt = genRandomString(16);
            var passwordData = sha512("pass", salt);
            var user = new User({
                username: "User Test",
                password: passwordData.passwordHash,
                salt: passwordData.salt
            });
            user.save((err, user) => {
                chai.request(server)
                    .post('/api/user/authenticate')
                    .send({
                        username: "User Test",
                        password: "pass",
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        done();
                    });
            });
        });

    });

});