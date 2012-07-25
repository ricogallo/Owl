var express  = require('express'),
    links    = require('./lib/links'),
    users    = require('./lib/users'),
    web      = require('./lib/web'),
    client   = require('./lib/client'),
    models   = require('./models/'),
    passport = require('passport'),
    connect  = require('connect'),
    login    = require('connect-ensure-login'),
    views    = require('consolidate'),
    server   = require('./oauth/server'),
    hbs      = require('hbs'),
    fs       = require('fs'),
    app      = express.createServer();

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({secret: process.env.SESSION_SECRET || 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

// VIEWS BEGIN

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

hbs.registerPartial('rightMenu', fs.readFileSync(__dirname + '/views/right-menu.hbs', 'utf8'));
hbs.registerPartial('linkEntry', fs.readFileSync(__dirname + '/views/link-entry.hbs', 'utf8'));


// VIEWS END

// AUTH BEGIN

require('./oauth/auth');

var oauth_login = function(fn) {
  return [
    passport.authenticate('bearer', { session: false }),
    fn
  ];
};

// AUTH END

// ROUTES BEGIN

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/sign_up', users.create);

app.get('/links', oauth_login(links.all));
app.post('/links', oauth_login(links.create));
app.del('/links/:id', oauth_login(links.del));
app.get('/links/:id', oauth_login(links.get));
app.put('/links/:id', oauth_login(links.update));

/* 
 * User routes
*/

app.get('/sign_up', web.signUp);
app.get('/login', web.signIn);
app.post('/login', web.login);
app.get('/logout', [login.ensureLoggedIn(), web.logout]);
app.get('/account', [login.ensureLoggedIn(), web.account]);
app.get('/users/:id', [passport.authenticate('bearer', { session: false }), users.get]);

/*
 * Oauth routes
*/
app.get('/oauth/authorize', server.auth);
app.post('/oauth/decision', server.decision);
app.post('/oauth/token', server.token);

/*
 * Client routes
*/

app.get('/client/new', [login.ensureLoggedIn(), client.createForm]);
app.post('/clients', [login.ensureLoggedIn(), client.create]); 

// ROUTES END

app.listen(8000);
