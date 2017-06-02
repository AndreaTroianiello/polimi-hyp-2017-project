$(document).ready(function () {
	console.log("I'm ready");
	$.ajax({
		method: "GET",
		dataType: "json",
		crossDomain: true,
		url: "../locations/"+URL.id,
		success: function (response) {
			updateServices(response);
		},
		error: function (request, error) {
			console.log(request + ":" + error);
			cleanServices();
			errorMessage();
		}
	});
	$('#location').attr("href","./location.html?id="+URL.id);
});

function clearServices() {
	$('#services-info').empty();
	console.log("list cleaned");
}

function updateServices(location) {
	$('#services-info').append('<ul class="list-group services-list"></ul>');
	console.log(location);
	for (var i = 0; i < location.services.length; i++) {
		addService(location.services[i]);
	}
}

function addService(id){
	$.ajax({
		method: "GET",
		dataType: "json",
		crossDomain: true,
		url: "../services/"+id,
		success: function (response) {
			$('#services-info').append('<a class="list-group-item" href="./service.html?id=' + response.id + '">' + response.name + '</a>');
		},
		error: function (request, error) {
			console.log(request + ":" + error);
			cleanServices();
			errorMessage();
		}
	});
}

function errorMessage(){
	$('#services-info').append('<h3 class="error">Impossibile caricare la lista.</h3>');
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