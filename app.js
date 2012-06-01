var flatiron = require('flatiron'),
    links    = require('./lib/links'),
    app      = flatiron.app;
  
app.use(flatiron.plugins.http);

app.router.get('/', function () {
  this.res.writeHead(200);
  this.res.end();
});

app.router.get('/links', links.all);


app.start(8080);