// TODO: Table and relationship

var hater = require('hater');

module.exports = function() { 
  this.timestamps();
  
  this.parent('Link');
};



//module.exports.sync();