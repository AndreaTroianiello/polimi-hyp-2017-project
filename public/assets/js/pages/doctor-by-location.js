var locationapi = "/locations/";

$(document).ready(function () {
	getLocations();
});


function getLocations(){
	$.ajax({
		method: "GET",
		dataType: "json",
		crossDomain: true,
		url: locationapi,
		success: function (response) {
			setLocations(response);
		},
		error: function (request, error) {
			errorMessage();
		}
	});
}


function addLocationToList(location) {
	$('#' + location.city).append('<a class="list-group-item" href="../pages/all-doctor-location.html?filter=' + location.id + '">' + location.name + '</a>');
}


function addCityToList(city) {
	$('#locations').append('<h4 class="list-index">' + city + '</h4>');
	$('#locations').append('<div class="list-group locations-list" id="' + city + '"></div>');
}

function errorMessage() {
    $('#locations').append("<div class='col-xs-12 text-center'><p>Impossibile ottenere le informazioni richieste.</p></div>");
}


function setLocations(locations) {
	var currentCity;
	for (var i = 0; i < locations.length; i++) {
		if (locations[i].city !== currentCity) {
			currentCity = locations[i].city;
			addCityToList(currentCity);
		}
		addLocationToList(locations[i]);
	}
}
