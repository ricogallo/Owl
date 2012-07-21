var models = require('../models/'),
    common = require('../lib/common');

var helpers = exports;

helpers.createClient = function(obj, cbl) {
  obj.client_secret = common.client_secret();
  models.Client.create(obj, cbl);
};

helpers.createUser = function(obj, cbl) {
  obj.salt = common.salt();
  obj.password = common.crypt(obj.salt + obj.password);
  models.User.create(obj, cbl);
};

helpers.createToken = models.Token.create;

helpers.createCode = models.Code.create;
