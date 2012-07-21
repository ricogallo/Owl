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

helpers.createToken = function(obj, cbl) {
  obj.id = common.token();
  models.Token.create(obj, cbl);
}

helpers.createCode = function(obj, cbl) {
  obj.id = common.code();
  models.Code.create(obj, cbl);
};
