var express     = require('express'),
    passport    = require('passport'),
    libs        = require('./lib/'),
    common      = require('./lib/common'),
    user        = require('../models/').User,
    middlewares = require('./middlewares'),
    login       = require('connect-ensure-login'),
    server      = require('../oauth/server');

var app = module.exports = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

/*
 * Set up locales
*/
app.use(express.csrf());
app.use(middlewares.locals);
app.use(middlewares.ensureAccount);
app.use(app.router);
app.use(middlewares.notFound);

require('../oauth/auth');

app.get('/', function(req, res) {
  if (req.user)
    return res.redirect('/me');

  res.render('index', { landing: true });
});

/*
 * User routes
*/
app.post('/send_mail'      , libs.users.sendMail);
app.post('/sign_up'        , libs.users.create);
app.get('/activate/:tok'   , libs.web.signUp);
app.get('/login'           , libs.web.signIn);
app.get('/login/:status'   , libs.web.signIn);
app.post('/login'          , libs.web.login);
app.get('/logout'          , [login.ensureLoggedIn(), libs.web.logout]);
app.get('/users/:id'       , [login.ensureLoggedIn(), libs.users.get]);
app.get('/me'              , [login.ensureLoggedIn(), libs.users.me]);
app.get('/account/:id'     , [login.ensureLoggedIn(), libs.users.account]);
app.get('/profile'         , [login.ensureLoggedIn(), libs.web.userProfile]);
app.post('/profile'        , [login.ensureLoggedIn(), libs.users.userProfile]);
app.get('/twitter'         , libs.web.twitter);
app.get('/twitter/callback', libs.web.twitterDone);
app.post('/email_sign_up'  , libs.users.completeRegistration);
app.get('/github'          , libs.web.github);
app.get('/github/callback' , libs.web.githubDone);

/*
 * Oauth routes
*/
app.get('/oauth/authorize', server.auth);
app.post('/oauth/decision', server.decision);
app.post('/oauth/token'   , server.token);

/*
 * Client routes
*/

app.get('/client/new', [login.ensureLoggedIn(), libs.client.createForm]);
app.post('/clients'  , [login.ensureLoggedIn(), libs.client.create]);
app.get('/clients'   , [login.ensureLoggedIn(), libs.client.show]);

/*
 * Links routes
*/

app.get('/new'       , [login.ensureLoggedIn(), libs.links.createForm]);
app.post('/links/new', [login.ensureLoggedIn(), libs.links.create]);
app.del('/delete/:id', [login.ensureLoggedIn(), libs.links.delete]);

/*
 * Tags routes
*/

app.get('/tags/:tag'        , [login.ensureLoggedIn(), libs.tags.byTag]);
app.get('/search/:tag'      , [login.ensureLoggedIn(), libs.tags.byTag]);
app.post('/subscribe/:tag'  , [login.ensureLoggedIn(), libs.tags.subscribe]);
app.post('/unsubscribe/:tag', [login.ensureLoggedIn(), libs.tags.unsubscribe]);
app.get('/timeline'         , [login.ensureLoggedIn(), libs.tags.timeline]);

/**
 *  Buckets routes
 */

app.get('/buckets/new'         , [login.ensureLoggedIn(), libs.buckets.createForm]);
app.post('/buckets'            , [login.ensureLoggedIn(), libs.buckets.create]);
app.get('/:user/buckets/:name' , [login.ensureLoggedIn(), libs.buckets.showOne]);
app.get('/:user/buckets'       , [login.ensureLoggedIn(), libs.buckets.show]);
app.get('/buckets/add_link/:id', [login.ensureLoggedIn(), libs.buckets.addForm]);
app.post('/buckets/add_link'   , [login.ensureLoggedIn(), libs.buckets.addLink]);
