var assert      = require('assert'),
    common      = require('../core/common'),
    models      = require('../models/'),
    request     = require('request'),
    expect      = require('expect.js');

var uid;

before(function(done) {
  var user = {username: 'testusername', password: common.crypt('ohaiu' + 'test'), salt: 'ohaiu', email: 'test@testest.te', name: 'lol lol'};
  var user1 = {username: '1testusername', password: common.crypt('ohaiu' + 'test'), salt: 'ohaiu', email: 'test@testest.1te', name: 'lol lol'};
  var client = {client: 'buh', redirect_uri: 'http://localhost:8080/callback', client_secret: 'keyboardcat', user_id: 'testusername'};
  var code = {code: 'code', client_id: 'buh', redirect_uri: 'http://localhost:8080/callback', client_secret: 'keyboardcat', user_id: 'testusername'};
  var token = {token: 'testoken', client_id: 'buh', user_id: 'testusername'};
  var link = {uri: 'http://unauth.un', user_id: 0xc0ffee};

  models.User.create(user1, function(e, us) {
    us.set('links', [new models.Link(link)]);
    us.save(function(e, l) {
      models.User.create(user, function(e, u) {
        uid = client.user_id = u.get('id');
        models.Client.create(client, function(e, cl) {
          code.client_id = cl.get('id');
          code.user_id = u.get('id');
          models.Code.create(code, function(e, c) {
            token.client_id = cl.get('id');
            token.user_id = u.get('id');
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
        expect(res.statusCode).to.be.equal(201);
        assert.equal(null, e);
        done();
      });  
    });

    it('should return 400 if args are missing', function(done) {
      request.post({
        url: 'http://localhost:8000/api/links?access_token=testoken&client_id=buh&client_secret=keyboardcat'
      }, function(e, res, body) {
        assert.equal(null, e);
        expect(res.statusCode).to.be.equal(400);
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
        expect(res.statusCode).to.be.equal(400);
        done();
      });
    });
  });

  describe('a GET to /api/links', function() {
    it('should return an array', function(done) {
      request('http://localhost:8000/api/links?access_token=testoken&client_id=buh&client_secret=keyboardcat', function(e, res, body) {
        assert.equal(null, e);
        expect(res.statusCode).to.be.equal(200);
        expect(JSON.parse(body)).to.be.a('object');
        done();
      });      
    });


    it('should return a 404 when an invalid/inexistent id is requested', function(done) {
      request('http://localhost:8000/api/links/lol?access_token=testoken&client_id=buh&client_secret=keyboardcat', function(e, res, body) {
        assert.equal(null, e);
        expect(res.statusCode).to.be.equal(404);
        done();
      });
    });

    it('should fail without auth', function(done) {
      request('http://localhost:8000/api/links/lol', function(e, res, body) {
        assert.equal(null, e);
        expect(res.statusCode).to.be.equal(401);
        done();
      });
    });
  });

  describe('a DELETE to /api/links', function() {
    it('should delete a link if exists', function(done) {
      request('http://localhost:8000/api/links?access_token=testoken&client_id=buh&client_secret=keyboardcat', function(e, res, body) {
        assert.equal(null, e);
        var ids = JSON.parse(body).filter(function(x) { return x.user_id === uid; });

        request.del('http://localhost:8000/api/links/'+ids[0].id+'?access_token=testoken&client_id=buh&client_secret=keyboardcat', function(e, res, body) {
          expect(res.statusCode).to.be.equal(204);
          done();
        });
      });      
    });

    it('should return 401 if not authorized', function(done) {
      request('http://localhost:8000/api/links?access_token=testoken&client_id=buh&client_secret=keyboardcat', function(e, res, body) {
        assert.equal(null, e);
        var ids = JSON.parse(body).filter(function(x) { return x.user_id !== uid });

        request.del('http://localhost:8000/api/links/'+ids[0].id+'?access_token=testoken&client_id=buh&client_secret=keyboardcat', function(e, res, body) {
          expect(res.statusCode).to.be.equal(401);
          done();
        });
      });  
    });
  }); 
});
