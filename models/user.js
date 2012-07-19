var crypto = require('crypto');

module.exports = function() {
  this.string('salt', {required: true})
  this.string('password', {required: true});
  this.string('email', {required: true});
  this.string('name', {required: true});
  
  this.timestamps();
};
