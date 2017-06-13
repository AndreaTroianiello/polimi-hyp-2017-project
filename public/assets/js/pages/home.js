$(document).ready(function () {
	$.ajax({
		method: "GET",
		dataType: "json",
		crossDomain: true,
		url: "./home",
		success: function (response) {
			parseHome(response);
		},
		error: function (request, error) {
			setErrorHome();
		}
	});
	$('.slider').slick({
		autoplay: true,
		autoplaySpeed: 4500,
		dots: true,
		arrows: false,
		infinite: true,
		speed: 500,
		fade: true,
		cssEase: 'linear'
	});
	
});

function parseHome(home) {
	parseSlider(home.slider);
	parseDivs(home.divs);
}

function parseSlider(slider) {
	for (var i = 0; i < slider.length; ++i)
		$(".slider").slick('slickAdd','<div class="slide"><img src="' + slider[i].path + '"></div>');
}

function parseDivs(divs) {
	var nAvailable = 12;
	if (divs.length > 12 || divs.length < 1)
		nAvailable = 0;
	for (var i = 0; nAvailable > 0; ++i) {
		$('#home-info').append('<div class="col-xs-12 col-sm-' + parseInt(12 / divs.length) + ' "><h2 class="section-title">' + divs[i].title + '</h2><span class="fa-stack fa-2x icon-home"><i class="fa fa-circle fa-stack-2x icon1"></i><i class="fa ' + divs[i].icon + ' fa-stack-1x text-primary icon2"></i></span><p class="p-home">' + divs[i].paragraph + '</p><a class="btn btn-default btn-lg home-button" href="'+divs[i].path+'">' + divs[i].buttontext + '</a></div>');
		nAvailable -= parseInt(12 / divs.length);
	}
}

function setErrorHome(){
	$('section').empty();
	$('#principal').append('<div class="col-xs-12 text-center"><p>Impossibile ottenere le informazioni richieste.</p></div>');
}