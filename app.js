var express  = require('express'),
    links    = require('./lib/links'),
    users    = require('./lib/users'),
    web      = require('./lib/web'),
    models   = require('./models/'),
    passport = require('passport'),
    connect  = require('connect'),
    login    = require('connect-ensure-login'),
    views    = require('consolidate'),
    server   = require('./oauth/server'),
    auth     = require('./oauth/auth'),
    hbs      = require('hbs'),
    app      = express.createServer();

app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: process.env.SESSION_SECRET || 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/sign_up', users.create);

app.get('/links', links.all);
app.post('/links', links.create);
app.get('/links/:id', links.get);

/* 
 * User routes
*/

app.get('/sign_up', web.signUp);
app.get('/sign_in', web.signIn);
app.post('/login', web.login);
app.del('/logout', [login.ensureLoggedIn(), web.logout]);
app.get('/account', [login.ensureLoggedIn(), web.account]);


/*
 * Oauth routes
*/
app.get('/oauth/authorize', server.authorization);
app.post('/oauth/authorize/decision', server.decision);
app.post('/oauth/token', server.token);


app.listen(8000);
