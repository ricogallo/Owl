$(function() {
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

  tour.addStep({
    element  : '#url-input',
    title    : 'Links',
    placement: 'bottom',
    content  : 'Your timeline looks empty, why don\'t we create a link? (Press <code>enter</code> to submit each tag)'
  });

  tour.addStep({
    element  : '.tags:first',
    title    : 'Tags',
    placement: 'bottom',
    content  : 'Here you can see the tags you\'ve saved, you can click on it or hover it to follow the tag'
  });

  tour.addStep({
    element  : 'i.icon-tags',
    title    : 'Followed tags',
    placement: 'left',
    content  : 'Once you follow a tag, it appears here, the links that match the tags you\'re following appear in <a href="/timeline">the timeline</a>'
  });

  tour.start();
});
