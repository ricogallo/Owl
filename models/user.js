var crypto = require('crypto');

module.exports = function() {
  this.string('username', {
    required: true,
    
    pattern: /^[A-Za-z0-9_!@\^\-\$\.]{0,23}$/,
    unique: true
  });
  
  this.string('salt', {required: true})
  this.string('password', {required: true});
  
  this.timestamps();
};