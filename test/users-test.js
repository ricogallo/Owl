var APIeasy     = require('api-easy'),
    assert      = require('assert'),
    toBasicAuth = require('./helpers').toBasicAuth;

var suite = APIeasy.describe('users.js');

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
        .expect(201)
     .next()
     .setHeader('Authorization', toBasicAuth('nonexistentuser', 'nonexistentpassword'))
     .get('/links')
        .expect(401)
     .next()
     .setHeader('Authorization', toBasicAuth('test', 'test'))
     .get('/links')
        .expect(200)
     .export(module);
