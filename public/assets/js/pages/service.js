var serviceapi = "/services/";
var areaapi = "/areas/";
var doctorapi = "/doctors/";

$(document).ready(function () {
    setSideBarURLs(URL);
    addDynamicLink();

    getService(URL);

});

function getService(id) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: serverapiservice + id,
        success: function (response) {
            $('#title-service-name').text(response.name);
            $('title').text(response.name);
            $('#service-desc').html(response.description);
            setArea(response.area);
            setResponsible(response.responsible);
        },
        error: function (request, error) {

        }
    });
}

function setErrorService() {
    $('title').text("Servizio " + id);
    $('#title-service-name').text("Servizio " + id);
    $('#service-desc').html("<p class='text-center'>Impossibile ottenere le informazioni richieste.</p>");
    setArea(response.area);
    setResponsible(response.responsible);
}


function setArea(id) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: serverapiarea + id,
        success: function (response) {
            area = "<a href='./area.html?id=" + id + "' alt='area'>" + response.name + "</a>";
            $('#area').html(area);
        },
        error: function (request, error) {
            area = "<a href='./area.html?id=" + id + "' alt='area'>Area " + id + "</a>";
            $('#area').html(area);
        }
    });
}

function setResponsible(id) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: serverapidoctor + id,
        success: function (response) {
            resp = "<a href='./doctor.html?id=" + id + "'>" + response.surname + " " + response.name + "</a>";
            $('#responsible').html(resp);
        },
        error: function (request, error) {
            resp = "<a href='./doctor.html?id=" + id + "'>Dottor " + id + "</a>";
            $('#responsible').html(respo);
        }
    });
}


function setSideBarURLs(URL) {
    $('#docOpServ').attr("href", "./doctor-operating-service.html?id=" + id);
    $('#where').attr("href", "./where.html?id=" + id);
}


function addDynamicLink() {
    previousLabel = window.sessionStorage.getItem("label");
    previousUrl = window.sessionStorage.getItem("url");
    if (previousLabel !== null) {
        $('#sidemenu').append("<a href='" + previousUrl + "' class='list-group-item'>" + previousLabel + "</a>");
    }
    window.sessionStorage.clear();
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
    if (query_string.id == null) {
        query_string = 1;
    }
    return query_string;
}();