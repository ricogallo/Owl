var api    = require('api-easy'),
    assert = require('assert');

function toBasicAuth(username, password) {
  var auth = new Buffer(username+':'+password).toString('base64');

  return 'Basic '+auth;
}


api
  .describe('links.js')
  .use('localhost', 8080)
  .setHeader('Content-Type', 'application/json')
  .post('/users', {username: 'test', password: 'test'}) // registration
  .expect(200)
  .next()
  .setHeader('Authorization', toBasicAuth('test', 'test'))
  .get('/users/login')
  .expect(200)
  .next()
  .removeHeader('Authorization')
  .path('/links')
  .get()
    .expect(404)
  .next()
  .post({uri: 'invalidurl'})
    .expect(500)
  .next()
  .post({uri: 'http://valid.url'})
    .expect(200)
  .next()
  .get()
    .expect(200)
    .expect('Body should be an array', function(err, res, body) {
      assert.isArray(JSON.parse(body));
    })
.export(module)