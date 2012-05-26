var api    = require('api-easy'),
    assert = require('assert');

api
  .describe('app.js')
  .use('localhost', 8080)
  .get('/')
   .expect(200)
.export(module)