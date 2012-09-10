$(function() {
  $(".tagManager").tagsManager();  
  $("#signup").validate();
  $('.dropdown-toggle').dropdown();
  $('a[rel=popover]').popover({ trigger: 'click', placement: 'inside top'});
});

function search() {
  var query = document.getElementById('query');

  if (!query)
    return false;

  location.href = '/search/'+query.value;
  
  return false;
}
