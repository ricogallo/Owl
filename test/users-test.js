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

  it('should change settings', function(done) {
    browser.visit('http://localhost:8000/login', function() {
      browser.
        fill('username', 'test').
        fill('password', 'test').

        pressButton('Sign in', function() {
          browser.visit('http://localhost:8000/profile', function() {
            expect(browser.success).to.be.ok();
            browser
              .fill('name', 'testa')
              .fill('surname', 'testa')

              .pressButton('Save', function() {
                browser.visit('http://localhost:8000/me', function() {
                  expect(browser.document.getElementsByClassName('rname')[0].innerHTML).to.be.eql('testa testa');
                  done();
                });
              });
          });
        });
    });
  });

  describe('/api/users/:id', function() {
    it('should get an user if exists', function(done) {
      request('http://localhost:8000/api/users/testusername?access_token=testoken&client_id=buh&client_secret=keyboardcat', function(e, res, body) {
        assert.equal(null, e);
        expect(res.statusCode).to.be.equal(200);
        expect(JSON.parse(body)).to.be.a('object');
        done();
      });
    });

    it('should return 404 if an user does not exist', function(done) {
      request('http://localhost:8000/api/users/inexistent?access_token=testoken&client_id=buh&client_secret=keyboardcat', function(e, res, body) {
        assert.equal(null, e);
        expect(res.statusCode).to.be.equal(404);
        done();
      });
    });
  });

  describe('/api/me', function() {
    it('should get current user', function(done) {
      request('http://localhost:8000/api/me?access_token=testoken&client_id=buh&client_secret=keyboardcat', function(e, res, body) {
        assert.equal(null, e);
        expect(res.statusCode).to.be.equal(200);
        expect(JSON.parse(body)).to.be.a('object');
        done();
      });
    });
  });
});
