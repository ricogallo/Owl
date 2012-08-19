var express  = require('express'),
    passport = require('passport'),
    api      = require('./api/app'),
    web      = require('./web/app'),
    app      = express();

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: process.env.SESSION_SECRET || 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.use(express.methodOverride());
app.use('/api', api);
app.use(web);

app.listen(process.env.VCAP_APP_PORT || 8000);
