var hater = require('hater'),
    redis = require('redis');

function buildString() {
  if(process.env.POSTGRESQL_DB) {
   return {
      type: 'postgresql',
      url : process.env.POSTGRESQL_DB
    };
  }
  else { 
    return { type: 'mysql', url: 'mysql://root@localhost/urlship' };
  }
}

var conn = buildString();

hater.connect(conn.type, conn.url);

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

// Bucket Model
models.Bucket = hater.define('bucket');
models.Bucket.schema(require('./bucket'));

// Relationships

hater.Relationships.oneToMany(models.User, models.Link);
hater.Relationships.manyToMany(models.Link, models.Tag);
hater.Relationships.oneToMany(models.User, models.Bucket);
hater.Relationships.manyToMany(models.Bucket, models.Link);
hater.Relationships.manyToMany(models.User, models.Tag);


hater.sync();

// Redis

models.Redis = process.env.REDIS_SESSION ? 
  (function() { 
    var obj    = JSON.parse(process.env.REDIS_SESSION),
        client = redis.createClient(obj.port, obj.host); 
    
    client.auth(obj.pass);

    return client; 
  })() :
  redis.createClient() ;


