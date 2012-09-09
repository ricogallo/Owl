var hater = require('hater');

module.exports = {
  'uri': hater.Types.String({validate: {pattern: '^(http|https)://'}}),
  'favicon': hater.Types.String(),
  'title': hater.Types.String()
};
