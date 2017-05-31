//Call the packages
const express = require("express");
const app = express();
const bodyParser = require("body-parser"); 
const _ = require("lodash");

let doctorsList = require("./other/doctors.json");

let doctor;

app.use(express.static(__dirname + "/public"));

//Allow to get data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Set the server's port
let serverPort = process.env.PORT || 5000;
app.set("port", serverPort); 

// RESTful APIs

//Doctors APIs
app.get("/doctors", function(req, res) {
	res.json(getDoctors());
});

app.get("/doctors/:doctor_id", function(req, res) {
	let answer = getDoctor(req.params.doctor_id)
	if(answer == null){
		answer = {error: "Invalid doctor ID"};
	} 
  	res.json(answer);
});

//Location APIs

//Start the server on port 5000
app.listen(serverPort, function() {
  console.log(`Your app is ready at port ${serverPort}`);
});


// Doctors functions yet to be implemented with SQLite

function getDoctors(){
	return doctorsList;
}

function getDoctor(id){
	return doctorsList[id];
}

// Location functions

let locationsList = require("./other/locations.json");

app.get("/locations", function(req, res) {
	res.json(getLocations());
});

app.get("/locations/:location_id", function(req, res) {
	let answer = getLocation(req.params.location_id);
	if(answer == null){
		answer = {error: "Invalid doctor ID"};
	} 
  	res.json(answer);
});

function getLocations(){
	return locationsList;
}

function getLocation(id){
	return locationsList[id];
}