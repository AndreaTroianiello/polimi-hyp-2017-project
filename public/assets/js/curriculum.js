var previous;
var next;
var serverapi = "http://localhost:5000/doctors/";
var previous_url;
var previous_label;

$(document).ready(function () {
    getSideMenu();
    if (URL.id == null) {
        URL.id = 0;
    }
    var docUrl = "./doctor.html?id=" + URL.id;
    if (URL.filter != null) {
        docUrl += "&filter=" + URL.filter + "&value=" + URL.value;
    }
    $('#doctor').attr("href", docUrl);
    $('#doctor-breadcrumb').attr("href", docUrl);
    
    getCV(URL.id);

    $('#doctor').click(function () {
        setSideMenu();
    });

     $(".next").click(function () {
        URL.id= next;
        getCV(next);
    });

    $(".previous").click(function () {
        URL.id=previous;
        getCV(previous);
    });

});


function getSideMenu() {
    previous_label = window.sessionStorage.getItem("label");
    previous_url = window.sessionStorage.getItem("url");
    if (previous_label !== null) {
        $('#sidemenu').append("<a href='" + previous_url + "' class='list-group-item'>Torna a " + previous_label + "</a>");
    }
    window.sessionStorage.clear();
}

function setSideMenu() {
    if (previous_label !== null) {
        window.sessionStorage.setItem("label", previous_label);
        window.sessionStorage.setItem("url", previous_url);
    }
}

function getCV(id) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: serverapi + id + "/curriculum",
        success: function (response) {
            $('#cvcontent').html(response.cv);
            getDoctor(id);

            setNext(id);
            setPrevious(id);
            fixURL(URL);
        },
        error: function (request, error) {
        }
    });
}

function getDoctor(id) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: serverapi + id,
        success: function (response) {
            $('title').text("CV "+response.surname+ " "+response.name);
            $('#title-doc-name').text("Curriculum "+response.surname+ " "+response.name);
        },
        error: function (request, error) {
        }
    });
}

function fixURL(URL) {
    fixString = "/pages/curriculum.html?id=" + URL.id;
    if (URL.filter != null) {
        fixString += "&filter=" + URL.filter + "&value=" + URL.value;
    }
    window.history.pushState("Curriculum", "Curriculum", fixString);
}

function setNext(id) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: serverapi + id + "/next",
        data: {
            "filter": URL.filter,
            "value": URL.value
        },
        success: function (response) {
            next = response.id;
        },
        error: function (request, error) {
        }
    });
}

function setPrevious(id) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: serverapi + id + "/previous",
        data: {
            "filter": URL.filter,
            "value": URL.value
        },
        success: function (response) {
            previous = response.id;
        },
        error: function (request, error) {

        }
    });
}

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