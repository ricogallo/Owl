var flatiron = require('flatiron'),
    links    = require('./lib/links'),
    users    = require('./lib/users'),
    connect  = require('connect'),
    app      = flatiron.app;
  
app.use(flatiron.plugins.http, {
  before: [
    function(req, res, next) { // handles basic auth
      var head, auth, username, password; 

      if (typeof req.headers.authorization === 'undefined')
        return next();

      head = req.headers.authorization.split(' ')[1] || '';
      auth = new Buffer(head, 'base64').toString('utf8');
      username = auth.split(":")[0];
      password = auth.split(":")[1];

      if (!username || !password)
        return next();

      req.username = username;
      req.password = password;

      return next();
    },
    connect.cookieParser(),
    connect.session({ key: 'sid', secret: 'herpderp', cookie: { maxAge: 60000 } })
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
app.router.get('/users/login', users.login);

app.start(8080);