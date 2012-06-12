module.exports = function() {
  this.string('name', {
    required: true,
    
    pattern: /^[A-Za-z]+$/
  });
  
  this.parent('Link');
};