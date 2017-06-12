const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const process = require("process");
const dbms = require("./other/database.js");
const app = express();
const DEV = process.env.TEST;

//static file directory
app.use(express.static(__dirname + "/public"));

//Allows to get data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

//Set the server's port
let serverPort = process.env.PORT || 5000;
app.set("port", serverPort);
let serverUrl = ["http://localhost:" + serverPort, "https://polimi-hyp-2017-team-10459278.herokuapp.com"];

// get the database
let sqlDb = dbms.getSQLDB(DEV);

//create DB if it doesn't exist
dbms.initDB();

// Start the server 
app.listen(serverPort, function () {
	console.log(`Your app is ready at ${DEV ? serverURL[0] : serverURL[1]}`);
});

/*Converts a relative path to an absolute path
This method is used to generate absolute URI for the RESTful APIs */
function makeURLsAbsolute(path, img) {
	let URL = (DEV ? serverUrl[0] : serverUrl[1]) + (img ? "/assets/img/" : "");
	return URL + path;
}


/* =========================================================
 Doctors APIs
========================================================== */

/* Returns a JSON composed by an array of objects 
Each object is a distinct Doctor and contains all the characteristic parameters.
Filtering is supported, parameters:
- filter: the type of the filter, it can be equal to area|location|service
- value: the ID of an 'object' of the same type specified by the filter parameter 
		(e.g the ID of the service you may want to know which doctors operates in)
Doctor are alphabetically ordered by surname and name.
The function "filterDoctor" is used for filtering */
app.get("/doctors", function (req, res) {
	let query = sqlDb("doctors");
	filterDoctor(req, query);
	query
		.orderBy("surname", "asc").orderBy("name", "asc")
		.then(result => {
			result.map(o => { o.img = makeURLsAbsolute(o.img, true) });
			res.json(result);
		});
});

/* Returns a JSON object that corresponds to the doctor specified by "doctor_id" and all his information.
If the doctor ID is invalid, a JSON object containing an error message is returned. */
app.get("/doctors/:doctor_id", function (req, res) {
	sqlDb("doctors").where("id", req.params.doctor_id).then(result => {
		if (result.length === 0) {
			res.json({
				error: "Invalid doctor ID"
			});
		} else {
			result[0].img = makeURLsAbsolute(result[0].img, true);
			res.json(result[0]);
		}
	});
});

/* Returns a JSON object that corresponds to the following doctor to the one specified by "doctor_id" and all his information.
If the doctor ID is invalid, a JSON object containing an error message is returned.
Eventual filters are supported and they work in the same way as in the doctors API. */
app.get("/doctors/:doctor_id/next", function (req, res) {
	getPrevNext(req, res, true);
});

/* Returns a JSON object that corresponds to the previous doctor to the one specified by "doctor_id" and all his information.
If the doctor ID is invalid, a JSON object containing an error message is returned.
Eventual filters are supported and they work in the same way as in the doctors API. */
app.get("/doctors/:doctor_id/previous", function (req, res) {
	getPrevNext(req, res, false);
});

/* Returns a JSON object that corresponds to the curriculum information of the specified doctor.
If the doctor ID is invalid, a JSON object containing an error message is returned. */
app.get("/doctors/:doctor_id/curriculum", function (req, res) {
	sqlDb("curriculums").where("doctor", req.params.doctor_id).then(result => {
		if (result.length === 0) {
			res.json({
				error: "Invalid doctor ID"
			});
		} else {
			res.json(result[0]);
		}
	});
});

function filterDoctor(req, query) {
	let filter = _.get(req, "query.filter", null);
	let value = _.get(req, "query.value", null);
	if (filter !== null) {
		switch (filter) {
			case "location":
				query
					.select("doctors.*")
					.join("doctorlocation", "doctors.id", "doctor")
					.where("location", value);
				break;
			case "service":
				query.where("operates", value);
				break;
			case "area":
				query
					.select("doctors.*")
					.join("services", "operates", "services.id")
					.where("area", value);
				break;
		}
	}
	return query;
}

function getPrevNext(req, res, next) {
	let query = sqlDb("doctors");
	query = filterDoctor(req, query);
	query.orderBy("surname", "asc").orderBy("name", "asc")
		.then(result => {
			let i = _.findIndex(result, (r) => {
				return req.params.doctor_id == r.id;
			});
			if (i === -1) {
				res.json({
					error: "No doctor found for the given parameters."
				});
			} else {
				let diff = next ? 1 : -1;
				let doc = result[(i + result.length + diff) % result.length];
				doc.img = makeURLsAbsolute(doc.img, true);
				res.json(doc);
			}
		});
}

/* =========================================================
 Services APIs
========================================================== */

/* Returns a JSON composed by an array of objects 
Each object is a distinct Service and contains all the characteristic parameters.
Filtering is supported, parameters:
- filter: the type of the filter, it can be equal to area|location
- value: the ID of an 'object' of the same type specified by the filter parameter 
		(e.g the ID of the area you may want to know which services belong to)
Services are ordered by id. */
app.get("/services", function (req, res) {
	let filter = _.get(req, "query.filter", null);
	let value = _.get(req, "query.value", null);
	let query = sqlDb("services")
		.select("services.*", "doctors.id as responsible")
		.join("doctors", "services.id", "doctors.manages_s");
	if (filter !== null) {
		switch (filter) {
			case "location":
				query
					.join("servicelocation", "services.id", "servicelocation.service")
					.where("servicelocation.location", value);
				break;
			case "area":
				query.where("area", value);
				break;
		}
	}
	query.orderBy("services.id", "asc").then(result => {
		res.json(result);
	});
});

