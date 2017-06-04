var doctorapi = "/doctors/";
var locationapi = "/locations/";
var serviceapi = "/services/";

$(document).ready(function () {

    window.sessionStorage.clear();
    getDoctors(URL);
    getLocationName(URL.filter);
});


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





function getDoctors(URL) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: serverapidoctor,
        data: {
            "filter": "location",
            "value": URL.filter
        },
        success: function (response) {
            var currentInitial;
            for (var i = 0; i < response.length; i++) {
                doc = response[i]
                if (doc.surname.substring(0, 1) !== currentInitial) {
                    currentInitial = doc.surname.charAt(0);
                    $('#doctorsList').append(
                        "<div class='col-xs-12'><h4 class='list-index'>" + currentInitial.toUpperCase() + "</h4></div>"
                    );
                }
                $('#doctorsList').append(
                    "<a href='doctor.html?id=" + doc.id + "&filter=location&value=" + URL.filter + "' class='list-doc' onClick='setSideMenu();'><div class='col-xs-12 col-sm-6'><div class='row'><div class='col-xs-4 col-sm-3'><img class='img-responsive list-img center-block' src='" + doc.img + "' alt='" + doc.surname + "'></div><div class='col-xs-8 col-sm-9'><h3>" + doc.surname + " " + doc.name + "</h3><p></p></div></div></div></a>"
                );
                var p = $('#doctorsList p:last');
                getServiceName(p, doc.operates);
            }
        },
        error: function (request, error) {
            $('#doctorsList').append("<div class='col-xs-12 text-center'><p>Impossibile ottenere le informazioni richieste.</p></div>");
        }
    });
}

function getLocationName(id) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: serverapilocation + id,
        success: function (response) {
            $('#pagetitle').text("Dottori di " + response.name);
            $('title').text("Dottori di " + response.name);
        },
        error: function (request, error) {
            $('#pagetitle').text("Dottori della struttura");
            $('title').text("Dottori della struttura");
        }
    });
}

function getServiceName(p, operates) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: serverapiservice + operates,
        success: function (response) {
            $(p).text(response.name);
        },
        error: function (request, error) {
            $(p).text("Servizio " + operates);
        }
    });
}



function setSessionInfo() {
    window.sessionStorage.setItem("label", $('title').text());
    window.sessionStorage.setItem("url", window.location.href);
}