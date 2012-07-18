var resourceful = require('resourceful');
 
if(process.env.COUCHDB_URL) {
  resourceful.use('couchdb', { 
    uri: process.env.COUCHDB_URL, 
    auth: { 
      username: process.env.COUCHDB_USER, 
      password: process.env.COUCHDB_PWD
    }
  });
} else {
  resourceful.use('couchdb', { uri: 'couchdb://localhost/urlship' });
}

var models = exports;

models.User   = resourceful.define('User', require('./user'));
models.Link   = resourceful.define('Link', require('./link'));
models.Tag    = resourceful.define('Tag', require('./tag'));
models.Client = resourceful.define('Client', require('./client'));
models.Token  = resourceful.define('Token', require('./token'));
models.Code   = resourceful.define('Code', require('./code'));
