'use strict';

const should = require('should');

const Appc = require('../');
require('./lib/helper');

let currentSession;
let user = global.$config.user;

describe('Appc.User', function () {

	before(function (done) {
		Appc.setEnvironment(global.$config.environment);

		Appc.Auth.login(user.username, user.password, function (err, session) {
			should.not.exist(err);
			should.exist(session);
			currentSession = session;
			should(currentSession.isValid()).equal(true);
			done();
		});
	});

	it('should find the current user', function (done) {
		Appc.User.find(currentSession, function (err, res) {
			should.not.exist(err);
			should.exist(res);
			should(res.email).equal(global.$config.user.username);
			done();
		});
	});

	it('should find another user', function (done) {
		Appc.User.find(currentSession, global.$config.another_user.guid, function (err, res) {
			should.not.exist(err);
			should.exist(res);
			should(res.user_id.toString()).equal(global.$config.another_user.user_id);
			should.not.exist(res.username);
			done();
		});
	});

	it('should fail to find invalid user', function (done) {
		Appc.User.find(currentSession, '123', function (err, res) {
			should.not.exist(res);
			should.exist(err);
			should.exist(err.message);
			should(err.message).equal('Resource Not Found');
			done();
		});
	});

	it('should fail to find user with invalid session', function (done) {
		Appc.User.find({}, function (err, res) {
			should.not.exist(res);
			should.exist(err);
			should.exist(err.message);
			should(err.message).equal('session is not valid');
			done();
		});
	});
});
