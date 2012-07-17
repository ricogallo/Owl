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
    function (req, res) {
      req.originalUrl = req.url;
      res.emit('next');
    },
    connect.cookieParser(),
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
    res.html(html);
  });
});
app.router.post('/sign_up', users.create);


app.router.get('/links', links.all);
app.router.post('/links', links.create);
app.router.get('/links/:id', links.get);

/* 
 * User routes
*/

app.router.get('/login');
app.router.post('/login');
app.router.del('/logout');
app.router.get('/account');


/*
 * Oauth routes
*/
app.router.get('/oauth/authorize', server.authorization);
app.router.post('/oauth/authorize/decision', server.decision);
app.router.post('/oauth/token', server.token);


app.start(8000);
