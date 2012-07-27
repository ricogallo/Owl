var assert  = require('assert'),
    expect  = require('expect.js'),
    request = require('request'),
    Browser = require('zombie');

var browser = new Browser();

describe('links.js', function() {

  it('should prepare test stubs', function(done) {
    browser.visit('http://localhost:8000/sign_up/', function () {
      browser
        .fill('username', 'test')
        .fill('password', 'test')
        .fill('name', 'test')
        .fill('surname', 'test')
        .fill('email', 'test@test.te')
        .pressButton('Sign Up', function() {
          expect(browser.success).to.be(true);
          done();
        });
    });
  });

  it('should login and create link', function(done) {

    browser.visit('http://localhost:8000/login', function() {
      browser
        .fill('username', 'test')
        .fill('password', 'test')
        .pressButton('Sign in', function() {
          assert.equal(browser.success, true);
          console.log('here'); 
          browser.visit('http://localhost:8000/new', function() {
            browser
              .fill('uri', 'http://testalicious.com')
              .fill('tags', '#test #tag #cool')
              .pressButton('Send', function() {
                assert.ok(browser.query('a[href="http://testalicious.com"]'));
                assert.equal(browser.success, true);
                done();
              });
            });
        });
      });
  });
});
