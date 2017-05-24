//Call the packages
const express = require("express");
const app = express();
const bodyParser = require("body-parser"); 
const _ = require("lodash");

let doctorsList = require("./other/doctor.json");

let doctor;

app.use(express.static(__dirname + "/public"));

//Allow to get data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Set the server's port
let serverPort = process.env.PORT || 5000;
app.set("port", serverPort); 


app.get("/doctor", function(req, res) {
	let idn = parseInt(_.get(req, "query.id", 0));
	if(idn>=0 && idn<doctorsList.length)
  		doctor=_.find(doctorsList, [ 'id' , idn ]);
  	res.send(JSON.stringify(doctor));
});

//Start the server on port 5000
app.listen(serverPort, function() {
  console.log(`Your app is ready at port ${serverPort}`);
});
