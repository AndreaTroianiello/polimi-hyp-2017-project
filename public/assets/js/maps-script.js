var geocoder;
var map;
$(document).ready(function () {
	console.log("I'm ready");
	init();
	geocoder = new google.maps.Geocoder();
	initMap();
	$.ajax({
		method: "GET",
		dataType: "json",
		crossDomain: true,
		url: "../locations/" + URL.id,
		success: function (response) {
			var address = response.city + "," + response.address;
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
			console.log(request + ":" + error);
			$('#info-map').empty();
			errorMessage();
		}
	});
});

function init() {
	$('.location').attr("href", "./location.html?id=" + URL.id);
	$('.dynamic').hide(true);
}

function initMap() {
	var myLatlng = new google.maps.LatLng(49.47143, 11.107489999999984);
	var mapOptions = {
		zoom: 20,
		center: myLatlng
	};
	map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

function errorMessage() {
	$('#info-map').append('<h3 class="error">Impossibile le informazioni della struttura.</h3>');
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