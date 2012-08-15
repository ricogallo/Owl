var hater = require('hater');
 
hater.connect('mysql', 'mysql://root:toor@localhost/urlship');

var models = exports;

// User Model
models.User   = hater.define('user');
models.User.schema(require('./user'));

// Link Model
models.Link   = hater.define('link');
models.Link.schema(require('./link'));

// Tag Model
models.Tag    = hater.define('tag');
models.Tag.schema(require('./tag'));

// Client Model
models.Client = hater.define('client');
models.Client.schema(require('./client'));

// Token Model
models.Token  = hater.define('token');
models.Token.schema(require('./token'));

// Code Model
models.Code   = hater.define('code');
models.Code.schema(require('./code'));

// Relationships

hater.Relationships.oneToMany(models.User, models.Link);
hater.Relationships.manyToMany(models.Link, models.Tag);

hater.sync();
