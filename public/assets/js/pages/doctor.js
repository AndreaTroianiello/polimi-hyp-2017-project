var serverapi = "/doctors/";
var serverapiservice = "/services/";
var serverapiarea = "/areas/";
var thisPage= "doctor.html";
var next;
var previous;
var previous_url;
var previous_label;

$(document).ready(function () {

    getSideMenu();


    if (URL.id == null) {
        URL.id = 0;
    }

    var currUrl = "./curriculum.html?id=" + URL.id;
     if(URL.filter != null){
        currUrl+="&filter="+URL.filter+"&value="+URL.value;
    }
    $('#curriculum').attr("href", currUrl);
    
    getDoctor(URL.id);


    $(".next").click(function () {
        URL.id= next;
        getDoctor(next);
    });

    $(".previous").click(function () {
        URL.id=previous;
        getDoctor(previous);
    });

    $('#curriculum').click(function(){
        setSideMenu();
    });

});

/* ==========================
    The following are methods used 
===========================*/

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


function getDoctor(id) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: serverapi + id,
        success: function (response) {
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

            var op = "<a href='./service.html?id=" + response.operates + "'></a>";
            $('#operates').html(op);
            getServiceName($('#operates a:first'),response.operates);

            if (response.manages_a !== null) {
                m_a = "<a href='./area.html?id=" + response.manages_a + "'></a>";
                $('#manages_a').html(m_a);
                getServiceName($('#manages_a a:first'),response.manages_a);
            }else{
                $('#manages_a').html("-");
            }

            if (response.manages_s !== null) {
                m_s = "<a href='./service.html?id=" + response.manages_s + "'></a>";
                $('#manages_s').html(m_s);
                getServiceName($('#manages_s a:first'),response.manages_s);
            }else{
                $('#manages_s').html("-");
            }
            

            setNext(id);
            setPrevious(id);
            fixURL(URL);
        },
        error: function (request, error) {
        }
    });
}

function capitalizeFirstLetter(temp) {
    return temp.charAt(0).toUpperCase() + temp.slice(1);
}

function getDoctorName(obj) {
    return "Dr." + (obj.male ? " " : "ssa ") + obj.surname + " " + obj.name;
}

function getServiceName(a,id) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: serverapiservice + id,
        success: function (response) {
            $(a).text(response.name);
        },
        error: function (request, error) {
            $(a).text("Servizio "+ id);
        }
    });
}


function getAreaName(a,id) {
    $.ajax({
        method: "GET",
        dataType: "json",
        crossDomain: true,
        url: serverapiarea + id,
        success: function (response) {
            $(a).text(response.name);
        },
        error: function (request, error) {
            $(a).text("Area "+ id);
        }
    });
}

function fixURL(URL){
    fixString = "/pages/doctor.html?id="+URL.id;
    if(URL.filter != null){
        fixString+="&filter="+URL.filter+"&value="+URL.value;
    }
    window.history.pushState("Dottore","Dottore",fixString);
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

function getSideMenu(){
    previous_label = window.sessionStorage.getItem("label");
    previous_url = window.sessionStorage.getItem("url");
    if(previous_label!==null){
        $('#sidemenu').append("<a href='"+previous_url+"' class='list-group-item'>"+previous_label+"</a>");
    }
    window.sessionStorage.clear();
}

function setSideMenu(){
    if(previous_label!==null){
        window.sessionStorage.setItem("label",previous_label);
        window.sessionStorage.setItem("url", previous_url);
    }
}
