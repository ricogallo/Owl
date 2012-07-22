var assert      = require('assert'),
    common      = require('../lib/common'),
    models      = require('../models/'),
    request     = require('request'),
    cradle      = require('cradle');

before(function(done) {
  var db = new(cradle.Connection)().database('urlship');
  var user = {id: 'testusername', password: common.crypt('ohaiu' + 'test'), salt: 'ohaiu', email: 'test@testest.te', name: 'lol lol'};
  var client = {id: 'buh', redirect_uri: 'http://localhost:8080/callback', client_secret: 'keyboardcat', user_id: 'testusername'};
  var code = {id: 'code', client_id: 'buh', redirect_uri: 'http://localhost:8080/callback', client_secret: 'keyboardcat', user_id: 'testusername'};
  var token = {id: 'testoken', client_id: 'buh', user_id: 'testusername'};
  db.destroy(function() {
  db.create(function() {
    models.User.create(user, function() {
      models.Client.create(client, function() {
        models.Code.create(code, function() {
          models.Token.create(token, done);
        });
      });
    });
  });
  });
});

describe('links.js', function() {
  describe('a POST to /links', function() {
    it('should return 200 if args are correct', function(done) {
      request.post({
        url: 'http://localhost:8000/links?access_token=testoken&client_id=buh&client_secret=keyboardcat',
        body: JSON.stringify({ uri: 'http://valid.url', tags: 'how,are,you' }),
        json: true
      }, function(e, res, body) {
        res.statusCode.should.equal(201);
        assert.equal(null, e);
        done();
      });  
    });

    it('should return 400 if args are missing', function(done) {
      request.post({
        url: 'http://localhost:8000/links?access_token=testoken&client_id=buh&client_secret=keyboardcat',
        json: true
      }, function(e, res, body) {
        assert.equal(null, e);
        res.statusCode.should.equal(400);
        done();
      });
    });

    it('should return 400 if args are wrong', function(done) {
      request.post({
        json: true,
        url: 'http://localhost:8000/links?access_token=testoken&client_id=buh&client_secret=keyboardcat',
        body: JSON.stringify({uri: 'invalidurl', tags: 'how,are,you'})
      }, function(e, res, body) {
        assert.equal(null, e);
        res.statusCode.should.equal(400);
        done();
      });
    });
  });

  describe('a GET to /links', function() {
    it('should return an array', function(done) {
      request('http://localhost:8000/links?access_token=testoken&client_id=buh&client_secret=keyboardcat', function(e, res, body) {
        assert.equal(null, e);
        res.statusCode.should.equal(200);
        JSON.parse(body).should.be.a('object');
        done();
      });      
    });

    it('should return a 404 when an invalid/inexistent id is requested', function(done) {
      request('http://localhost:8000/links/lol?access_token=testoken&client_id=buh&client_secret=keyboardcat', function(e, res, body) {
        assert.equal(null, e);
        res.statusCode.should.equal(404);
        done();
      });
    });

    it('should fail without auth', function(done) {
      request('http://localhost:8000/links', function(e, res, body) {
        assert.equal(null, e);
        res.statusCode.should.equal(401);
        done();
      });
    });
  });
});
