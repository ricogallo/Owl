module.exports = function() {
  this.string('uri', {
    required: true,
    
    pattern: /^(http|https):\/\//
  });
  
  this.timestamps();
  
  this.parent('User');
};