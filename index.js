//Call the packages
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const _ = require("lodash");

let doctorsList = require("./other/doctors.json");
let curriculums = require("./other/curriculums.json");
let areas = require("./other/areas.json");
let services = require("./other/services.json");

app.use(express.static(__dirname + "/public"));

//Allow to get data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Set the server's port
let serverPort = process.env.PORT || 5000;
app.set("port", serverPort);

//Start the server on port 5000
app.listen(serverPort, function () {
	console.log(`Your app is ready at port ${serverPort}`);
});


/* =========================================================
============================================================
	RESTful APIs
============================================================
========================================================== */



/* =========================================================
 Doctors APIs
========================================================== */

app.get("/doctors", function (req, res) {
	let filter = _.get(req, "query.filter", null);
	let value = _.get(req, "query.value", null);
	res.json(getDoctors(filter, value));
});

app.get("/doctors/:doctor_id", function (req, res) {
	let answer = getDoctor(req.params.doctor_id);
	if (answer == null) {
		answer = { error: "Invalid doctor ID" };
	}
	res.json(answer);
});

app.get("/doctors/:doctor_id/next", function (req, res) {
	let answer;
	let filter = _.get(req, "query.filter", null);
	let value = _.get(req, "query.value", null);
	let docs = getDoctors(filter, value);
	let curr_doc = _.findIndex(docs, function (d) { return d.id == req.params.doctor_id; });
	if(curr_doc===-1){
		answer = { error: "No doctor found for the given parameters." };
	}else{
		answer = docs[(curr_doc + 1) % docs.length];
	}
	res.json(answer);
});

app.get("/doctors/:doctor_id/previous", function (req, res) {
	let answer;
	let filter = _.get(req, "query.filter", null);
	let value = _.get(req, "query.value", null);
	let docs = getDoctors(filter, value);
	let curr_doc = _.findIndex(docs, function (d) { return d.id == req.params.doctor_id; });
	if(curr_doc===-1){
		answer = { error: "No doctor found for the given parameters." };
	}else{
		answer = docs[(curr_doc + docs.length - 1) % docs.length];
	}
	res.json(answer);
});

app.get("/doctors/:doctor_id/curriculum", function (req, res) {
	let answer = getCurriculum(req.params.doctor_id);
	if (answer == null) {
		answer = { error: "Invalid doctor ID" };
	}
	res.json(answer);
});

/* =========================================================
 Services APIs
========================================================== */

app.get("/services", function (req, res) {
	let filter = _.get(req, "query.filter", null);
	let value = _.get(req, "query.value", null);
	res.json(getServices(filter, value));
});

app.get("/services/:service_id", function (req, res) {
	let answer = getService(req.params.service_id);
	if (answer == null) {
		answer = { error: "Invalid service ID" };
	}
	res.json(answer);
});


/* =========================================================
 Areas APIs
========================================================== */

app.get("/areas", function (req, res) {
	let filter = _.get(req, "query.filter", null);
	let value = _.get(req, "query.value", null);
	res.json(getAreas(filter, value));
});

app.get("/areas/:area_id", function (req, res) {
	let answer = getArea(req.params.area_id);
	if (answer == null) {
		answer = { error: "Invalid area ID" };
	}
	res.json(answer);
});

/* =========================================================
 Doctors functions yet to be implemented with SQLite
========================================================== */

function getDoctors(filter, value) {
	doctors = _.toArray(doctorsList);
	if (filter === "location") {
		doctors= doctors.slice(4, 6);
	}

	return doctors.sort(docSort);
}

function getDoctor(id) {
	docIndex = _.findIndex(doctorsList, function(d){
		return id == d.id;
	})
	return doctorsList[docIndex];
}

function getCurriculum(id){
	return curriculums[_.findIndex(curriculums, function(c){
		return id == c.doctor;
	})];
}


/* =========================================================
 Services functions yet to be implemented with SQLite
========================================================== */
	function getServices(filter, value) {
	servicesList = _.toArray(services);
	if (filter === "location") {
		servicesList= servicesList.slice(1, 2);
	}

	return servicesList.sort(genSort);
}

function getService(id) {
	serIndex = _.findIndex(services, function(s){
		return id == s.id;
	})
	return services[serIndex];
}

/* =========================================================
 Areas functions yet to be implemented with SQLite
========================================================== */

function getAreas(filter, value) {
	areasList = _.toArray(areas);
	if (filter === "location") {
		areasList= areasList.slice(0, 1);
	}

	return areasList.sort(genSort);
}

function getArea(id) {
	areaIndex = _.findIndex(areas, function(a){
		return id == a.id;
	})
	return areas[areaIndex];
}
/* =========================================================
 Location APIs
========================================================== */

let locationsList = require("./other/locations.json");

app.get("/locations", function (req, res) {
	res.json(getLocations());
});

app.get("/locations/:location_id", function (req, res) {
	let answer = getLocation(req.params.location_id);
	if (answer == null) {
		answer = { error: "Invalid doctor ID" };
	}
	res.json(answer);
});

// Location functions

function getLocations() {
	return locationsList;
}

function getLocation(id) {
	return locationsList[id];
}


/* ===================
	Utility functions
====================*/

function docSort(a,b){
	a_full= (a.surname+" "+a.name).toLowerCase();
	b_full= (b.surname+" "+b.name).toLowerCase();

	if(a_full<b_full){
		return -1;
	}else if(a_full>b_full){
		return 1;
	}
	return 0;
}

function genSort(a,b){
	a_full= a.name.toLowerCase();
	b_full= b.name.toLowerCase();

	if(a_full<b_full){
		return -1;
	}else if(a_full>b_full){
		return 1;
	}
	return 0;
}