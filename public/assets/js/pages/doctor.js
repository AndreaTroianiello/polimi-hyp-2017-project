var doctorapi = "/doctors/";
var serviceapi = "/services/";
var areaapi = "/areas/";
var nextDoctor;
var previousDoctor;
var previousUrl;
var previousLabel;

$(document).ready(function () {
    addDynamicLink();
    doctorLoaders();

    /* the following are events */

    $(".next").click(function () {
        URL.id = nextDoctor;
        doctorLoaders();
    });

    $(".previous").click(function () {
        URL.id = previousDoctor;
        doctorLoaders();
    });

    $('#curriculum').click(function () {
        setSessionInfo();
    });
});

function doctorLoaders() {
    setCurriculumURL();
    getDoctor();
    setNext();
    setPrevious();
    fixURL();
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


function getDoctor() {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: doctorapi + URL.id,
        success: function (response) {
            setDoctorInfo(response);
            setAreaService(response);
        },
        error: function (request, error) {
            $('title').text("Errore - Impossibile caricare le informazioni richieste.");
            $('#title-doc-name').text("Errore - Impossibile caricare le informazioni.");
        }
    });
}


function setDoctorInfo(doctor) {
    $('title').text(getDoctorName(doctor));
    $('#title-doc-name').text(getDoctorName(doctor));
    $('#phone').text(doctor.phone);
    $('#phone').attr("href", "tel:" + doctor.phone);
    $('#fax').text(doctor.fax);
    $('#fax').attr("href", "tel:" + doctor.fax);
    $('#email').text(doctor.email);
    $('#email').attr("href", "mailto:" + doctor.email);
    $('.doc-image').attr("src", doctor.img);
    $('.doc-info').text(doctor.desc);
}


function setAreaService(doctor) {
    var op = "<a href='./service.html?id=" + doctor.operates + "'></a>";
    $('#operates').html(op);
    setServiceName($('#operates a:first'), doctor.operates);

    if (doctor.manages_a !== null) {
        var m_a = "<a href='./area.html?id=" + doctor.manages_a + "'></a>";
        $('#manages_a').html(m_a);
        setAreaName($('#manages_a a:first'), doctor.manages_a);
    } else {
        $('#manages_a').html("-");
    }

    if (doctor.manages_s !== null) {
        var m_s = "<a href='./service.html?id=" + doctor.manages_s + "'></a>";
        $('#manages_s').html(m_s);
        setServiceName($('#manages_s a:first'), doctor.manages_s);
    } else {
        $('#manages_s').html("-");
    }
}


function getDoctorName(doc) {
    return "Dr." + (doc.male ? " " : "ssa ") + doc.surname + " " + doc.name;
}


function setServiceName(a, id) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: serviceapi + id,
        success: function (response) {
            $(a).text(response.name);
        },
        error: function (request, error) {
            $(a).text("Servizio " + id);
        }
    });
}


function setAreaName(a, id) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: areaapi + id,
        success: function (response) {
            $(a).text(response.name);
        },
        error: function (request, error) {
            $(a).text("Area " + id);
        }
    });
}


function fixURL() {
    fixString = "/pages/doctor.html?id=" + URL.id;
    if (URL.filter != null) {
        fixString += "&filter=" + URL.filter + "&value=" + URL.value;
    }
    window.history.pushState("Dottore", "Dottore", fixString);
}


function setNext() {
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
            nextDoctor = response.id;
        },
        error: function (request, error) {
            $(".next").hide();
        }
    });
}


function setPrevious() {
    console.log(doctorapi + URL.id + "/previous");
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
            previousDoctor = response.id;
        },
        error: function (request, error) {
            $(".previous").hide();
        }
    });
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


function setCurriculumURL() {
    var curriculum = "./curriculum.html?id=" + URL.id;
    if (URL.filter != null) {
        curriculum += "&filter=" + URL.filter + "&value=" + URL.value;
    }
    $('#curriculum').attr("href", curriculum);
}
