var common = require('../core/common');

describe('salt', function() {
  it('should return a random string', function() {
    common.salt().should.be.a('string');
  });
});

describe('crypt', function() {
  it('should digest hex', function() {
    common.crypt('salt', 'pwd').should.be.a('string');
  });
});
