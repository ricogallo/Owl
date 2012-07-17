var models = require('../models/'),
    common = require('./common');

var users = exports;

users.create = function() {
  var req = this.req,
      res = this.res,
      username = req.body.username,
      password = req.body.password,
      salt = common.salt();
  
  if (
    typeof username === 'undefined' ||
    typeof password === 'undefined'
  ) {
   res.writeHead(400);
   return res.end(); 
  }

  password = common.crypt(salt + password);

  models.User.create({id: username, password: password, salt: salt}, function(err, docs) {
    //
    // If there's an error return a 500
    //
    if (err) {
      res.writeHead(500);
      return res.end();
    }
    res.writeHead(201);
    return res.redirect('/');
  });
};
