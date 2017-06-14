var areasapi = "/areas/";

$(document).ready(function () {
	getAreas();
});


function getAreas(){
	$.ajax({
		method: "GET",
		dataType: "json",
		crossDomain: true,
		data:{
			sort: "name"
		},
		url: areasapi,
		success: function (response) {
			setAreas(response);
		},
		error: function (request, error) {
			errorMessage();
		}
	});
}


function addAreaToList(area) {
	$('#' + area.name.charAt(0)).append('<a class="list-group-item" href="../pages/all-service-area.html?filter=' + area.id + '">' + area.name + '</a>');
}

function addLetterToList(letter) {
	$('#areas').append('<h4 class="list-index">' + letter + '</h4>');
	$('#areas').append('<div class="list-group areas-list" id="' + letter + '"></div>');
}

function errorMessage() {
    $('#areas').append("<div class='col-xs-12 text-center'><p>Impossibile ottenere le informazioni richieste.</p></div>");
}

function setAreas(areas) {
	var currentInitialLetter;
	for (var i = 0; i < areas.length; i++) {
		if (areas[i].name.charAt(0) !== currentInitialLetter && $("#"+areas[i].name.charAt(0)).length===0) {
			currentInitialLetter = areas[i].name.charAt(0);
			addLetterToList(currentInitialLetter);
		}
		addAreaToList(areas[i]);
	}
}
