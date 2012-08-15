var hater = require('hater');
 
hater.connect('mysql', 'mysql://root:toor@localhost/urlship');

var models = exports;

models.User   = require('./user');
models.Link   = require('./link');
models.Tag    = require('./tag');
models.Client = require('./client');
models.Token  = require('./token');
models.Code   = require('./code');

// Relationships

hater.Relationships.oneToMany(models.User, models.Link);
hater.Relationships.manyToMany(models.Link, models.Tag);

hater.sync();