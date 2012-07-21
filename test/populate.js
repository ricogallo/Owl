var models = require('../models/'),
    common = require('../lib/common');

var helpers = exports;

helpers.createClient = function(obj, cbl) {
  obj.client_secret = '-70DwJbpcAFeiixa';
  models.Client.create(obj, cbl);
};

helpers.createUser = function(obj, cbl) {
  obj.id = obj.username;
  obj.salt = common.salt();
  obj.password = common.crypt(obj.salt + obj.password);
  models.User.create(obj, cbl);
};

helpers.createToken = function(obj, cbl) {
  obj.id = common.token();
  models.Token.create(obj, cbl);
}

helpers.createCode = function(obj, cbl) {
  obj.id = 'dSqqtTyX1f4MKlCm';
  models.Code.create(obj, cbl);
};
