var flatiron = require('flatiron'),
    links    = require('./lib/links'),
    users    = require('./lib/users'),
    models   = require('./models/'),
    passport = require('passport'),
    crypto   = require('crypto'),
    Basic    = require('passport-http').BasicStrategy,
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

app.use(flatiron.plugins.http, {
  before: [
    passport.initialize(),
    function(req, res, next) {
      if(req.url === '/users' && req.method === 'POST') {
        return next();
      }
      
      passport.authorize('basic', {session: false})(req, res, next);
    }
  ]
});

app.router.get('/', function () {
  this.res.writeHead(200);
  this.res.end();
});

app.router.get('/links', links.all);
app.router.post('/links', links.create);
app.router.get('/links/:id', links.get);

app.router.post('/users', users.create);

app.start(8080);