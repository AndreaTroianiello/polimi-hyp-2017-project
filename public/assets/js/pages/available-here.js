var serverapilocation = "/locations/";
var serverapiservice = "/services/";
$(document).ready(function () {
	if(URL.id == null){
		URL.id = 0;
	}
	setLocationLinks(URL.id);
	setLocationText(URL.id);
	getLocations();
	$('#services-info').click(".service-item",function (){
		setSideMenu();
	});
});

function setLocationLinks(id){
	$('.location').attr("href","./location.html?id="+URL.id);
}

function setLocationText(id) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: serverapilocation + id,
        success: function (response) {
            $('#side-location').text(response.name);
            $('title').text("Servizi di "+response.name);
            $('#pagetitle').text("Servizi presenti nella "+response.name);
        },
        error: function (request, error) {
            console.log(request + ":" + error);
			cleanServices();
			errorMessage();
        }
    });
}

function getLocations(){
	$.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: serverapiservice,
        data: {
            "filter": "location",
            "value": URL.id
        },
        success: function (response) {
            $('#services-info').append('<ul class="list-group services-list"></ul>');
			updateServices(response);
        },
        error: function (request, error) {
        	console.log(request + ":" + error);
			cleanServices();
			errorMessage();
        }
    });
}

function clearServices() {
	$('#services-info').empty();
}

function updateServices(services) {
	for (var i = 0; i < services.length; i++) {
		addService(services[i]);
	}
}

function addService(service) {
	$('#services-info').append('<a class="list-group-item service-item" href="./service.html?id=' + service.id + '">' + service.name + '</a>');
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

function setSideMenu() {
    window.sessionStorage.setItem("label", $('title').text());
    window.sessionStorage.setItem("url", window.location.href);
}