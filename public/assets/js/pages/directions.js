$(document).ready(function () {
	init();
	var geocoder = new google.maps.Geocoder();
	var map=initMap();
	$.ajax({
		method: "GET",
		dataType: "json",
		crossDomain: true,
		url: "../locations/" + URL.id + "/directions",
		success: function (response) {
			$('title').text(response.name);
			setDirections(response);
			var address = response[0].city + "," + response[0].address;
			geocoder.geocode({
				'address': address
			}, function (results, status) {
				if (status == 'OK') {
					map.setCenter(results[0].geometry.location);
					var marker = new google.maps.Marker({
						map: map,
						position: results[0].geometry.location
					});
				} else {
					alert('La geolocalizzazione non ha avuto successo');
				}
			})
		},
		error: function (request, error) {
			$('#map').remove();
			$('#indications').remove();
			errorMessage();
		}
	});
	
	$('.other-page').click(function (){
		setSideMenu();
	});
});

function init() {
	$('title').text('Struttura');
	$('.location').attr("href", "./location.html?id=" + URL.id);
	$('#gallery').attr("href", "./gallery.html?id=" + URL.id);
	getSideMenu();
}

function initMap() {
	var myLatlng = new google.maps.LatLng(49.47143, 11.107489999999984);
	var mapOptions = {
		zoom: 18,
		center: myLatlng
	};
	var map = new google.maps.Map(document.getElementById('map'), mapOptions);
	return map;
}

function setDirections(directions){
	for(var i = 0; i < directions.length; ++i)
		$('#indications').append('<li class="text-justify">' + directions[i].directions + '</li>');
}

function errorMessage() {
	$('#info-map').append("<div class='col-xs-12 text-center'><p>Impossibile ottenere le informazioni richieste.</p></div>");

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