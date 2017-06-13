var areasapi = "/areas/";

$(document).ready(function () {
	getAreas();
});


function getAreas(){
	$.ajax({
		method: "GET",
		dataType: "json",
		crossDomain: true,
		url: areasapi,
		success: function (response) {
			setAreas(response);
		},
		error: function (request, error) {
			$('#page-title').text("Errore - Impossibile caricare i dati richiesti.");
		}
	});
}


function addAreaToList(area) {
	$('#' + area.name.charAt(0)).append('<a class="list-group-item" href="../pages/all-doctor-area.html?filter=' + area.id + '">' + area.name + '</a>');
}


function addLetterToList(letter) {
	$('#areas').append('<h4 class="list-index">' + letter + '</h4>');
	$('#areas').append('<div class="list-group locations-list" id="' + letter + '"></div>');
}


function setAreas(areas) {
	var currentInitialLetter;
	for (var i = 0; i < areas.length; i++) {
		if (areas[i].name.charAt(0) !== currentInitialLetter) {
			currentInitialLetter = areas[i].name.charAt(0);
			addLetterToList(currentInitialLetter);
		}
		addAreaToList(areas[i]);
	}
}
