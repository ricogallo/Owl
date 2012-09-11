$(function() {
  $(".tagManager").tagsManager();  
  $("#signup").validate();
  $('.dropdown-toggle').dropdown();
  $('a[rel=popover]').popover({ trigger: 'hover', placement: 'inside top'});


  /*
   * Tour for first time users
   *
   */

  var tour = new Tour();

  tour.addStep({
    element: '.rname',
    title  : 'Welcome to urlship',
    content: 'This is you! Your profile picture can be changed at <a href="https://gravatar.com">Gravatar</a>'
  });
});

function search() {
  var query = document.getElementById('query');

  if (!query)
    return false;

  location.href = '/search/'+query.value;
  
  return false;
}
