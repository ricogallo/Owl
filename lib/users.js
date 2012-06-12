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

    res.writeHead(200);
    return res.end();
  })
}

users.login = function() {
  var req = this.req,
      res = this.res;


  if (
    typeof req.username === 'undefined' ||
    typeof req.password === 'undefined'
  ) {
    res.writeHead(401); // 401 Unauthorized
    return res.end();
  }
       
  models.User.find({username: req.username}, function(err, docs) {
    var sha512 = crypto.createHash('sha512'), hash;

    //
    // If there's an error return a 500
    //
    if (err) {
      res.writeHead(500);
      return res.end();
    }

    //
    // If user doesn't exist, return a 401
    //
    if (docs.length === 0) {
      res.writeHead(401);
      return res.end();
    }

    docs = docs.shift();

    hash = sha512.update(docs.salt+req.password).digest('hex');

    //
    // If the provided password is wrong, return a 401
    //
    if (hash !== docs.password) {
      res.writeHead(401);
      return res.end();
    }

    req.session.uid = docs._id;
    req.session.username = docs.username;
    req.session.save(function (err) {
      //
      // If there's an error return a 500
      //
      if (err) {
        res.writeHead(500);
        return res.end();
      }

      res.writeHead(200);
      res.end();
    })

  });
};