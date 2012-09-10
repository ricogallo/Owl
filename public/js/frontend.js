$(function() {
  $(".tagManager").tagsManager({ preventSubmitOnEnter: false });  
  $("#signup").validate();
  $('.dropdown-toggle').dropdown();
  $('a[rel=popover]').popover({ trigger: 'click', placement: 'inside top'});
});
