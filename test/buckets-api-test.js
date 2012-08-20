var assert  = require('assert'),
    common  = require('../core/common'),
    models  = require('../models/'),
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

});
