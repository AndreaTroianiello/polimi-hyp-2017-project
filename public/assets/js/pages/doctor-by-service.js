var serviceapi = "/services/";

$(document).ready(function () {
	getServices();
});


function getServices(){
	$.ajax({
		method: "GET",
		dataType: "json",
		crossDomain: true,
		data:{
			sort: "name"
		},
		url: serviceapi,
		success: function (response) {
			setServices(response);
		},
		error: function (request, error) {
			errorMessage();
		}
	});
}


function addServiceToList(service) {
	$('#' + service.name.charAt(0)).append('<a class="list-group-item" href="../pages/all-doctor-service.html?filter=' + service.id + '">' + service.name + '</a>');
}


function addLetterToList(letter) {
	$('#service').append('<h4 class="list-index">' + letter + '</h4>');
	$('#service').append('<div class="list-group locations-list" id="' + letter + '"></div>');
}

function errorMessage() {
    $('#service').append("<div class='col-xs-12 text-center'><p>Impossibile ottenere le informazioni richieste.</p></div>");
}

function setServices(services) {
	var currentInitialLetter;
	for (var i = 0; i < services.length; i++) {
		if (services[i].name.charAt(0) !== currentInitialLetter && $("#"+services[i].name.charAt(0)).length===0) {
			currentInitialLetter = services[i].name.charAt(0);
			addLetterToList(currentInitialLetter);
		}
		addServiceToList(services[i]);
	}
}
