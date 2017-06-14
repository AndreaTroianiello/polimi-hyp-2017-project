var areaapi = "/areas/";
var serviceapi = "/services/";


$(document).ready(function () {
    getServices();
    getAreaName();
	clearSession();
});

function getServices() {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: serviceapi,
        data: {
            "filter": "area",
            "value": URL.filter,
			"sort": "name"
        },
        success: function (response) {
            parseServices(response);
        },
        error: function (request, error) {
            errorMessage();
        }
    });
}

function parseServices(services) {
    var currentInitialLetter;
    for (var i = 0; i < services.length; i++) {
        service = services[i];
        if (service.name.charAt(0) !== currentInitialLetter) {
            currentInitialLetter = service.name.charAt(0);
            addLetterToList(currentInitialLetter);
        }
        addServiceToList(service);
    }
}

function addLetterToList(letter) {
	$('#servicesList').append('<h4 class="list-index">' + letter + '</h4>');
    $('#servicesList').append('<div class="list-group services-list" id="' + letter + '"></div>');
}

function addServiceToList(service) {
    $('#'+ service.name.charAt(0)).append('<a class="list-group-item" href="../pages/service.html?id=' + service.id + '">' + service.name + '</a>');
}

function getAreaName() {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: areaapi + URL.filter,
        success: function (response) {
            setAreaName(response);
        },
        error: function (request, error) {
            setErrorArea();
        }
    });
}

function setAreaName(area) {
    $('#pagetitle').text("Servizi di " + area.name);
    $('title').text("Servizi di " + area.name);
}

function setErrorArea() {
    $('#pagetitle').text("Servizi dell'area");
    $('title').text("Servizi dell'area");
}

function errorMessage() {
    $('#servicesList').append("<div class='col-xs-12 text-center'><p>Impossibile ottenere le informazioni richieste.</p></div>");
}

var URL = function () {
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
    if (query_string.filter == null) {
        query_string.filter = 1;
    }
    return query_string;
}();