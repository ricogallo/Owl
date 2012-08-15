var hater = require('hater');

module.exports = {
  'username': hater.Types.String(),
  'salt': hater.Types.String(),
  'password': hater.Types.String(),
  'email': hater.Types.String(),
  'name': hater.Types.String()
};
