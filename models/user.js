module.exports = function() {
  this.string('username', {
    required: true,
    
    pattern: /^[A-Za-z0-9_!@\^\-\$\.]{0,23}$/
  });
  
  this.string('password', {required: true});
  
  this.timestamps();
};