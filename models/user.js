var hater = require('hater');

module.exports = {
  'username': hater.Types.String({validate: {minLength: 5, maxLength: 20}}),
  'salt': hater.Types.String(),
  'password': hater.Types.String(),
  'email': hater.Types.String({validate: {pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/}}),
  'name': hater.Types.String({validate: {pattern: /[a-zA-Z]+ [a-zA-Z]+/}})
};
