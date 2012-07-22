var assert  = require('assert'),
    expect  = require('expect.js'),
    Browser = require('zombie');


browser = new Browser();

describe('user.js', function() {
  it('should register', function(done) {
    browser.visit('http://localhost:8000/sign_up/', function () {
      browser.
      fill('username', 'test').
      fill('password', 'test').
      fill('name', 'test').
      fill('surname', 'test').
      fill('email', 'test@test.te').

      pressButton('Sign Up', function() {
        expect(browser.success).to.be(true);
        done();
      });
    });
  });
  
  it('should login', function(done) {
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
