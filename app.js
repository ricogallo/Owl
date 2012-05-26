var flatiron = require('flatiron'),
    app = flatiron.app;
  
app.use(flatiron.plugins.http);

app.router.get('/', function () {
  this.res.writeHead(200);
  this.res.end();
});

app.start(8080);