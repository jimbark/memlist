// *********************************************************
// Application specific JS code to add to that provided by
// Bootstrap and HTML Boilerplate
// *********************************************************

// ensure correct tab in navbar is made active
$(document).ready(function() {
    $('a[href="' + this.location.pathname + '"]').parent().addClass('active');
});

// previous button
$('#prev').click(function () {
    // go to previous page/URL
    window.history.back();
});

// *********************************************************
// code for memlist page running local javascript

// when item button clicked toggle its state and display correct text
// either "click to reveal" or "item to be learned"
$('.item-button').on('click', function () {
  $(this).button('toggle');
  if ($(this).hasClass('active') === true) {
     $(this).button('revealed');
     }
  else {
     $(this).button('reset');
     }
});



// *********************************************************


