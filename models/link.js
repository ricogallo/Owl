var hater = require('hater');

var Model = hater.extend('link', {});

module.exports = Model.schema({
  'uri': hater.Types.String(),
  
  this.parent('User');
});

module.exports.sync();