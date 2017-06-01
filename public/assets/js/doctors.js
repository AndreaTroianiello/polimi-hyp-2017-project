var server = "../"
var api = "doctors/";
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
                    "<div class='col-xs-4 col-sm-2'><img src='../assets/img/doc-"+i+".jpg' class='img-responsive list-img center-block'/></div><div class='col-xs-8 col-sm-4 list-doc'><h3>" + capitalizeFirstLetter(doc.surname) + " " + capitalizeFirstLetter(doc.name) + "</h3><p>"+doc.role+"</p></div>"
                );
            }
        },
        error: function(request,error) { 
            $('#doctorsList').append("<div class='col-xs-12 text-center'><p>Impossibile ottenere le informazioni richieste, riprovare più tardi.</p></div>");   
        }
    });

    function capitalizeFirstLetter(temp) {
        return temp.charAt(0).toUpperCase() + temp.slice(1);
    }

});