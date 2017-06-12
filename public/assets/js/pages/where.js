var serverapiservice = "/services/";
var serverapilocation = "/locations/";
$(document).ready(function () {
	if(URL.id == null){
		URL.id = 0;
	}
	setServiceLinks(URL.id);
	setLocationText(URL.id);
	getLocations();
	$('#locations').click(".location-item",function (){
		setSideMenu();
	});
});

function setServiceLinks(id){
	$('.service-info').attr("href","./service.html?id="+URL.id);
}

function setLocationText(id) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: serverapiservice + id,
        success: function (response) {
            $('#side-service').text(response.name);
            $('title').text("Strutture di "+response.name);
            $('#pagetitle').text("Strutture in cui è presente "+response.name);
        },
        error: function (request, error) {
			cleanLocations();
			errorMessage();
        }
    });
}

function getLocations(){
	$.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: serverapilocation,
        data: {
            "filter": "service",
            "value": URL.id
        },
        success: function (response) {
			updateLocations(response);
        },
        error: function (request, error) {
			cleanLocations();
			errorMessage();
        }
    });
}

function cleanLocations() {
	$('#locations').empty();
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

function addParagraph(index) {
	$('#locations').append('<h4 class="list-index">' + index + '</h4>');
	$('#locations').append('<ul class="list-group locations-list" id="' + index + '"></ul>');
}

function addLocation(location) {
	$('#locations').append('<a class="list-group-item location-item" href="./location.html?id=' + location.id + '">' + location.name + '</a>');
}

function errorMessage(){
	$('#locations').append('<h3 class="error">Impossibile caricare la lista.</h3>');
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

function setSideMenu() {
    window.sessionStorage.setItem("label", $('title').text());
    window.sessionStorage.setItem("url", window.location.href);
}