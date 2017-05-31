var server = "../"
var api = "doctors/";


$(document).ready(function () {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: server + api + URL.id,
        success: function (response) {
            $('#id').text(URL.id);
            $('#curriculum').attr("href","./curriculum.html?id="+URL.id);
            $('title').text(getDoctorName(response));
            $('#title-doc-name').text(getDoctorName(response));
            $('#phone').text(response.phone);
            $('#phone').attr("href", "tel:" + response.phone);
            $('#fax').text(response.fax);
            $('#fax').attr("href", "tel:" + response.fax);
            $('#email').text(response.email);
            $('#email').attr("href", "mailto:" + response.email);
            $('.doc-image').attr("src", response.img);
            $('.doc-info').text(response.desc);
            var op = "<a href='./service.html?id=" + response.operates + "'>" + getServiceName(response.operates) + "</a>";
            $('#operates').html(op);
            var m_a = "-";
            if (response.manages_a !== null) {
                m_a = "<a href='./area.html?id=" + response.manages_a + "'>" + getAreaName(response.manages_a) + "</a>";
            }
            $('#manages_a').html(m_a);
            var m_s = "-";
            if (response.manages_s !== null) {
                m_s = "<a href='./service.html?id=" + response.manages_s + "'>" + getServiceName(response.manages_s) + "</a>";
            }
            $('#manages_s').html(m_s);
        },
        error: function (request, error) {
        }
    });

    function capitalizeFirstLetter(temp) {
        return temp.charAt(0).toUpperCase() + temp.slice(1);
    }

    function getDoctorName(obj) {
        return "Dr." + (obj.male ? " " : "ssa ") + obj.surname + " " + obj.name;
    }

    function getServiceName(id) {
        return "Servizio " + id;
    }
    function getAreaName(id) {
        return "Area " + id;
    }

});

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