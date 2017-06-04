var serviceapi = "/services/";
var areaapi = "/areas/";
var doctorapi = "/doctors/";

$(document).ready(function () {
    setSideBarURLs();
    addDynamicLink();
    getService();

});

function getService() {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: serviceapi + URL.id,
        success: function (response) {
            setService(response);
            getArea(response.area);
            getResponsible(response.responsible);
        },
        error: function (request, error) {
            setErrorService();
        }
    });
}


function setService(service) {
    $('#title-service-name').text(service.name);
    $('title').text(service.name);
    $('#service-desc').html(service.description);
}


function setErrorService() {
    $('title').text("Servizio " + URL.id);
    $('#title-service-name').text("Servizio " + URL.id);
    $('#service-desc').html("<p class='text-center'>Impossibile ottenere le informazioni richieste.</p>");
}


function getArea(id) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: areaapi + id,
        success: function (response) {
            setArea(response);
        },
        error: function (request, error) {
            setAreaError(id);
        }
    });
}

function setArea(area) {
    htmlArea = "<a href='./area.html?id=" + area.id + "' alt='area'>" + area.name + "</a>";
    $('#area').html(htmlArea);
}

function setAreaError(id) {
    areaHtml = "<a href='./area.html?id=" + id + "' alt='area'>Area " + id + "</a>";
    $('#area').html(areaHtml);
}


function getResponsible(id) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: doctorapi + id,
        success: function (response) {
            setResponsible(response);
        },
        error: function (request, error) {
            setResponsibleError(id);
        }
    });
}

function setResponsible(doctor) {
    doctorHtml = "<a href='./doctor.html?id=" + doctor.id + "'>" + doctor.surname + " " + doctor.name + "</a>";
    $('#responsible').html(doctorHtml);
}

function setResponsibleError(id) {
    doctorHtml = "<a href='./doctor.html?id=" + id + "'>Dottor " + id + "</a>";
    $('#responsible').html(doctorHtml);
}


function setSideBarURLs() {
    $('#docOpServ').attr("href", "./doctor-operating-service.html?id=" + URL.id);
    $('#where').attr("href", "./where.html?id=" + URL.id);
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