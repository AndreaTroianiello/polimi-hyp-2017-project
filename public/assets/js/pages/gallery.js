$(document).ready(function () {
	console.log("I'm ready");
	$('.slider').slick({
		autoplay:true,
		autoplaySpeed: 4500,
		dots: true,
		arrows: true,
		infinite: true,
		speed: 500,
		fade: true,
		cssEase: 'linear',
		slidesToShow: 1,
		slidesToScroll: 1
	});
	$.ajax({
		method: "GET",
		dataType: "json",
		crossDomain: true,
		url: "../locations/" + URL.id + "/images",
		success: function (response) {
			console.log(response);
			init(response);
			updateImages(response);
		},
		error: function (request, error) {
			console.log(request + ":" + error);
			$('#galley-info').empty();
			errorMessage();
		}
	});
	$('.other-page').click(function () {
		setSideMenu();
	});
});

function updateImages(response) {
	for (var i = 0; i < response.length; ++i)
		$('.slider').slick('slickAdd', '<div class="slide" id="' + i + '"><img src="' + response[i].path + '"></div>');
}

function init(location) {
	$('title').text(location[0].name);
	$('.location').attr("href", "./location.html?id=" + URL.id);
	$('.directions').attr("href", "./directions.html?id=" + URL.id);
	getSideMenu();
}

function errorMessage() {
	$('#gallery-info').append('<h3 class="error">Impossibile la gallery.</h3>');
}

function getSideMenu() {
	previous_label = window.sessionStorage.getItem("label");
	previous_url = window.sessionStorage.getItem("url");
	if (previous_label !== null) {
		$('#sidemenu').append("<a href='" + previous_url + "' class='list-group-item'>" + previous_label + "</a>");
	}
	window.sessionStorage.clear();
}

function setSideMenu() {
	if (previous_label !== null) {
		window.sessionStorage.setItem("label", previous_label);
		window.sessionStorage.setItem("url", previous_url);
	}
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