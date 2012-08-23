var assert  = require('assert'),
    expect  = require('expect.js'),
    request = require('request'),
    Browser = require('zombie');

var browser = new Browser();

describe('buckets.js', function() {

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

  it('should login and create bucket', function(done) {

    browser.visit('http://localhost:8000/login', function() {
      browser
        .fill('username', 'test')
        .fill('password', 'test')
        .pressButton('Sign in', function() {
          assert.equal(browser.success, true);
          browser.visit('http://localhost:8000/buckets/new', function() {
            browser
              .fill('bucket', 'aBucket')
              .pressButton('Create', function() {
                assert.equal(browser.success, true);
                done();
              });
            });
        });
      });
  });

  it('should list buckets', function(done) {
    browser.visit('http://localhost:8000/login', function() {
      browser
        .fill('username', 'test')
        .fill('password', 'test')
        .pressButton('Sign in', function() {
          assert.equal(browser.success, true);
          browser.visit('http://localhost:8000/test/buckets', function() {
            browser.query('a[href="/test/buckets/aBucket"]');
            done();           
          });
        });
      });
  });
});
