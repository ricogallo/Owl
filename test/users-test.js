var assert  = require('assert'),
    expect  = require('expect.js'),
    request = require('request'),
    Browser = require('zombie');


browser = new Browser();

describe('user.js', function() {
  it('should register and login', function(done) {
    browser.visit('http://localhost:8000/sign_up/', function () {
      browser.
      fill('username', 'test').
      fill('password', 'test').
      fill('name', 'test').
      fill('surname', 'test').
      fill('email', 'test@test.te').

      pressButton('Sign Up', function() {
        expect(browser.success).to.be(true);
      
        browser.visit('http://localhost:8000/login', function() {
          browser.
            fill('username', 'test').
            fill('password', 'test').

            pressButton('Sign in', function() {
              expect(browser.success).to.be(true);
              done();
            });
        });
      });
    });
  });

  describe('/api/users/:id', function() {
    it('should get an user if exists', function(done) {
      request('http://localhost:8000/api/users/testusername?access_token=testoken&client_id=buh&client_secret=keyboardcat', function(e, res, body) {
        assert.equal(null, e);
        res.statusCode.should.equal(200);
        JSON.parse(body).should.be.a('object');
        done();
      });
    });

    it('should return 404 if an user does not exist', function(done) {
      request('http://localhost:8000/api/users/inexistent?access_token=testoken&client_id=buh&client_secret=keyboardcat', function(e, res, body) {
        assert.equal(null, e);
        res.statusCode.should.equal(404);
        done();
      });
    });
  });

  describe('/api/me', function() {
    it('should get current user', function(done) {
      request('http://localhost:8000/api/me?access_token=testoken&client_id=buh&client_secret=keyboardcat', function(e, res, body) {
        assert.equal(null, e);
        res.statusCode.should.equal(200);
        JSON.parse(body).should.be.a('object');
        done();
      });
    });
  });
});