/* Returns a JSON object that corresponds to the service specified by "service_id" and all his information.
If the service ID is invalid, a JSON object containing an error message is returned. */
app.get("/services/:service_id", function (req, res) {
	sqlDb("services")
		.select("services.*", "doctors.id as responsible")
		.join("doctors", "services.id", "doctors.manages_s")
		.where("services.id", req.params.service_id)
		.then(result => {
			if (result.length === 0) {
				res.json({
					error: "Invalid service ID"
				});
			} else {
				res.json(result[0]);
			}
		});
});

/* =========================================================
 Areas APIs
========================================================== */

/* Returns a JSON composed by an array of objects 
Each object is a distinct Area and contains all the characteristic parameters.
Filtering is supported, altough only filter by area is implemented.
Parameters:
- filter: the type of the filter, in this case it can only be equal to area (or null)
- value: the ID of an 'object' of the same type specified by the filter parameter 
		(e.g the ID of the location you may want to know which areas serves)
Areas are ordered by ID.*/
app.get("/areas", function (req, res) {
	let filter = _.get(req, "query.filter", null);
	let value = _.get(req, "query.value", null);
	let query = sqlDb("areas");
	if (filter !== null) {
		switch (filter) {
			case "location":
				query
					.distinct("areas.*")
					.join("services", "areas.id", "services.area")
					.join("servicelocation", "services.id", "servicelocation.service")
					.where("servicelocation.location", value);
				break;
			default:
				break;
		}
	}
	query
		.orderBy("areas.id", "asc")
		.then(result => {
			res.json(result);
		});
});

/* Returns a JSON object that corresponds to the area specified by "area_id" and all his information.
If the area ID is invalid, a JSON object containing an error message is returned. */
app.get("/areas/:area_id", function (req, res) {
	sqlDb("areas")
		.where("id", req.params.area_id)
		.then(result => {
			if (result.length === 0) {
				res.json({
					error: "Invalid area ID"
				});
			} else {
				res.json(result[0]);
			}
		});
});


/* =========================================================
 Location APIs
========================================================== */

/* Returns a JSON composed by an array of objects 
Each object is a distinct Location and contains all the characteristic parameters.
Filtering is supported, altough only filter by service is implemented.
Parameters:
- filter: the type of the filter, in this case can only be equal to "service" (or null)
- value: the ID of an 'object' of the same type specified by the filter parameter 
		(e.g the ID of the service you may want to know in which locations is served)
Locations are ordered by city name */
app.get("/locations", function (req, res) {
	let filter = _.get(req, "query.filter", null);
	let value = _.get(req, "query.value", null);
	let query = sqlDb("locations");
	if (filter === null) {
		switch (filter) {
			case "service":
				query
					.select("locations.*")
					.join("servicelocation", "location.id", "servicelocation.location")
					.where("servicelocation.service", value);
				break;
			default:
				break;
		}
	}
	query.orderBy("locations.city", "asc").then(result => {
		result.map(o => { o.img = makeURLsAbsolute(o.img, true) });
		res.json(result);
	});
});

/* Returns a JSON object that corresponds to a Location and contains all the characteristic parameters. 
A JSON object containing an error message is returned*/
app.get("/locations/:location_id", function (req, res) {
	sqlDb("locations")
		.where('id', req.params.location_id)
		.then(result => {
			if (result.length === 0)
				res.json({
					error: "Invalid location ID"
				});
			else {
				let loc = result[0];
				loc.img = makeURLsAbsolute(loc.img, true);
				res.json(loc);
			}
		});
});

/* Returns a JSON object that contains an array listing all images of the location specified by location_id.
If the location ID is invalid returns a JSON object containing an error message.*/
app.get("/locations/:location_id/images", function (req, res) {
	sqlDb("locations").where("id", req.params.location_id).then(result => {
		if (result.length == 1) {
			sqlDb("locationimages")
				.innerJoin("locations", "locations.id", "locationimages.location")
				.where("location", req.params.location_id)
				.orderBy("inc", "asc")
				.select("name", "inc", "path")
				.then(result => {
					result.map(o => { o.path = makeURLsAbsolute(o.path, true) });
					res.json(result);
				});
		} else {
			res.json({ message: "Invalid location ID." });
		}
	});
});

/* Returns a JSON object that contains an array listing the directions to reach the location specified by location_id.
If the location ID is invalid returns a JSON object containing an error message.*/
app.get("/locations/:location_id/directions", function (req, res) {
	sqlDb("locations").where("id", req.params.location_id).then(result => {
		if (result.length == 1) {
			sqlDb("locationdirections")
				.innerJoin("locations", "locations.id", "locationdirections.location")
				.where("location", req.params.location_id)
				.select("name", "address", "city", "directions")
				.then(result => {
					res.json(result);
				});
		} else {
			res.json({ message: "Invalid location ID." });
		}
	});
});


/* =========================================================
 About us API
 Returns a JSON composed by an array of objects. 
 Each object contains the title and the corresponding information 
========================================================== */
app.get("/aboutus", function (req, res) {
	sqlDb('whoweare').orderBy("id", "asc").then(result => {
		res.json(result);
	});
});

/* =========================================================
 Home APIs
 Returns a JSON object that contains the absolute paths to the images that can be used in the carousel,
 and the information and the url for the information DIVs that are shown in the homepage of the website.
========================================================== */
app.get("/home", function (req, res) {
	sqlDb("homeslider")
		.select("path")
		.then(result => {
			result.map(o => {
				o.path = makeURLsAbsolute(o.path, true)
			});
			let home = {
				slider: result,
				divs: undefined
			};
			sqlDb("homedivs")
				.select("title", "icon", "paragraph", "path", "buttontext")
				.then(result => {
					result.map(o => {
						o.path = makeURLsAbsolute(o.path, false)
					});
					home.divs = result;
					res.json(home);
				})
		});
});

