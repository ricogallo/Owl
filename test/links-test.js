var api         = require('api-easy'),
    assert      = require('assert'),
    toBasicAuth = require('./helpers').toBasicAuth,
    querystring = require('querystring');
    o           = require('oauth');


var oauth = new o.OAuth2("buh", "-70DwJbpcAFeiixa", "http://localhost:8000/", "oauth/authorize", "oauth/token");



describe('links.js', function() {
  describe('a POST to /links', function() {
    it('should return 200 if args are correct', function(done) {
      oauth.getOAuthAccessToken("dSqqtTyX1f4MKlCm", {grant_type: 'authorization_code', "redirect_uri": "http://localhost:8080/callback"}, function(err, token) {   
        var params = JSON.stringify({uri: 'http://valid.url', tags: 'how,are,you'});
        oauth._request('POST', 'http://localhost:8000/links', {'Content-type': 'application/json'}, params, token, function(err, res) {
          assert.equal(err, null);
          done();
        });
      });
    });

    it('should return 400 if args are missing', function(done) {
      oauth.getOAuthAccessToken("dSqqtTyX1f4MKlCm", {grant_type: 'authorization_code', "redirect_uri": "http://localhost:8080/callback"}, function(err, token) {   
        var params = JSON.stringify({test: 'test', tags: 'how,are,you'});
        oauth._request('POST', 'http://localhost:8000/links', {'Content-type': 'application/json'}, params, token, function(err, res) {
          assert.equal(err.statusCode, 400);
          done();
        });
      });
    });

    it('should return 400 if args are wrong', function(done) {
      oauth.getOAuthAccessToken("dSqqtTyX1f4MKlCm", {grant_type: 'authorization_code', "redirect_uri": "http://localhost:8080/callback"}, function(err, token) {   
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
      oauth.getOAuthAccessToken("dSqqtTyX1f4MKlCm", {grant_type: 'authorization_code', "redirect_uri": "http://localhost:8080/callback"}, function(err, token) {   
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
      oauth.getOAuthAccessToken("dSqqtTyX1f4MKlCm", {grant_type: 'authorization_code', "redirect_uri": "http://localhost:8080/callback"}, function(err, token) {   
        var params = JSON.stringify({uri: 'invalidurl', tags: 'how,are,you'});
        oauth.get('http://localhost:8000/links/inexistentid', token, function(err, res) {
          assert.equal(err.statusCode, 404);

          done();
        });
      });
    });
  });
});