var hater = require('hater');

hater.connect('mysql', 'mysql://root:toor@localhost/urlship');

var Model = hater.define('user', {});


module.exports = Model.schema({
  'salt': hater.Types.String(),
  'password': hater.Types.String(),
  'email': hater.Types.String(),
  'name': hater.Types.String()
});