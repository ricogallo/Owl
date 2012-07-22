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

describe('test', function() {
  it('should get /test', function(done) {
    request('http://localhost:8000/test?access_token=testoken&client_id=buh&client_secret=keyboardcat', function(err, res, body) {
      assert.equal('it works', body);
      done();
    }); 
  });
});

/*describe('links.js', function() {
  describe('a POST to /links', function() {
    it('should return 200 if args are correct', function(done) {
      oauth.getOAuthAccessToken('dSqqtTyX1f4MKlCm', {grant_type: 'authorization_code', 'redirect_uri': 'http://localhost:8080/callback'}, function(err, token) {   
        var params = JSON.stringify({uri: 'http://valid.url', tags: 'how,are,you'});
        oauth._request('POST', 'http://localhost:8000/links', {'Content-type': 'application/json'}, params, token, function(err, res) {
          assert.equal(err, null);
          done();
        });
      });
    });

    it('should return 400 if args are missing', function(done) {
      oauth.getOAuthAccessToken('dSqqtTyX1f4MKlCm', {grant_type: 'authorization_code', 'redirect_uri': 'http://localhost:8080/callback'}, function(err, token) {   
        var params = JSON.stringify({test: 'test', tags: 'how,are,you'});
        oauth._request('POST', 'http://localhost:8000/links', {'Content-type': 'application/json'}, params, token, function(err, res) {
          assert.equal(err.statusCode, 400);
          done();
        });
      });
    });

    it('should return 400 if args are wrong', function(done) {
      oauth.getOAuthAccessToken('dSqqtTyX1f4MKlCm', {grant_type: 'authorization_code', 'redirect_uri': 'http://localhost:8080/callback'}, function(err, token) {   
        var params = JSON.stringify({uri: 'invalidurl', tags: 'how,are,you'});
        oauth._request('POST', 'http://localhost:8000/links', {'Content-type': 'application/json'}, params, token, function(err, res) {
          assert.equal(err.statusCode, 400);
          done();
        });
      });
    });
  });

  describe('a GET to /links', function() {
    it('should return an array', function(done) {
      oauth.getOAuthAccessToken('dSqqtTyX1f4MKlCm', {grant_type: 'authorization_code', 'redirect_uri': 'http://localhost:8080/callback'}, function(err, token) {   
        var params = JSON.stringify({uri: 'invalidurl', tags: 'how,are,you'});
        oauth.get('http://localhost:8000/links', token, function(err, res) {
          res = JSON.parse(res);

          assert.equal(err, null);
          res.should.be.a('object');

          done();
        });
      });      
    });

    it('should return a 404 when an invalid/inexistent id is requested', function(done) {
      oauth.getOAuthAccessToken('dSqqtTyX1f4MKlCm', {grant_type: 'authorization_code', 'redirect_uri': 'http://localhost:8080/callback'}, function(err, token) {   
        var params = JSON.stringify({uri: 'invalidurl', tags: 'how,are,you'});
        oauth.get('http://localhost:8000/links/inexistentid', token, function(err, res) {
          assert.equal(err.statusCode, 404);

          done();
        });
      });
    });
  });
});*/
