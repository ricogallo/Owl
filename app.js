var express  = require('express'),
    passport = require('passport'),
    Redis    = require('./models').Redis,
    Store    = require('connect-redis')(express),
    api      = require('./api/app'),
    web      = require('./web/app'),
    app      = express();

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());

app.use(express.session({ store: new Store({ client: Redis, db: process.env.REDIS_DB || 'urlshipSessions', prefix: process.env.REDIS_PREFIX || 'ushp:'}), secret: require('utile').randomString(64) }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.use('/api', api);
app.use(web);

app.listen(8000, function() {
  console.log('Listening on port 8000');
});
