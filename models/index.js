var hater = require('hater');

function buildString() {
  if(process.env.VCAP_SERVICES) {
    var res = JSON.parse(process.env.VCAP_SERVICES),
        db  = res[Object.keys(res).shift()];

    return {
      type: 'postgresql',
      url : 'tcp://' + db.user + ':' + db.password + '@' + db.host + ':' + db.port + '/' + db.name
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

hater.sync();
