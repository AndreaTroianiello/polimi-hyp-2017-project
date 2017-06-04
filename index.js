//Call the packages
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const _ = require("lodash");
const sqlDbFactory = require("knex");

const sqlDb = sqlDbFactory({
	client: "sqlite3",
	debug: true,
	connection: {
		filename: "./other/medicalcenter.sqlite"
	},
	useNullAsDefault: true
});


let whoweare = require("./other/json_db/whoweare.json");
let areas = require("./other/json_db/areas.json");
let services = require("./other/json_db/services.json");
let locations = require("./other/json_db/locations.json");
let doctors = require("./other/json_db/doctors.json");
let locationsImages = require("./other/json_db/locationimages.json");
let locationsDirections = require("./other/json_db/locationdirections.json");
let serviceLocation = require("./other/json_db/servicelocation.json");
let doctorLocation = require("./other/json_db/doctorlocation.json");
let curriculums = require("./other/json_db/curriculums.json");


app.use(express.static(__dirname + "/public"));

//Allow to get data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

//Set the server's port
let serverPort = process.env.PORT || 5000;
app.set("port", serverPort);

//Start the server on port 5000
app.listen(serverPort, function () {
	console.log(`Your app is ready at port ${serverPort}`);
});

/* =========================================================
============================================================
	Database APIs
============================================================
========================================================== */

function initDb() {
	sqlDb.schema.hasTable("whoweare").then(exists => {
		if (!exists) {
			sqlDb.schema
				.createTable("whoweare", table => {
					table.increments('id');
					table.string('tag');
					table.string('information');
				})
				.then(() => {
					return Promise.all(
						_.map(whoweare, a => {
							return sqlDb("whoweare").insert(a);
						})
					);
				});
		} else {
			return true;
		}
	});
	sqlDb.schema.hasTable("areas").then(exists => {
		if (!exists) {
			sqlDb.schema
				.createTable("areas", table => {
					table.increments('id');
					table.string('name');
					table.string('desc');
				})
				.then(() => {
					return Promise.all(
						_.map(areas, a => {
							return sqlDb("areas").insert(a);
						})
					);
				});
		} else {
			return true;
		}
	});
	sqlDb.schema.hasTable("services").then(exists => {
		if (!exists) {
			sqlDb.schema
				.createTable("services", table => {
					table.increments('id');
					table.string('name');
					table.string('description');
					table.integer('area');
					table.foreign('area').references('area.id');
				})
				.then(() => {
					return Promise.all(
						_.map(services, s => {
							return sqlDb("services").insert(s);
						})
					);
				});
		} else {
			return true;
		}
	});
	sqlDb.schema.hasTable("locations").then(exists => {
		if (!exists) {
			sqlDb.schema
				.createTable("locations", table => {
					table.increments('id');
					table.string('name');
					table.string('city');
					table.string('address');
					table.string('phone');
					table.string('fax');
					table.string('email');
					table.string('timetable');
				})
				.then(() => {
					return Promise.all(
						_.map(locations, l => {
							return sqlDb("locations").insert(l);
						})
					);
				});
		} else {
			return true;
		}
	});
	sqlDb.schema.hasTable("doctors").then(exists => {
		if (!exists) {
			sqlDb.schema
				.createTable("doctors", table => {
					table.increments('id');
					table.string('surname');
					table.string('name');
					table.boolean('male');
					table.string('phone');
					table.string('fax');
					table.string('email');
					table.string('img');
					table.integer('operates');
					table.integer('manages_s').unsigned();
					table.integer('manages_a').unsigned();
					table.string('desc');
					table.foreign('operates').references('services.id');
					table.foreign('manages_s').references('services.id');
					table.foreign('manages_a').references('areas.id');
				})
				.then(() => {
					return Promise.all(
						_.map(doctors, l => {
							return sqlDb("doctors").insert(l);
						})
					);
				});
		} else {
			return true;
		}
	});
	sqlDb.schema.hasTable("locationimages").then(exists => {
		if (!exists) {
			sqlDb.schema
				.createTable("locationimages", table => {
					table.increments('id');
					table.string('path');
					table.integer('inc');
					table.integer('location');
					table.foreign('location').references('locations.id');
				})
				.then(() => {
					return Promise.all(
						_.map(locationsImages, l => {
							return sqlDb("locationimages").insert(l);
						})
					);
				});
		} else {
			return true;
		}
	});
	sqlDb.schema.hasTable("locationdirections").then(exists => {
		if (!exists) {
			sqlDb.schema
				.createTable("locationdirections", table => {
					table.increments('id');
					table.string('directions');
					table.integer('location');
					table.foreign('location').references('locations.id');
				})
				.then(() => {
					return Promise.all(
						_.map(locationsDirections, l => {
							return sqlDb("locationdirections").insert(l);
						})
					);
				});
		} else {
			return true;
		}
	});
	sqlDb.schema.hasTable("servicelocation").then(exists => {
		if (!exists) {
			sqlDb.schema
				.createTable("servicelocation", table => {
					table.increments('id');
					table.integer('service');
					table.integer('location');
					table.foreign('service').references('services.id');
					table.foreign('location').references('locations.id');
				})
				.then(() => {
					return Promise.all(
						_.map(serviceLocation, l => {
							return sqlDb("servicelocation").insert(l);
						})
					);
				});
		} else {
			return true;
		}
	});
	sqlDb.schema.hasTable("doctorlocation").then(exists => {
		if (!exists) {
			sqlDb.schema
				.createTable("doctorlocation", table => {
					table.increments('id');
					table.integer('doctor');
					table.integer('location');
					table.foreign('doctor').references('doctors.id');
					table.foreign('location').references('locations.id');
				})
				.then(() => {
					return Promise.all(
						_.map(doctorLocation, l => {
							return sqlDb("doctorlocation").insert(l);
						})
					);
				});
		} else {
			return true;
		}
	});
	sqlDb.schema.hasTable("curriculums").then(exists => {
		if (!exists) {
			sqlDb.schema
				.createTable("curriculums", table => {
					table.increments('id');
					table.integer('doctor');
					table.string('desc');
					table.foreign('doctor').references('doctors.id');
				})
				.then(() => {
					return Promise.all(
						_.map(curriculums, c => {
							return sqlDb("curriculums").insert(c);
						})
					);
				});
		} else {
			return true;
		}
	});
}

