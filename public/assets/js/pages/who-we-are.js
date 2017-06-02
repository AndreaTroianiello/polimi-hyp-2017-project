$(document).ready(function () {
	console.log("I'm ready");
	$.ajax({
		method: "GET",
		dataType: "json",
		crossDomain: true,
		url: "../aboutus",
		success: function (response) {
			console.log(response);
			updateInfo(response);
		},
		error: function (request, error) {
			console.log(request + ":" + error);
			$('#aboutus-info').empty();
			errorMessage();
		}
	});
});

function updateInfo(info) {
	$('#accordion').empty();
	for(var i=0;i<info.length;++i){
		$('#accordion').append('<div class="panel panel-default"><h4 class="panel-title"><a class="accordion-toggle list-group-item" data-toggle="collapse" data-parent="#accordion" href="#'+i+'">'+info[i].tag+'</a></h4><div id="'+i+'"class="panel-collapse collapse"><div class="panel-body"><p>'+info[i].infomation+'</p></div></div></div>');
	}
}

function errorMessage() {
	$('#aboutus-info').append('<h3 class="error">Impossibile le informazioni.</h3>');
}