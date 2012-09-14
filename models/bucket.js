var hater = require('hater');

module.exports = {
  name: hater.Types.String({ length: 32, unique: true })
};
