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


// Reveal all button - reveal all items at once, set state to active
$('#revealButton').on('click', function () {
  $('.item-button').button('revealed').addClass('active');
  //$('.item-button').addClass('active');
});

// Hide all button - hide all items at once, remove active state
$('#hideButton').on('click', function () {
  $('.item-button').button('reset').removeClass('active');
  //$('.item-button').removeClass('active');
});

// when any button within 'items' button group is clicked toggle its state and display correct text
// either "click to reveal" or "item to be learned"
$('#items').on('click', 'button', function () {
  //console.log("ID of button pressed is  " + $(this).attr('id'));
  $(this).button('toggle');
  //console.log("ran toggle function, now checking active class");
  if ($(this).hasClass('active') === true) {
     //console.log( "active class detected as true, runnign revealed function");
     $(this).button('revealed');
     }
  else {
     //console.log( "active class detected as not present, running reset function");
     $(this).button('reset');
     }
});

// List select drop-down - request the required list to be returned as a JSON object
$('.list-select').on('click', function () {
    // log list request
    console.log('list selection requested via drop-down');
    alert('list selection requested via drop-down');


    //$('.item-button').button('reset').removeClass('active');
    //$('.item-button').removeClass('active');


    // Using the core $.ajax() method
    $.ajax({
        // the URL for the request
        url: "/listload",

        // the data to send (will be available in the body)
        data: {
        //    listid: 'ztpenable',
        //    filename: $("#conffile").val(),
        //    sysmac: $("#sysmac").val(),
	    listid: $(this).attr('id'),
        },

        // whether this is a POST or GET request
        type: "POST",

        // the type of data we expect back
        dataType : "json",

        // code to run if the request succeeds;
        // the response is passed to the function


        success: function( json ) {
            if(json.success){
                //display feedback message from server
                //$('#fback').html(json.message);
		alert('Got json object back with message: ' + json.message + ' , and list object is: ' + json.list);

		var list = JSON.parse(json.list);

		// NOW set DOM objects with values from list object !!!!

		$('#list-title').html(list.title);

		// delete all old buttons
		$('.item-button').remove();

		// add new buttons using data from AJAX object
		var div = document.getElementById("items");
		
		// load new list data into buttons
		//$('#myStateButton1').attr("data-revealed-text", list.items[0]);

		for (var i=0; i < list.items.length; i++) {

		    var itemid = 'myStateButton' + (i+1);
 
		    $('#items').append('<button type="button" class="btn btn-info btn-block 
                       item-button" id=' + itemid + ' 
                       data-revealed-text="' + list.items[i] +' " 
                       autocomplete="off">click to reveal item</button>');

		}



		/*

		$('#items').append('<button type="button" class="btn btn-info btn-block 
                   item-button" id="myStateButton1" 
                   data-revealed-text="cheese" 
                   autocomplete="off">click to reveal item</button>');
		$('#items').append('<button type="button" class="btn btn-info btn-block 
                   item-button" id="myStateButton2" 
                   data-revealed-text="on toast" 
                   autocomplete="off">click to reveal item</button>');

		*/

		//$('#myStateButton1').attr("data-revealed-text", "cheese");
		//$('#myStateButton2').attr("data-revealed-text", list.items[1]);
		//$('#myStateButton3').attr("data-revealed-text", list.items[2]);
		//$('#myStateButton4').attr("data-revealed-text", list.items[3]);
		//$('#myStateButton5').attr("data-revealed-text", list.items[4]);
		//$('#myStateButton6').attr("data-revealed-text", list.items[5]);
		//$('#myStateButton7').attr("data-revealed-text", list.items[6]);
		//$('#myStateButton8').attr("data-revealed-text", list.items[7]);


		
                // add button to offer viewing of boot files
                //var div = document.getElementById("confloadbuttons");
                //var fname = $("#conffile").val();
                //$("<a/>", { href: "/viewscript?file=" + fname, html: "View boot script 2", "class": "btn btn-info btn-sm", "role": "button"}).appendTo(div);
                //console.log("created new a element and tried to append");

            } else {
                //display feedback message from server
                //$('#fback').html(json.message);
		alert('Got json object back with message: ' + json.message);
            }
        },

        // code to run if the request fails; the raw request and
        // status codes are passed to the function
        error: function( xhr, status, errorThrown ) {
            alert( "Sorry, there was a problem!" );
            console.log( "Error: " + errorThrown );
            console.log( "Status: " + status );
            console.dir( xhr );
        },

        // code to run regardless of success or failure
        //complete: function( xhr, status ) {
        //    alert( "The request is complete!" );
        //}
    });
});

// *********************************************************

//  OLD STUFF - just here for reference, delete when finished

// when item button clicked toggle its state and display correct text
// either "click to reveal" or "item to be learned"
/*$('.item-button').on('click', function () {

  console.log("ID of button pressed is  " + $(this).attr('id'));

  $(this).button('toggle');

  console.log("ran toggle function, now checking active class");

  if ($(this).hasClass('active') === true) {

     console.log( "active class detected as true, runnign revealed function");
     $(this).button('revealed');
     }
  else {

     console.log( "active class detected as not present, running reset function");
     $(this).button('reset');
     }
});
*/

//$(document).ready(function(){
//    $('#sign_up').click(function(){
//        alert('Sign new href executed.');
//    });
//});



// *********************************************************


