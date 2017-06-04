var doctorapi = "/doctors/";
var nextDoctor;
var previousDoctor;
var previousUrl;
var previousLabel;

$(document).ready(function () {

    addDynamicLink();
    cvLoaders(URL);

    /* The following are events */

    $('#doctor').click(function () {
        setSideMenu();
    });

    $(".next").click(function () {
        URL.id = next;
        cvLoaders(URL);
    });

    $(".previous").click(function () {
        URL.id = previous;
        cvLoaders(URL);
    });

});

function cvLoaders(URL) {
    setDoctorURL(URL);
    getDoctor(URL);
    getCV(URL);
    setNext(URL);
    setPrevious(URL);
    fixURL(URL);
}


function getCV(URL) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: doctorapi + URL.id + "/curriculum",
        success: function (response) {
            setCV(response);
        },
        error: function (request, error) {
        }
    });
}


function setCV(cv) {
    $('#cvcontent').html(cv.desc);
    $('#cvcontent').addClass("text-justify");
}


function getDoctor(URL) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: doctorapi + URL.id,
        success: function (response) {
            setDoctor(response);
        },
        error: function (request, error) {
            $('title').text("Errore - Impossibile caricare informazioni richieste.");
            $('#title-doc-name').text("Errore - Impossibile caricare informazioni.");
        }
    });
}


function setDoctor(doctor) {
    $('title').text("CV " + doctor.surname + " " + doctor.name);
    $('#title-doc-name').text("Curriculum " + doctor.surname + " " + doctor.name);
}


function addDynamicLink() {
    previousLabel = window.sessionStorage.getItem("label");
    previousUrl = window.sessionStorage.getItem("url");

    if (previousLabel !== null) {
        $('#sidemenu').append("<a href='" + previousUrl + "' class='list-group-item'>" + previousLabel + "</a>");
    }

    window.sessionStorage.clear();
}


function setSessionInfo() {
    if (previousLabel !== null) {
        window.sessionStorage.setItem("label", previousLabel);
        window.sessionStorage.setItem("url", previousUrl);
    }
}


function fixURL(URL) {
    fixString = "/pages/curriculum.html?id=" + URL.id;
    if (URL.filter != null) {
        fixString += "&filter=" + URL.filter + "&value=" + URL.value;
    }
    window.history.pushState("Curriculum", "Curriculum", fixString);
}


function setDoctorURL(URL) {
    var doctor = "./doctor.html?id=" + URL.id;
    if (URL.filter != null) {
        doctor += "&filter=" + URL.filter + "&value=" + URL.value;
    }
    $('#doctor').attr("href", doctor);
    $('#doctor-breadcrumb').attr("href", doctor);
}


function setNext(URL) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: doctorapi + URL.id + "/next",
        data: {
            "filter": URL.filter,
            "value": URL.value
        },
        success: function (response) {
            next = response.id;
        },
        error: function (request, error) {
            $(".next").hide();
        }
    });
}


function setPrevious(URL) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: doctorapi + URL.id + "/previous",
        data: {
            "filter": URL.filter,
            "value": URL.value
        },
        success: function (response) {
            previous = response.id;
        },
        error: function (request, error) {
            $(".previous").hide();
        }
    });
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
        query_string.id = 1;
    }
    return query_string;
}();