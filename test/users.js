var APIeasy = require('api-easy'),
    assert = require('assert');
    //app = require('../app.js');

var suite = APIeasy.describe('users.js');

function toBasicAuth(username, password) {
  var auth = new Buffer(username+':'+password).toString('base64');

  return 'Basic '+auth;
}


suite
     .use('localhost', 8080)
     .setHeader('Content-Type', 'application/json')
     .post('/users', {username: 'test'})
        .expect(400)
     .next()
     .post('/users', {username: '###', password: 'test'})
        .expect(500)
     .next()
     .post('/users', {username: 'test', password: 'test'})
        .expect(200)
     .next()
     .get('/users/login')
        .expect(401)
     .next()
     .setHeader('Authorization', toBasicAuth('nonexistentuser', 'nonexistentpassword'))
     .get('/users/login')
        .expect(401)
     .next()
     .setHeader('Authorization', toBasicAuth('test', 'test'))
     .get('/users/login')
        .expect(200)
        .expect('should include a Set-Cookie header', function(err, res, body) {
          assert.include(res.headers, 'set-cookie');
        })
     .export(module);
