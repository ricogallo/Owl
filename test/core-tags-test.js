var expect = require('expect.js'),
    core   = require('../core');


var tags = core.tags, user;


describe('tags.js', function() {
  describe('#subscribe', function() {
    it('should subscribe to a tag if exist', function(done) {
      core.users.create({username: 'testk', password: 'testk', salt: 'testk', email: 'yagonimodk@test.com', name: 'Test Test'}, function(e, u) {
        user = u;
        expect(e).to.not.be.ok();
        core.links.create({uri: 'http://testa.te', user: user, tags: ['yag_oni']}, function(e) {
          expect(e).to.not.be.ok();
          tags.subscribe({user: u, tag: 'yag_oni'}, function(e) {
            expect(e).to.not.be.ok();
            core.links.timeline({user: u}, function(e, links) {
              expect(e).to.not.be.ok();
              expect(links[0].get('uri')).to.be.eql('http://testa.te');
              done();
            });
          });
        });
      });
    });
  });

  describe('#unsuscribe', function() {
    it('should unsuscribe from a tag', function(done) {
      tags.unsubscribe({user: user, tag: 'yag_oni'}, function(e) {
        expect(e).to.not.be.ok();
        core.links.timeline({user: user}, function(e, links) {
          expect(e).to.not.be.ok();
          expect(links[0]).to.not.be.ok();
          done();
        });
      });
    });
  });
});