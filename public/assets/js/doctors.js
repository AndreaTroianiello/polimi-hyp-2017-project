var server = "../"
var api = "doctors/";
var doctors=["fakedoctor.jpg","client-1.jpg", "client-2.jpg", "team-2.jpg","team-3.jpg","team-4.jpg"];
$(document).ready(function () {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: server + api,
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
                    "<div class='col-xs-4 col-sm-2'><img src='../assets/img/"+doctors[i%doctors.length]+"' class='img-responsive list-img center-block'/></div><div class='col-xs-8 col-sm-4 list-doc'><h3>" + capitalizeFirstLetter(doc.surname) + " " + capitalizeFirstLetter(doc.name) + "</h3><p>"+doc.role+"</p></div>"
                );
            }
        }

    });

    function capitalizeFirstLetter(temp) {
        return temp.charAt(0).toUpperCase() + temp.slice(1);
    }
});