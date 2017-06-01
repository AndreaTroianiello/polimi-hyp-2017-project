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
                    "<a href='doctor.html?id="+doc.id+"' class='list-doc'><div class='col-xs-12 col-sm-6'><div class='row'><div class='col-xs-4 col-sm-3'><img class='img-responsive list-img center-block' src='"+doc.img+"' alt='"+doc.surname+"'></div><div class='col-xs-8 col-sm-9'><h3>"+doc.surname+" "+doc.name+"</h3><p></p></div></div></div></a>" 
                );
                var p = $('#doctorsList p:last');
                getServiceName(p,doc.operates);
            }
        },
        error: function(request,error) { 
            $('#doctorsList').append("<div class='col-xs-12 text-center'><p>Impossibile ottenere le informazioni richieste, riprovare più tardi.</p></div>");   
        }
    });


});

function getServiceName(p, operates){
   $(p).text("Servizio "+operates);
}