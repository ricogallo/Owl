var hater = require('hater');

module.exports = {
  'username': hater.Types.String({validate: {minLength: 4, maxLength: 20}}),
  'salt': hater.Types.String(),
  'password': hater.Types.String(),
  'email': hater.Types.String({validate: {pattern: /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/}}),
  'name': hater.Types.String({validate: {pattern: /[a-zA-Z]+ [a-zA-Z]+/}})
};
