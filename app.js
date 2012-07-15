var flatiron = require('flatiron'),
    links    = require('./lib/links'),
    users    = require('./lib/users'),
    models   = require('./models/'),
    passport = require('passport'),
    connect  = require('connect'),
    views    = require('consolidate'),
    server   = require('./oauth/server'),
    auth     = require('./oauth/auth'),
    app      = flatiron.app;

app.use(flatiron.plugins.http, {
  before: [
    connect.cookieParser(),
    connect.bodyParser(),
    connect.session({secret: process.env.SESSION_SECRET || 'keyboard cat'}),
    passport.initialize(),
    passport.session()
  ]
});

app.router.get('/', function () {
  this.res.writeHead(200);
  this.res.end();
});

app.router.get('/sign_up', function() {
  var res = this.res;

  views.handlebars('views/register.handlebars', {}, function(err, html) {
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(html);
  });
});

app.router.get('/links', links.all);
app.router.post('/links', links.create);
app.router.get('/links/:id', links.get);

app.router.post('/users', users.create);

app.start(8080);
