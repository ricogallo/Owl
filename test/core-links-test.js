var expect = require('expect.js'),
    core   = require('../core');


var links = core.links;


describe('links.js', function() {
  describe('#create', function() {
  it('should create a link', function(done) {
      core.users.create({username: 'test', password: 'test', salt: 'test', email: 'yagonimod@test.com', name: 'Test Test'}, function(e, user) {
        expect(e).to.not.be.ok();
        links.create({uri: 'http://test.te', user: user, tags: ['yagonimod']}, function(e) {
          expect(e).to.not.be.ok();
          done();
        });
      });
    });
  });

  describe('#read', function() {
    it('should read links', function(done) {
      core.users.get({id: 'test'}, function(e, user) {
        expect(e).to.not.be.ok();
        links.user({id: user.id}, function(e, links) {
          expect(e).to.not.be.ok();
          expect(links[0].get('uri')).to.be.eql('http://test.te');
          done();
        });
      });
    });
  });
});