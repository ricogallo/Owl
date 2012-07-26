var links = exports;

links.createForm = function(req, res) {
  res.render('createLink', { user: req.user });
};
