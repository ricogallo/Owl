var models = require('../models/'),
    crypto = require('crypto'),
    utile = require('utile');

var users = exports;

users.create = function() {
  var req = this.req,
      res = this.res,
      username = req.body.username,
      password = req.body.password,
      sha512 = crypto.createHash('sha512'),
      salt = utile.randomString(5);

  if (
    typeof username === 'undefined' ||
    typeof password === 'undefined'
  ) {
   res.writeHead(400);
   return res.end(); 
  }

  password = sha512.update(salt+password).digest('hex');

  models.User.create({username: username, password: password, salt: salt}, function(err, docs) {

    //
    // If there's an error return a 500
    //
    if (err) {
      res.writeHead(500);
      return res.end();
    }

    res.writeHead(201);
    return res.end();
  })
}
