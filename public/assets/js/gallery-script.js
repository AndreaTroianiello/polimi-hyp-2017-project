$(document).ready(function () {
	console.log("I'm ready");
	init();
	$.ajax({
		method: "GET",
		dataType: "json",
		crossDomain: true,
		url: "../locations/" + URL.id,
		success: function (response) {
			console.log(response);
			updatePage(response);
			updateImages(response);
		},
		error: function (request, error) {
			console.log(request + ":" + error);
			$('#galley-info').empty();
			errorMessage();
		}
	});
});

function updateImages(response) {
	var x = "active item";
	$('.carousel-inner').empty();
	for (var i = 0; i < response.images.length; ++i) {
		if (i != 0)
			x = "item";
		$('.carousel-inner').append('<div class="' + x + '" data-slide-number="' + i + '"><img src="../assets/img/locations/' + response.images[i] + '"></div>');
	}
}

function updatePage(location) {
	$('title').text(location.name);
	$('.location').attr("href", "./location.html?id=" + URL.id);
	$('.directions').attr("href", "./directions.html?id=" + URL.id);
}

function init() {
	$('.dynamic').hide(true);
}

function errorMessage() {
	$('#gallery-info').append('<h3 class="error">Impossibile la gallery.</h3>');
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