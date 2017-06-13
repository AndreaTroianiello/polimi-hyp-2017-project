var doctorapi = "/doctors/";
var areaapi = "/areas/";
var serviceapi = "/services/";


$(document).ready(function () {
    getDoctors();
    getAreaName();
    clearSession();
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


function getDoctors() {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: doctorapi,
        data: {
            "filter": "area",
            "value": URL.filter
        },
        success: function (response) {
            parseDoctors(response);
            setClickListener();
        },
        error: function (request, error) {
            setErrorDoctor();
        }
    });
}


function setErrorDoctor() {
    $('#doctorsList').append("<div class='col-xs-12 text-center'><p>Impossibile ottenere le informazioni richieste.</p></div>");
}


function parseDoctors(doctors) {
    var currentInitialLetter;
    for (var i = 0; i < doctors.length; i++) {
        doctor = doctors[i]

        if (doctor.surname.charAt(0) !== currentInitialLetter) {
            currentInitialLetter = doctor.surname.charAt(0);
            addLetterToList(currentInitialLetter);
        }

        addDoctorToList(doctor);
        getServiceName($('#doctorsList p:last'), doctor.operates);
    }
}


function addLetterToList(letter) {
    $('#doctorsList').append(
        "<div class='col-xs-12'><h4 class='list-index'>" + letter.toUpperCase() + "</h4></div>"
    );
}


function addDoctorToList(doctor) {
    $('#doctorsList').append(
        "<a href='doctor.html?id=" + doctor.id + "&filter=area&value=" + URL.filter + "' class='list-doc' ><div class='col-xs-12 col-sm-6'><div class='row'><div class='col-xs-4 col-sm-3'><img class='img-responsive list-img center-block' src='" + doctor.img + "' alt='" + doctor.surname + "'></div><div class='col-xs-8 col-sm-9'><h3>" + doctor.surname + " " + doctor.name + "</h3><p></p></div></div></div></a>"
    );
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
    $('#pagetitle').text("Dottori di " + area.name);
    $('title').text("Dottori di " + area.name);
}


function setErrorArea() {
    $('#pagetitle').text("Dottori dell'area");
    $('title').text("Dottori dell'area");
}


function getServiceName(p, operates) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: serviceapi + operates,
        success: function (response) {
            setServiceName(p,response);
        },
        error: function (request, error) {
            setErrorService(p);
        }
    });
}


function setServiceName(p,service) {
    $(p).text(service.name);
}

function setErrorService(p) {
    $(p).text("Servizio " + operates);
}


function setSessionInfo() {
    window.sessionStorage.setItem("label", $('title').text());
    window.sessionStorage.setItem("url", window.location.href);
}


function setClickListener() {
    $(".list-doc").click(function () {
        setSessionInfo();
    });
}


function clearSession() {
    window.sessionStorage.clear();
}