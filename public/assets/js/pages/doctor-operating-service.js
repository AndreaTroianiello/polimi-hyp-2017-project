var serverapiservice = "/services/";
var serverapidoctor = "/doctors";

$(document).ready(function () {
    if (URL.id == null) {
        URL.id = 0;
    }
    window.sessionStorage.clear();
    setServiceLinks(URL.id);
    setServiceText(URL.id);
    getDoctors(URL);
});


function setServiceLinks(id) {
    $('#bread-service').attr("href", "./service.html?id=" + id);
    $('#side-service').attr("href", "./service.html?id=" + id);
}

function setServiceText(id) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: serverapiservice + id,
        success: function (response) {
            $('#side-service').text(response.name);
            $('title').text("Dottori "+response.name);
            $('#pagetitle').text("Dottori operanti in "+response.name);
        },
        error: function (request, error) {
            $('#side-service').text("Servizio " + id);
            $('title').text("Dottori servizio " + id);
            $('#pagetitle').text("Dottori operanti in servizio "+ id);
        }
    });
}

function getDoctors(URL) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: serverapidoctor,
        data: {
            "filter": "service",
            "value": URL.id
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
                    "<a href='doctor.html?id=" + doc.id + "&filter=service&value=" + URL.id + "' class='list-doc' onClick='setSideMenu();'><div class='col-xs-12 col-sm-6'><div class='row'><div class='col-xs-4 col-sm-3'><img class='img-responsive list-img center-block' src='" + doc.img + "' alt='" + doc.surname + "'></div><div class='col-xs-8 col-sm-9'><h3>" + doc.surname + " " + doc.name + "</h3><p>"+doc.email+"</p></div></div></div></a>"
                );
            }
        },
        error: function (request, error) {
            $('#doctorsList').append("<div class='col-xs-12 text-center'><p>Impossibile ottenere le informazioni richieste.</p></div>");
        }
    });
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