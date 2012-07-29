var assert      = require('assert'),
    common      = require('../core/common'),
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
  describe('a POST to /api/links', function() {
    it('should return 201 if args are correct', function(done) {
      request.post({
        url: 'http://localhost:8000/api/links?access_token=testoken&client_id=buh&client_secret=keyboardcat',
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
        url: 'http://localhost:8000/api/links?access_token=testoken&client_id=buh&client_secret=keyboardcat'
      }, function(e, res, body) {
        assert.equal(null, e);
        res.statusCode.should.equal(400);
        done();
      });
    });

    it('should return 400 if args are wrong', function(done) {
      request.post({
        json: true,
        url: 'http://localhost:8000/api/links?access_token=testoken&client_id=buh&client_secret=keyboardcat',
        body: JSON.stringify({uri: 'invalidurl', tags: 'how,are,you'})
      }, function(e, res, body) {
        assert.equal(null, e);
        res.statusCode.should.equal(400);
        done();
      });
    });
  });

  describe('a GET to /api/links', function() {
    it('should return an array', function(done) {
      request('http://localhost:8000/api/links?access_token=testoken&client_id=buh&client_secret=keyboardcat', function(e, res, body) {
        assert.equal(null, e);
        res.statusCode.should.equal(200);
        JSON.parse(body).should.be.a('object');
        done();
      });      
    });


    it('should return a 404 when an invalid/inexistent id is requested', function(done) {
      request('http://localhost:8000/api/links/lol?access_token=testoken&client_id=buh&client_secret=keyboardcat', function(e, res, body) {
        assert.equal(null, e);
        res.statusCode.should.equal(404);
        done();
      });
    });

    it('should fail without auth', function(done) {
      request('http://localhost:8000/api/links/lol', function(e, res, body) {
        assert.equal(null, e);
        res.statusCode.should.equal(401);
        done();
      });
    });
  });

  describe('a PUT to /api/links', function() {
    it('should update a link if exists', function(done) {
      request('http://localhost:8000/api/links?access_token=testoken&client_id=buh&client_secret=keyboardcat', function(e, res, body) {
        assert.equal(null, e);
        body = JSON.parse(body);

        
        // ink/user/testusername/9bb5834b-c523-4f28-b33d-ee634809b6ab
        var id = body[0]._id.match(/.+?\/.+?\/.+?\/(.+)/)[1];

        request.put({
          url: 'http://localhost:8000/api/links/'+id+'?access_token=testoken&client_id=buh&client_secret=keyboardcat',
          body: JSON.stringify({ uri: 'http://another.url' }),
          json: true
        }, function(e, res, body) {
          res.statusCode.should.equal(200);
          done();
        });
      });      
    });
  });

  describe('a DELETE to /api/links', function() {
    it('should delete a link if exists', function(done) {
      request('http://localhost:8000/api/links?access_token=testoken&client_id=buh&client_secret=keyboardcat', function(e, res, body) {
        assert.equal(null, e);
        var id = JSON.parse(body)[0].id;

        request.del('http://localhost:8000/api/links/'+id+'?access_token=testoken&client_id=buh&client_secret=keyboardcat', function(e, res, body) {
          res.statusCode.should.equal(204);
          done();
        });
      });      
    });

    it('should return 401 if not authorized', function(done) {
      request.del('http://localhost:8000/api/links/inexistent?access_token=testoken&client_id=buh&client_secret=keyboardcat', function(e, res, body) {
        res.statusCode.should.equal(401);
        done();
      });
    });
  }); 
});
