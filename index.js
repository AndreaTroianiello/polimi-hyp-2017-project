const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const process = require("process");
const dbms = require("./other/database.js");
const app = express();
const DEV = process.env.DEV;

app.use(express.static(__dirname + "/public"));

//Allow to get data from a POST
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

//Start the server 
app.listen(serverPort, function () {
	console.log(`Your app is ready at ${serverUrl}`);
});

/* =========================================================
 Doctors APIs
========================================================== */

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

app.get("/doctors/:doctor_id/next", function (req, res) {
	getPrevNext(req, res, true);
});

app.get("/doctors/:doctor_id/previous", function (req, res) {
	getPrevNext(req, res, false);
});

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

/* =========================================================
 Services APIs
========================================================== */

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

app.get("/locations", function (req, res) {
	let filter = _.get(req, "query.filter", null);
	let value = _.get(req, "query.value", null);
	let query = sqlDb("locations");
	if (filter === null) {
		switch (filter) {
			case "location":
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

app.get("/locations/:location_id/images", function (req, res) {
	sqlDb("locationimages")
		.innerJoin("locations", "locations.id", "locationimages.location")
		.where("location", req.params.location_id)
		.orderBy("inc", "asc")
		.select("name", "inc", "path")
		.then(result => {
			result.map(o => { o.path = makeURLsAbsolute(o.path, true) });
			res.json(result);
		})
});

app.get("/locations/:location_id/directions", function (req, res) {
	sqlDb("locationdirections")
		.innerJoin("locations", "locations.id", "locationdirections.location")
		.where("location", req.params.location_id)
		.select("name", "address", "city", "directions")
		.then(result => {
			res.json(result);
		})
});

/* =========================================================
 About us APIs
========================================================== */

app.get("/aboutus", function (req, res) {
	sqlDb('whoweare').orderBy("id", "asc").then(result => {
		res.json(result);
	});
});

/* =========================================================
 Home APIs
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
					home.divs=result;
					res.json(home);
				})
		});
});

function makeURLsAbsolute(path, img) {
	let URL = (DEV ? serverUrl[0] : serverUrl[1]) + (img ? "/assets/img/" : "");
	return URL + path;
}