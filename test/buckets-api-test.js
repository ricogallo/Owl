var assert  = require('assert'),
    common  = require('../core/common'),
    models  = require('../models/'),
    expect  = require('expect.js'),
    request = require('request');

var uid, lid;

describe('bucket.js', function() {

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


  describe('a POST to /buckets/new', function() {

    it('should create a new bucket', function(done) {
      request.post({
        uri: 'http://localhost:8000/api/buckets?access_token=testoken&client_id=buh&client_secret=keyboardcat',
        body: JSON.stringify({ name: 'herpderp' }),
        json: true
      }, function(e, res, body) {
        assert.equal(null, e);
        res.statusCode.should.equal(201);
        done();
      });        
    });

  });

  describe('a GET to /:user/buckets', function() {
    
    it('should list buckets', function(done) {
      request.get({
          uri: 'http://localhost:8000/api/testusername/buckets?access_token=testoken&client_id=buh&client_secret=keyboardcat'
        }, function(e, res, body) {
          assert.equal(null, e);
          res.statusCode.should.equal(200);
          expect(JSON.parse(body)).to.be.an('array'); 
          done();
      });
      
    });

  });

  describe('a POST to /buckets/add_link', function() {

    it('should add link to bucket', function(done) {
      
      request.get({
        uri: 'http://localhost:8000/api/links?access_token=testoken&client_id=buh&client_secret=keyboardcat'
      }, function(e, res, body) {
        var links = JSON.parse(body);
        request.get({ uri: 'http://localhost:8000/api/testusername/buckets?access_token=testoken&client_id=buh&client_secret=keyboardcat' }, function(e, res, body) {
          var id  = JSON.parse(body)[0].id,
              lid = links[0].id;
          request.post({
            uri: 'http://localhost:8000/api/buckets/add_link?access_token=testoken&client_id=buh&client_secret=keyboardcat',
            body: JSON.stringify({ bucket: id, link: lid }),
            json: true
          }, function(e, res, body) {
            expect(e).to.be(null); 
            expect(res.statusCode).to.be.ok();
            done();
          });
        });
      });

    });

  });

  describe('a GET to /:user/buckets/:name', function() {

    it('should list links', function(done) {
      request.get({
        uri: 'http://localhost:8000/api/testusername/buckets/herpderp?access_token=testoken&client_id=buh&client_secret=keyboardcat'
      }, function(e, res, body) {
        expect(JSON.parse(body).links).to.be.an('array');
        expect(e).to.be(null);
        done();
      });
    });

  });

});
