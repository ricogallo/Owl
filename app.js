var express  = require('express'),
    passport = require('passport'),
    api      = require('./api/app'),
    web      = require('./web/app'),
    hbs      = require('hbs'),
    fs       = require('fs'),
    app      = express.createServer();

app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: process.env.SESSION_SECRET || 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.use('/api', api);
app.use(web);

// VIEWS BEGIN

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

hbs.registerPartial('rightMenu', fs.readFileSync(__dirname + '/views/right-menu.hbs', 'utf8'));
hbs.registerPartial('linkEntry', fs.readFileSync(__dirname + '/views/link-entry.hbs', 'utf8'));


// VIEWS END

app.listen(8000);
