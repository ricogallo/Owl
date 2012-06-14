var api         = require('api-easy'),
    assert      = require('assert'),
    toBasicAuth = require('./helpers').toBasicAuth;


api
  .describe('links.js')
  .use('localhost', 8080)
  .setHeader('Content-Type', 'application/json')
  .post('/users', {username: 'testo', password: 'testo'}) // registration
    .expect(201)
  .next()
  .setHeader('Authorization', toBasicAuth('testo', 'testo'))
  .path('/links')
    .get()
      .expect(404)
    .next()
    .post({uri: 'invalidurl', tags: '1'})
      .expect(500)
    .next()
    .post({uri: 'http://valid.url', tags: 'how,are,you'})
      .expect(200)
    .next()
    .get()
      .expect(200)
      .expect('Body should be an array', function(err, res, body) {
        assert.isArray(JSON.parse(body));
      })
  .export(module)