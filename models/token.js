module.exports = function() {
  this.string('access_token');
  this.string('user_id');
  this.string('client_id');
  
  this.timestamps();

  this.parent('Client');
};