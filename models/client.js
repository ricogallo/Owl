var hater = require('hater');

var Model = hater.extend('client', {});

module.exports = Model.schema({
  'client_id': hater.Types.String(),
  'redirect_uri': hater.Types.String(),
  'client_secret': hater.Types.String(),
  'user_id': hater.Types.String()

  // timestamps
};

module.exports.sync();