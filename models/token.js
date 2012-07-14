module.exports = function() {
  this.string('access_token');
  this.string('client_id');
  
  this.timestamps();

  this.parent('User');
};
