const knex = require("knex");
const _ = require("lodash");

let whoweare = require("./json_db/whoweare.json");
let areas = require("./json_db/areas.json");
let services = require("./json_db/services.json");
let locations = require("./json_db/locations.json");
let doctors = require("./json_db/doctors.json");
let locationsImages = require("./json_db/locationimages.json");
let locationsDirections = require("./json_db/locationdirections.json");
let serviceLocation = require("./json_db/servicelocation.json");
let doctorLocation = require("./json_db/doctorlocation.json");
let curriculums = require("./json_db/curriculums.json");
let db;
let server;

var getSQLDB = function (DEV, serverUrl) {
    server = DEV ? serverUrl[0] : serverUrl[1];
    if (DEV) {
        db = knex({
            client: "sqlite3",
            debug: true,
            connection: {
                filename: "./other/medicalcenter.sqlite"
            },
            useNullAsDefault: true
        });
    } else {
        db = knex({
            debug: true,
            client: "pg",
            connection: process.env.DATABASE_URL,
            ssl: true
        });
    }
    return db;
}

var initDB = function () {
    fixImgURLs();
    whoWeAreTable()
        .then(areasTable)
        .then(servicesTable)
        .then(locationsTable)
        .then(doctorsTable)
        .then(locationImageTable)
        .then(locationDirectionsTable)
        .then(serviceLocationTable)
        .then(doctorLocationTable)
        .then(curriculumsTable);
}

function whoWeAreTable() {
    return new Promise((resolve, reject) => {
        db.schema.hasTable("whoweare").then(exists => {
            if (!exists) {
                db.schema
                    .createTable("whoweare", table => {
                        table.increments('id');
                        table.string('tag');
                        table.string('information');
                    })
                    .then(() => {
                        return Promise.all(
                            _.map(whoweare, a => {
                                return db("whoweare").insert(a);
                            })
                        );
                    });
                resolve("whoweare created");
            } else {
                resolve("whoweare already exists");
            }
        });

    });
}

function areasTable() {
    return new Promise((resolve, reject) => {
        db.schema.hasTable("areas").then(exists => {
            if (!exists) {
                db.schema
                    .createTable("areas", table => {
                        table.increments('id');
                        table.string('name');
                        table.string('desc');
                    })
                    .then(() => {
                        return Promise.all(
                            _.map(areas, a => {
                                return db("areas").insert(a);
                            })
                        );
                    });
                resolve("area created");
            } else {
                resolve("area already exists");
            }
        });
    });
}

function servicesTable() {
    return new Promise((resolve, reject) => {
        db.schema.hasTable("services").then(exists => {
            if (!exists) {
                db.schema
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
                                return db("services").insert(s);
                            })
                        );
                    });
                resolve("services created");
            } else {
                resolve("services already exists");
            }
        });
    });
}

function locationsTable() {
    return new Promise((resolve, reject) => {
        db.schema.hasTable("locations").then(exists => {
            if (!exists) {
                db.schema
                    .createTable("locations", table => {
                        table.increments('id');
                        table.string('name');
                        table.string('city');
                        table.string('address');
                        table.string('phone');
                        table.string('fax');
                        table.string('email');
                        table.string('timetable');
                        table.string('img');
                    })
                    .then(() => {
                        return Promise.all(
                            _.map(locations, l => {
                                return db("locations").insert(l);
                            })
                        );
                    });
                resolve("locations created");
            } else {
                resolve("locations already exists");
            }
        });
    });
}

function doctorsTable() {
    return new Promise((resolve, reject) => {
        db.schema.hasTable("doctors").then(exists => {
            if (!exists) {
                db.schema
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
                                return db("doctors").insert(l);
                            })
                        );
                    });
                resolve("doctors created");
            } else {
                resolve("doctors already exists");
            }
        });
    });
}

function locationImageTable() {
    return new Promise((resolve, reject) => {
        db.schema.hasTable("locationimages").then(exists => {
            if (!exists) {
                db.schema
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
                                return db("locationimages").insert(l);
                            })
                        );
                    });
                resolve("location image created");
            } else {
                resolve("location image already exists");
            }
        });
    });
}

function locationDirectionsTable() {
    return new Promise((resolve, reject) => {
        db.schema.hasTable("locationdirections").then(exists => {
            if (!exists) {
                db.schema
                    .createTable("locationdirections", table => {
                        table.increments('id');
                        table.string('directions');
                        table.integer('location');
                        table.foreign('location').references('locations.id');
                    })
                    .then(() => {
                        return Promise.all(
                            _.map(locationsDirections, l => {
                                return db("locationdirections").insert(l);
                            })
                        );
                    });
                resolve("location directions created");
            } else {
                resolve("location directions created");
            }
        });
    });
}

function serviceLocationTable() {
    return new Promise((resolve, reject) => {
        db.schema.hasTable("servicelocation").then(exists => {
            if (!exists) {
                db.schema
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
                                return db("servicelocation").insert(l);
                            })
                        );
                    });
                resolve("serviceLocation created");
            } else {
                resolve("service location already exists");
            }
        });
    });
}

function doctorLocationTable() {
    return new Promise((resolve, reject) => {
        db.schema.hasTable("doctorlocation").then(exists => {
            if (!exists) {
                db.schema
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
                                return db("doctorlocation").insert(l);
                            })
                        );
                    });
                resolve("doctor location created");
            } else {
                resolve("doctor location already exists");
            }
        });
    });
}

function curriculumsTable() {
    return new Promise((resolve, reject) => {
        db.schema.hasTable("curriculums").then(exists => {
            if (!exists) {
                db.schema
                    .createTable("curriculums", table => {
                        table.increments('id');
                        table.integer('doctor');
                        table.string('desc');
                        table.foreign('doctor').references('doctors.id');
                    })
                    .then(() => {
                        return Promise.all(
                            _.map(curriculums, c => {
                                return db("curriculums").insert(c);
                            })
                        );
                    });
                resolve("curriculums created");
            } else {
                resolve("curriculums already exists");
            }
        });
    });
}

function fixImgURLs() {
    doctors.map(doctor => {
        doctor.img = server + doctor.img;
    });
    locations.map(location => {
        location.img = server + location.img;
    });
    locationsImages.map(li => {
        li.path = server + li.path;
    });
}

exports.initDB = initDB;
exports.getSQLDB = getSQLDB;