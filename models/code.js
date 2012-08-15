var hater = require('hater');

var Model = hater.extend('code', {});

module.exports = Model.schema({
  'authorization_code': hater.Types.String(),
  'client_id': hater.Types.String(),
  'redirect_uri': hater.Types.String(),
  'user_id': hater.Types.String()
  
  // Timestamps
});