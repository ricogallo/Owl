var crypto = require('crypto'),
    hater = require('hater');

var Model = hater.extend('token', {});

module.exports = Model.schema({
  'access_token': hater.Types.String(),
  'client_id': hater.Types.String(),
  'user_id': hater.Types.String()

  // TODO: timestamps

});