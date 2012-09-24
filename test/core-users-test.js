var expect = require('expect.js'),
    core   = require('../core');


var users = core.users, user;


describe('users.js', function() {
  describe('#create', function() {
    it('should create a new user', function(done) {
      users.create({username: 'yago', password: 'nimod', salt: '', email: 'yag@onimod.com', name: 'Test Test'}, function(e, u) {
        expect(e).not.to.be.ok();
        user = u;
        done();
      });
    });

    it('should fail when username exists', function(done) {
      users.create({username: 'yago', password: 'onimod', salt: '', email: 'yago@nimod.com', name: 'Test Test'}, function(e, u) {
        expect(e).to.be.an(Error);
        done();
      });
    });

    it('should fail when email exists', function(done) {
      users.create({username: 'yagon', password: 'imod', salt: '', email: 'yag@onimod.com', name: 'Test Test'}, function(e, u) {
        expect(e).to.be.an(Error);
        done();
      });
    });
  });

  describe('#get', function() {
    it('should get user by username', function(done) {
      users.get({id: user.get('username')}, function(e, u) {
        expect(e).to.not.be.ok();
        expect(u.id).to.be.eql(user.get('id'));
        done();
      });
    });

    it('should return 404 if it does not exist', function(done) {
      users.get({id: '1337'}, function(e, u) {
        expect(e.message).to.be.eql(404);
        done();
      });
    });
  });
});