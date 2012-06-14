module.exports = function() {
  this.string('name', {
    required: true,
    
    pattern: /^[A-Za-z]+$/
  });
  
  this.timestamps();
  
  this.parent('Link');
};