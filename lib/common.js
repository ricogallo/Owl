var crypto = require('crypto'),
    utile  = require('utile');
    common = exports;

common.crypt = function(pwd, salt) {
  return crypto.createHash('sha512').update(salt + pwd).digest('hext');
}

common.salt = function() {
  return utile.randomString(5);
}

