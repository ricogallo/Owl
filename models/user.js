var hater = require('hater');

module.exports = {
  'salt': hater.Types.String(),
  'password': hater.Types.String(),
  'email': hater.Types.String(),
  'name': hater.Types.String()
};
