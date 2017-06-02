$(document).ready(function () {
	clearLocations();
	$.ajax({
		method: "GET",
		dataType: "json",
		crossDomain: true,
		url: "../locations",
		success: function (response) {
			updateLocations(response);
		},
		error: function (request, error) {
			errorMessage();
		}
	});
});

function clearLocations() {
	$('#locations').empty();
}

function addLocation(location) {
	$('#' + location.city).append('<a class="list-group-item" href="../pages/all-doctor-location.html?filter=' + location.id + '">' + location.name + '</a>');
}

function addParagraph(index) {
	$('#locations').append('<h4 class="list-index">' + index + '</h4>');
	$('#locations').append('<div class="list-group locations-list" id="' + index + '"></div>');
}

function updateLocations(locations) {
	var city;
	for (var i = 0; i < locations.length; i++) {
		if (locations[i].city !== city) {
			city = locations[i].city;
			addParagraph(city);
		}
		addLocation(locations[i]);
	}
}

function errorMessage(){
	$('#locations').append('<h3 class="error">Impossibile caricare la lista.</h3>');
}