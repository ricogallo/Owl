var express  = require('express'),
    passport = require('passport'),
    users    = require('./lib/users'),
    buckets  = require('./lib/buckets'),
    links    = require('./lib/links'),
    tags     = require('./lib/tags');

var app = module.exports = express();

var oauth_login = function(fn) {
  return [
    passport.authenticate('bearer', { session: false }),
    fn
  ];
};

app.get('/', function(req, res) {
  res.send(200);
});

app.get('/links', oauth_login(links.all));

/* @api
 * @path POST /links;
 * @descr Creates new link;
 * @param uri String URL to post;
 * @param tags String List of tags (comma separated);
*/
app.post('/links', oauth_login(links.create));

/* @api
 * @path DELETE /links/:id;
 * @descr Deletes link;
 * @param id String Id of the URL to delete;
*/
app.del('/links/:id', oauth_login(links.del));

/* @api
 * @path GET /links/:id;
 * @descr Gets link;
 * @param id String Id of the link to get;
*/
app.get('/links/:id', oauth_login(links.get));

/* @api
 * @path PUT /links/:id;
 * @descr Updates link;
 * @param id String Id of the link to update;
*/
app.put('/links/:id', oauth_login(links.update));

/* @api
 * @path GET /users/:id;
 * @descr Gets user;
 * @param id String Id of the user to get;
*/
app.get('/users/:id', oauth_login(users.get));


/* @api
 * @path GET /users/:id/links;
 * @descr Gets user links;
 * @param id String Id of the user;
*/
app.get('/users/:id/links', oauth_login(links.user));

/* @api
 * @path GET /timeline;
 * @descr Timeline;
*/
app.get('/timeline', oauth_login(links.timeline));


/* @api
 * @path GET /subscribe/:tag;
 * @descr Subscribe;
 * @param tag
*/
app.post('/subscribe', oauth_login(tags.subscribe));


/* @api
 * @path GET /unsubscribe/:tag;
 * @descr Unsubscribe;
 * @param tag
*/
app.post('/unsubscribe', oauth_login(tags.unsubscribe));

/* @api
 * @path GET /me;
 * @descr Gets logged user profile;
*/
app.get('/me', oauth_login(users.me));

/* @api
 * @path POST /buckets;
 * @descr Creates new bucket;
*/

app.post('/buckets', oauth_login(buckets.create));
app.get('/:user/buckets/:name', oauth_login(buckets.showOne));
app.get('/:user/buckets', oauth_login(buckets.show));
app.post('/buckets/add_link', oauth_login(buckets.addLink));
