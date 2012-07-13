module.exports = function() {
  this.string('client_id');
  this.string('redirect_uri');
  this.string('client_secret');
  
  this.timestamps();
};