/* =========================================================
============================================================
	RESTful APIs
============================================================
========================================================== */



/* =========================================================
 Doctors APIs
========================================================== */

app.get("/doctors", function (req, res) {
	let query = sqlDb("doctors");
	filterDoctor(req, query);
	query
		.orderBy("surname", "asc").orderBy("name", "asc")
		.then(result => {
			res.json(result);
		}
		);
});

app.get("/doctors/:doctor_id", function (req, res) {
	sqlDb("doctors").where("id", req.params.doctor_id).then(result => {
		if (result.length === 0) {
			res.json({
				error: "Invalid doctor ID"
			});
		} else {
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
	query = sqlDb("doctors");
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
				res.json(result[(i + result.lenght + next ? 1 : -1) % result.length]);
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
			if (result.lenght === 0) {
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
		res.json(result);
	});
});

app.get("/locations/:location_id", function (req, res) {
	sqlDb("locations")
		.where('id', req.params.location_id)
		.then(result => {
			if (result.lenght === 0)
				res.json({
					error: "Invalid location ID"
				});
			else {
				res.json(result[0]);
			}
		});
});

app.get("/locations/:location_id/images", function (req, res) {
	sqlDb("locationimages")
		.innerJoin("locations","locations.id","locationimages.location")
		.where("location", req.params.location_id)
		.orderBy("inc", "asc")
		.select("name","inc","path")
		.then(result => {
			res.json(result);
		})
});

app.get("/locations/:location_id/directions", function (req, res) {
	sqlDb("locationdirections")
		.innerJoin("locations","locations.id","locationdirections.location")
		.where("location", req.params.location_id)
		.select("name","address","city","directions")
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

/*====================================================
======================================================
	/ RESTful APIs
======================================================
====================================================*/


initDb();