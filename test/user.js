var vows = require("vows"),
    assert = require("assert");

var user = vows.describe("user.js");

var User = require("../models").User;

user.addBatch({
  'A user registration should fail': {
    topic: function() {
      User.create({username: "<>£", password: "test"}, this.callback);
    },
    
    'when a bad username is taken': function(err, docs) {
      assert.isNotNull(err);
      assert.isUndefined(docs);
    }
  },
  
  'A user registration should not fail': {
    topic: function() {
      User.create({username: "$@!_-Ab", password: "test"}, this.callback);
    },
    
    'when a good username is taken': function(err, docs) {
      assert.isNull(err);
      assert.isNotNull(docs);
    }
  }
}).export(module);