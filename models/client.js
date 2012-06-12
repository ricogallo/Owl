module.exports = function() {
  this.string('client_uri', {required: true});
  this.string('client_secret', {required: true});
  
  this.parent('User');
  
  this.timestamps();
};