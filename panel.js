$(document).ready(function($){
  $('#cheese').on('click', function(event){
    console.log("hello");
    event.preventDefault();
    $('.cd-panel').addClass('is-visible');
  });
  $('.cd-panel').on('click', function(event){
    if( $(event.target).is('.cd-panel') || $(event.target).is('.cd-panel-close') ) {
      $('.cd-panel').removeClass('is-visible');
      event.preventDefault();
    }
  });
});
