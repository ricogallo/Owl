var resourceful = require('resourceful');
  
resourceful.use('memory');

var models = exports;

models.User   = resourceful.define('User', require('./user'));
models.Link   = resourceful.define('Link', require('./link'));
models.Tag    = resourceful.define('Tag', require('./tag'));
models.Client = resourceful.define('Client', require('./client'));
models.Token  = resourceful.define('Token', require('./token'));
models.Code   = resourceful.define('Code', require('./code'));