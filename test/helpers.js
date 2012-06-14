exports.toBasicAuth = function toBasicAuth(username, password) {
  return 'Basic '+ new Buffer(username+':'+password).toString('base64');
}