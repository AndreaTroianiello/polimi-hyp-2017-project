var errorText;
$(document).ready(function () {
	errorText = "";
	$('#send').on('click', function () {
		if (controlInfo("nome") & controlInfo("cognome") & controlEmail() & controlInfo("oggetto") & controlInfo("messaggio"))
			sendMessage();
		else {
			alert(errorText);
			errorText = "";
		}
	});
	$('#cancel').on('click', function () {
		cleanInfo();
	});
});

function sendMessage() {
	$.ajax({
		method: "POST",
		dataType: "json",
		crossDomain: true,
		url: "../genreq",
		data: {
			name: $('#nome').val(),
			surname: $('#cognome').val(),
			email: $('#email').val(),
			object: $('#oggetto').val(),
			message: $('#messaggio').val()
		},
		success: function (response) {
			cleanInfo();
		},
		error: function (request, error) {
			errorMessage();
		}
	});
}

function controlInfo(id) {
	if (!$('#' + id).val()) {
		errorText += "Il campo " + id + " non è valido. \n";
		return false;
	} else {
		return true;
	}
}

function controlEmail() {
	var re = /^(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){255,})(?!(?:(?:\x22?\x5C[\x00-\x7E]\x22?)|(?:\x22?[^\x5C\x22]\x22?)){65,}@)(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22))(?:\.(?:(?:[\x21\x23-\x27\x2A\x2B\x2D\x2F-\x39\x3D\x3F\x5E-\x7E]+)|(?:\x22(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|(?:\x5C[\x00-\x7F]))*\x22)))*@(?:(?:(?!.*[^.]{64,})(?:(?:(?:xn--)?[a-z0-9]+(?:-[a-z0-9]+)*\.){1,126}){1,}(?:(?:[a-z][a-z0-9]*)|(?:(?:xn--)[a-z0-9]+))(?:-[a-z0-9]+)*)|(?:\[(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7})|(?:(?!(?:.*[a-f0-9][:\]]){7,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?)))|(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){5}:)|(?:(?!(?:.*[a-f0-9]:){5,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3}:)?)))?(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))(?:\.(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))){3}))\]))$/;
	if ($('#email').val() && re.test($('#email').val())) {
		return true;
	} else {
		errorText += "Il campo email non è valido. \n";
		return false;
	}
}

function cleanInfo() {
	$('#nome').val(undefined);
	$('#cognome').val(undefined);
	$('#email').val(undefined);
	$('#oggetto').val(undefined);
	$('#messaggio').val(undefined);
}

function errorMessage() {
	alert("Impossibile inviare la richiesta");
}