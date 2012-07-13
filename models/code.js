module.exports = function() {
  this.string('authorization_code');
  this.string('client_id');
  this.string('redirect_uri');
  this.string('user_id');
  
  this.timestamps();
};