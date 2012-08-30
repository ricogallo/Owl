var hater = require('hater');

module.exports = {
  'client': hater.Types.String(),
  'client_id': hater.Types.String(),
  'redirect_uri': hater.Types.String(),
  'client_secret': hater.Types.String(),
  'user_id': hater.Types.Integer()
  // timestamps
};

