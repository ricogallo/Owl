var assert  = require('assert'),
    expect  = require('expect.js'),
    request = require('request'),
    Browser = require('zombie');

var browser = new Browser();

describe('errors', function() {

  it('should contain image', function(done) {
    browser.visit('http://localhost:8000/old/', function () {
      assert.ok(browser.query('img[src="http://httpcats.herokuapp.com/404"]'));
      done();
    });
  });

});
