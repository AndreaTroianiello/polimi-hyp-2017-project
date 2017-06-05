var doctorapi = "/doctors/";
var serviceapi = "/services/";

$(document).ready(function () {
    getDoctors();
});


function getDoctors() {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: doctorapi,
        success: function (response) {
            parseDoctors(response);
        },
        error: function (request, error) {
            $('#doctorsList').append("<div class='col-xs-12 text-center'><p>Impossibile ottenere le informazioni richieste.</p></div>");
        }
    });
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

        setServiceName($('#doctorsList p:last'), doctor.operates);
    }
}


function addLetterToList(letter) {
    $('#doctorsList').append(
        "<div class='col-xs-12'><h4 class='list-index'>" + letter.toUpperCase() + "</h4></div>"
    );
}


function addDoctorToList(doctor) {
    $('#doctorsList').append(
        "<a href='doctor.html?id=" + doctor.id + "' class='list-doc'><div class='col-xs-12 col-sm-6'><div class='row'><div class='col-xs-4 col-sm-3'><img class='img-responsive list-img center-block' src='" + doctor.img + "' alt='" + doctor.surname + "'></div><div class='col-xs-8 col-sm-9'><h3>" + doctor.surname + " " + doctor.name + "</h3><p></p></div></div></div></a>"
    );
}


function setServiceName(p, operates) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: serviceapi + operates,
        success: function (response) {
            $(p).text(response.name);
        },
        error: function (request, error) {
            $(p).text("Servizio " + operates);
        }
    });
}