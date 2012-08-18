var hater = require('hater');

module.exports = {
  'uri': hater.Types.String({validate: {pattern: '^(http|https)://'}})
}