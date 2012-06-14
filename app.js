var flatiron = require('flatiron'),
    links    = require('./lib/links'),
    users    = require('./lib/users'),
    models   = require('./models/'),
    passport = require('passport'),
    crypto   = require('crypto'),
    Basic    = require('passport-http').BasicStrategy,
    connect  = require('connect'),
    app      = flatiron.app;

passport.use(new Basic(
  function(username, password, done) {
    models.User.find({username: username}, function(err, docs) {
      var sha512 = crypto.createHash('sha512'), hash;

      if(err) return done(err);

      if(!docs.length) { return done(null, false); }
      
      var user = docs.shift();

      hash = sha512.update(user.salt + password).digest('hex');

      if (hash === user.password) {
        done(null, user);
      } else {
        done(null, false);
      }

    });
  }
));


var authorize = function(fn) {
  return function() {
    passport.authorize('basic', {session: false});
    fn.call(this);
  }
}

app.use(flatiron.plugins.http, {
  before: [
    connect.cookieParser(),
    connect.session({ key: 'sid', secret: 'herpderp', cookie: { maxAge: 60000 } }),
    passport.initialize()
  ]
});

app.router.get('/', function () {
  this.res.writeHead(200);
  this.res.end();
});

app.router.get('/links', authorize(links.all));
app.router.post('/links', authorize(links.create));
app.router.get('/links/:id', authorize(links.get));

app.router.post('/users', users.create);

app.start(8080);