var hater = require('hater');

var Model = hater.extend('user', {});

module.exports = Model.schema({
  'salt': hater.Types.String(),
  'password': hater.Types.String(),
  'email': hater.Types.String(),
  'name': hater.Types.String()
});
