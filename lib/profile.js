var models = require('../models/'),
    views  = require('consolidate');

var profile = exports;

profile.account = function() {
  var res = this.req;

  consolidate.handlebars('../views/account.handlebars', function(err, html) {
    res.html(html);
  });
};


