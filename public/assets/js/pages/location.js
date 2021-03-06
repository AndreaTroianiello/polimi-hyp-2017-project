$(document).ready(function () {
	getSideMenu();
	$.ajax({
		method: "GET",
		dataType: "json",
		crossDomain: true,
		url: "../locations/" + URL.id,
		success: function (response) {
			updateLocation(response);
		},
		error: function (request, error) {
			$('.loc-info').remove();
			errorMessage();
		}
	});
	$('.other-page').click(function (){
		setSideMenu();
	});
});

function updateLocation(location) {
	$('title').text(location.name);
	$('#location-building').append('<img src="' + location.img + '" class="img-responsive center-block doc-image" />');
	$('#location-title').text(location.name);
	$('#location-address').text(location.city + ',' + location.address);
	$('#location-telephone').text(location.phone);
	$('#location-telephone').attr("href", "tel:" + location.phone);
	$('#location-fax').text(location.fax);
	$('#location-fax').attr("href", "tel:" + location.phone);
	$('#location-email').text(location.email);
	$('#location-email').attr("href", "mailto:" + location.email);
	$('#location-timetable').text(location.timetable);
	$('.info-map').attr("href", "./directions.html?id=" + URL.id);
	$('#gallery').attr("href", "./gallery.html?id=" + URL.id);
	$('#available-services').attr("href","./available-here.html?id="+location.id);
}

function errorMessage() {
	$('#location-info').append("<div class='col-xs-12 text-center'><p>Impossibile ottenere le informazioni richieste.</p></div>");
}


function getSideMenu() {
    previous_label = window.sessionStorage.getItem("label");
    previous_url = window.sessionStorage.getItem("url");
    if (previous_label !== null) {
        $('#sidemenu').append("<a href='" + previous_url + "' class='list-group-item'>" + previous_label + "</a>");
    }
    window.sessionStorage.clear();
}

function setSideMenu(){
    if(previous_label!==null){
        window.sessionStorage.setItem("label",previous_label);
        window.sessionStorage.setItem("url", previous_url);
    }
}

var URL = function () {
	// This function is anonymous, is executed immediately and 
	// the return value is assigned to QueryString!
	var query_string = {};
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined") {
			query_string[pair[0]] = decodeURIComponent(pair[1]);
			// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
			var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
			query_string[pair[0]] = arr;
			// If third or later entry with this name
		} else {
			query_string[pair[0]].push(decodeURIComponent(pair[1]));
		}
	}
	return query_string;
}();