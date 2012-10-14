var crypto  = require('crypto'),
    utile   = require('utile'),
    winston = require('winston'),
    Loggly  = require('winston-loggly').Loggly;

var common = exports;

if (process.env.LOGGLY_TOKEN)
  winston.add(Loggly, {
    subdomain: 'urlship',
    inputToken: process.env.LOGGLY_TOKEN
  });

common.error = function(e, code) {
  if (code === 500)
    winston.error(JSON.stringify(e));

  return new Error(code);
};

common.crypt = function(pwd, salt) {
  return crypto.createHash('sha512').update(salt + pwd).digest('hex');
};

common.salt = function() {
  return utile.randomString(5);
};

common.token = function() {
  return utile.randomString(52);
};

common.code = function() {
  return utile.randomString(16);
};

common.client_secret = function() {
  return utile.randomString(16);
};