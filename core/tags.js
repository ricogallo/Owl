var models = require('../models/');

var tags = exports;

tags.get = function(obj, callback) {
  models.Tag.get(obj.id, function(e, tag) {
    if(e) {
      return e.error === 'not_found' ?
        callback(new Error(404)) :
        callback(new Error(500)) ;
    }

    tag.id = tag.id.split('/').pop();

    callback(e, tag);
  });
};