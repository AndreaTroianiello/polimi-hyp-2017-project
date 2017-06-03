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


/*let doctors = require("./other/doctors.json");
let curriculums = require("./other/curriculums.json");
let areas = require("./other/areas.json");
let services = require("./other/services.json");
let locations = require("./other/locations.json");
let whoweare = require("./other/json_db/whoweare.json");*/

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
					table.integer('area').unsigned();
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
					table.enum('male', ["true", "false"]);
					table.string('phone');
					table.string('fax');
					table.string('email');
					table.string('img');
					table.integer('operates').unsigned();
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
					table.integer('location').unsigned();
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
	sqlDb.schema.hasTable("locationdirection").then(exists => {
		if (!exists) {
			sqlDb.schema
				.createTable("locationdirection", table => {
					table.increments('id');
					table.string('directions');
					table.integer('location').unsigned();
					table.foreign('location').references('locations.id');
				})
				.then(() => {
					return Promise.all(
						_.map(locationsDirections, l => {
							return sqlDb("locationdirection").insert(l);
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
	let filter = _.get(req, "query.filter", null);
	let value = _.get(req, "query.value", null);
	res.json(getDoctors(filter, value));
});

app.get("/doctors/:doctor_id", function (req, res) {
	let answer = getDoctor(req.params.doctor_id);
	if (answer == null) {
		answer = {
			error: "Invalid doctor ID"
		};
	}
	res.json(answer);
});

app.get("/doctors/:doctor_id/next", function (req, res) {
	let answer;
	let filter = _.get(req, "query.filter", null);
	let value = _.get(req, "query.value", null);
	let docs = getDoctors(filter, value);
	let curr_doc = _.findIndex(docs, function (d) {
		return d.id == req.params.doctor_id;
	});
	if (curr_doc === -1) {
		answer = {
			error: "No doctor found for the given parameters."
		};
	} else {
		answer = docs[(curr_doc + 1) % docs.length];
	}
	res.json(answer);
});

app.get("/doctors/:doctor_id/previous", function (req, res) {
	let answer;
	let filter = _.get(req, "query.filter", null);
	let value = _.get(req, "query.value", null);
	let docs = getDoctors(filter, value);
	let curr_doc = _.findIndex(docs, function (d) {
		return d.id == req.params.doctor_id;
	});
	if (curr_doc === -1) {
		answer = {
			error: "No doctor found for the given parameters."
		};
	} else {
		answer = docs[(curr_doc + docs.length - 1) % docs.length];
	}
	res.json(answer);
});

app.get("/doctors/:doctor_id/curriculum", function (req, res) {
	let answer = getCurriculum(req.params.doctor_id);
	if (answer == null) {
		answer = {
			error: "Invalid doctor ID"
		};
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
		answer = {
			error: "Invalid service ID"
		};
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
		answer = {
			error: "Invalid area ID"
		};
	}
	res.json(answer);
});

/* =========================================================
 Location APIs
========================================================== */

app.get("/locations", function (req, res) {
	let filter = _.get(req, "query.filter", null);
	let value = _.get(req, "query.value", null);
	res.json(getLocations(filter, value));
});

app.get("/locations/:location_id", function (req, res) {
	let answer = getLocation(req.params.location_id);
	if (answer == null) {
		answer = {
			error: "Invalid doctor ID"
		};
	}
	res.json(answer);
});


/* =========================================================
 About us APIs
========================================================== */

app.get("/aboutus", function (req, res) {
	res.json(getWhoweare());
});

function getWhoweare() {
	return whoweare;
}

/* =========================================================
 Doctors functions yet to be implemented with SQLite
========================================================== */

function getDoctors(filter, value) {
	doctorsList = _.toArray(doctors);
	if (filter === "location") {
		doctorsList = doctorsList.slice(4, 6);
	}

	return doctors.sort(docSort);
}

function getDoctor(id) {
	docIndex = _.findIndex(doctors, function (d) {
		return id == d.id;
	})
	return doctors[docIndex];
}

function getCurriculum(id) {
	return curriculums[_.findIndex(curriculums, function (c) {
		return id == c.doctor;
	})];
}


/* =========================================================
 Services functions yet to be implemented with SQLite
========================================================== */
function getServices(filter, value) {
	servicesList = _.toArray(services);
	if (filter === "location") {
		servicesList = servicesList.slice(1, 2);
	}

	return servicesList.sort(genSort);
}

function getService(id) {
	serIndex = _.findIndex(services, function (s) {
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
		areasList = areasList.slice(0, 1);
	}

	return areasList.sort(genSort);
}

function getArea(id) {
	areaIndex = _.findIndex(areas, function (a) {
		return id == a.id;
	})
	return areas[areaIndex];
}

/* =========================================================
 Locations functions yet to be implemented with SQLite
========================================================== */

function getLocations(filter, value) {
	locationsList = _.toArray(locations)
	if (filter === "service") {
		locationsList = locationsList.slice(0, 1);
	}
	return locationsList;
}

function getLocation(id) {
	locIndex = _.findIndex(doctors, function (l) {
		return id == l.id;
	})
	return locations[locIndex];
}

/* ===================
	Utility functions
====================*/

function docSort(a, b) {
	a_full = (a.surname + " " + a.name).toLowerCase();
	b_full = (b.surname + " " + b.name).toLowerCase();

	if (a_full < b_full) {
		return -1;
	} else if (a_full > b_full) {
		return 1;
	}
	return 0;
}

function genSort(a, b) {
	a_full = a.name.toLowerCase();
	b_full = b.name.toLowerCase();

	if (a_full < b_full) {
		return -1;
	} else if (a_full > b_full) {
		return 1;
	}
	return 0;
}

initDb();