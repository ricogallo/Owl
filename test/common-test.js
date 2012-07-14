var vows   = require('vows'),
    assert = require('assert'),
    common = require('../lib/common');

vows
  .describe('common')
  .addBatch({
    '#salt()': {
      topic: function() {
        return common.salt();
      },
      'should return a random string': function(res) {
        assert.isString(res);
      }
    },
    '#crypt': {
      topic: function() {
        return common.crypt('salt' + 'pwd');
      },
      'should digest hex': function(res) {
        assert.isString(res);
      }
    }
  })
  .export(module);
