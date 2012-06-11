var flatiron = require('flatiron'),
    links    = require('./lib/links'),
    app      = flatiron.app;
  
app.use(flatiron.plugins.http, {
  before: [function(req, res, next) { // handles basic auth
    var head, auth, username, password; 

    if (typeof req.headers.authorization === 'undefined')
      return next();

    head = req.headers.authorization.split(" ")[1];
    auth = new Buffer(head, 'base64').toString('utf8');
    username = auth.split(":")[0];
    password = auth.split(":")[1];

    req.username = username;
    req.password = password;

    return next();
  }]
});

app.router.get('/', function () {
  this.res.writeHead(200);
  this.res.end();
});

app.router.get('/links', links.all);
app.router.get('/links/:id', links.get);

app.start(8080);