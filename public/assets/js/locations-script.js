var locations = $('#locations');
$(document).ready(function () {
	console.log("I'm ready");
	clearLocations();
	$.ajax({
		method: "GET",
		dataType: "json",
		crossDomain: true,
		url: "../locations",
		success: function (response) {
			console.log(response);
			updateLocations(response);
		},
		error: function (request, error) {
			console.log(request + ":" + error);
		}
	});
});

function clearLocations() {
	$('#locations').empty();
	console.log("list cleaned");
}

function addLocation(location) {
	$('#' + location.city).append('<li><a href="../pages/location.html?id='+location.id+'">' + location.city + ', ' + location.address + '</a></li>');
	console.log("Added location!");
}

function addParagraph(index) {
	$('#locations').append('<h4 class="list-index">' + index + '</h4>');
	$('#locations').append('<ul class="locations-list" id="' + index + '"></ul');
	console.log("Added row!");
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