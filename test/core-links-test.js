var expect = require('expect.js'),
    core   = require('../core');


var links = core.links, user;


describe('links.js', function() {
  describe('#create', function() {
  it('should create a link', function(done) {
      core.users.create({username: 'test', password: 'test', salt: 'test', email: 'yagonimod@test.com', name: 'Test Test'}, function(e, u) {
        user = u;
        expect(e).to.not.be.ok();
        links.create({uri: 'http://test.te', user: user, tags: ['yagonimod']}, function(e) {
          expect(e).to.not.be.ok();
          links.create({uri: 'http://test.te', user: user, tags: ['lol']}, function(e) {
            expect(e).to.not.be.ok();
            done();
          });
        });
      });
    });
  });

  describe('#user', function() {
    it('should read links by userid', function(done) {
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

  describe('#get', function() {
    it('should get link by id', function(done) {
      links.get({id: 1}, function(e, link) {
        expect(e).to.not.be.ok();
        expect(link.get('uri')).to.be.eql('http://test.te');
        done();
      });
    });
  });

  describe('#byTag', function() {
    it('should get links by tag according to limit', function(done) {
      links.byTag({tag: 'yagonimod', limit: 1}, function(e, links) {
        expect(e).to.not.be.ok();
        expect(links.length).to.be.eql(1);
        done();
      });
    });

    it('should search when "search" = true', function(done) {
      links.byTag({tag: 'yagonimo', limit: 1, search: true}, function(e, links) {
        expect(e).to.not.be.ok();
        expect(links.length).to.be.eql(1);
        done();
      });
    });
  });

  describe('#del', function() {
    it('should delete when id exists', function(done) {
      links.user({id: user.get('id')}, function(e, l) {
        expect(e).to.not.be.ok();
        links.del({user: user, id: l[0].get('id')}, function(e) {
          expect(e).to.not.be.ok(),
          links.user({id: user.get('id')}, function(e, li) {
            expect(e).to.not.be.ok();
            expect(l[0].get('id')).to.not.be.eql(li[0].get('id'));
            done();
          });
        });
      });
    });

    it('should return 404 when id does not exist', function(done) {
      links.del({user: user, id: 1337}, function(e) {
        console.dir(e);
        expect(e.message).to.be.eql(404);
        done();
      });
    });
  });
});