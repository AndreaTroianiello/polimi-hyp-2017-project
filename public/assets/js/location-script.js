$(document).ready(function () {
	console.log("I'm ready");
	init();
	$.ajax({
		method: "GET",
		dataType: "json",
		crossDomain: true,
		url: "../locations/"+URL.id,
		success: function (response) {
			console.log(response);
			updateLocation(response);
		},
		error: function (request, error) {
			console.log(request + ":" + error);
			$('#location-info').empty();
			errorMessage();
		}
	});
});

function updateLocation(location){
	$('title').text(location.city+','+location.address);
	$('#location-title').text(location.city+','+location.address);
	$('#location-address').text(location.city+','+location.address);
	$('#location-telephone').text(location.phone);
	$('#location-fax').text(location.fax);
	$('#location-email').text(location.email);
	$('#location-timetable').text(location.timetable);
	$('#info-map').attr("href", "./directions.html?id="+URL.id);
}

function init(){
	$('#location-title').text('');
	$('#location-address').text('');
	$('#location-telephone').text('');
	$('#location-fax').text('');
	$('#location-email').text('');
	$('#location-timetable').text('');
	$('.dynamic').hide(true);
}

function errorMessage(){
	$('#location-info').append('<h3 class="error">Impossibile le informazione della struttura.</h3>');
}

var URL = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
  return query_string;
}();