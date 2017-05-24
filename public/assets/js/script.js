var id = 0;
$(document).ready(function(){
    startUp();
    console.log("I'm ready");  
       
    $(".prevDoctor").on("click",prevDoctor);
	$(".nextDoctor").on("click",nextDoctor);
    
});

function clearDoctor() {
	$('.infoDoctor').text("");
}

function addDoctor(doctor) {
  	id=doctor.id;
  	console.log("New doctor!");
  	$('#id').text(doctor.id);
  	$('#name').text(doctor.name);
  	$('#surname').text(doctor.surname);
  	$('#telephone').text(doctor.telephone);
  	$('#fax').text(doctor.fax);
	$('#role').text(doctor.role);
}

function nextDoctor() {
  id++;
  updateDoctor();
}

function prevDoctor() {
  id--;
  updateDoctor();
}

function updateDoctor() {
  fetch(`/doctor?id=${id}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      clearDoctor();
      addDoctor(data);
    });
}

function startUp() {
  updateDoctor();
}