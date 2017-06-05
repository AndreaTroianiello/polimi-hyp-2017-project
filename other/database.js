const sqlDbFactory = require("knex");
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
let sqlDb;
let serverUrl;

var getSQLDB = function (DEV, serverUrl) {
    server = DEV?serverUrl[0]:serverUrl[1];
    if (DEV) {
        sqlDb = sqlDbFactory({
            client: "sqlite3",
            debug: true,
            connection: {
                filename: "./other/medicalcenter.sqlite"
            },
            useNullAsDefault: true
        });
    } else {
        sqlDb = sqlDbFactory({
            debug: true,
            client: "pg",
            connection: process.env.DATABASE_URL,
            ssl: true
        });
    }
    return sqlDb;
}

var initDB = function () {
    fixImgURLs();
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
                    table.string('img');
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

function fixImgURLs() {
    doctors.map(doctor => {
        doctor.img = server+ doctor.img;
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