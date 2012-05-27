var vows = require("vows"),
    assert = require("assert");

var link = vows.describe("link.js");

var User = require("../models").User;

link.addBatch({
  'A link insertion should fail': {
    topic: function() {
      var self = this;
      User.create({username: 'test', password: 'test'}, function(err, docs) {
        docs.createLink({uri: 'test'}, self.callback);
      });
    },
    
    'when it is not a valid link': function(err, docs) {
      assert.isNotNull(err);
      assert.isUndefined(docs);
    }
  },
  
  'A link insertion should not fail': {
    topic: function() {
      var self = this;
      User.create({username: 'test', password: 'test'}, function(err, docs) {
        docs.createLink({uri: 'http://www.google.it'}, self.callback);
      });
    },
    
    'when it is a valid link': function(err, docs) {
      assert.isNull(err);
      assert.isNotNull(docs);
    }
  }
}).export(module);