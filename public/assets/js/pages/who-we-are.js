$(document).ready(function () {
	$.ajax({
		method: "GET",
		dataType: "json",
		crossDomain: true,
		url: "../aboutus",
		success: function (response) {
			updateInfo(response);
		},
		error: function (request, error) {
			errorMessage();
		}
	});
});

function updateInfo(info) {
	for(var i=0;i<info.length;++i){
		$('#aboutus-info').append('<div class="panel panel-default"><h4 class="panel-title"><a class="accordion-toggle list-group-item" data-toggle="collapse" data-parent="#accordion" href="#'+i+'">'+info[i].tag+'</a></h4><div id="'+i+'"class="panel-collapse collapse"><div class="panel-body"><p class="text-justify">'+info[i].information+'</p></div></div></div>');
	}
}

function errorMessage() {
	$('#aboutus-info').append("<div class='col-xs-12 text-center'><p>Impossibile ottenere le informazioni richieste.</p></div>");
}