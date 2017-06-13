const knex = require("knex");
const _ = require("lodash");

//get the db schema 
let schema = require("./schema.json");

let db;

var getSQLDB = function (DEV) {

    //if DEV use sqlite, otherwise use postgresql
    if (DEV) {
        db = knex({
            client: "sqlite3",
            //debug messages are enabled for developer environment
            debug: true,
            connection: {
                filename: "./other/medicalcenter.sqlite"
            },
            useNullAsDefault: true
        });
    } else {
        db = knex({
            client: "pg",
            connection: process.env.DATABASE_URL,
            ssl: true
        });
    }
    return db;
}

var initDB = function () {
    let schemaPromises = [];
   
    addPromises(schemaPromises);
    
    //if ALL table exist, then proceed. Otherwise drop the db and regenerate
    Promise.all(schemaPromises)
        .then(() => {
            console.log("Database already exists!");
        })
        //If at least one table doesn't exist, DROP ALL and recreate the DB
        .catch(function () {
            console.log("Database doesn't exist!");
            return deleteDatabase()
                .then(function () {
                    // returns the promise
                    return createDatabase()
                }).then(function () {
                    // returns the promise 
                    return populateDatabase();
                });
        });

}

//add promises in the array, every promise checks if a table exist in the db
function addPromises(schemaPromises){
     for (let i = 0; i < schema.length; i++) {
        schemaPromises[i] = new Promise((resolve, reject) => {
            db.schema.hasTable(schema[i].name).then(exists => {
                if (!exists) {
                    reject(schema[i].name + " doesn't exist");
                } else {
                    resolve(schema[i].name + " exists");
                }
            });
        });
    }
}

//Drops all the tables specified in the Schema JSON
function deleteDatabase() {
    let result;
    for (let i = 0; i < schema.length; i++) {
        if (i === 0) {
            result = db.schema.dropTableIfExists(schema[i].name);
        } else {
            result = result.then(function () {
                return db.schema.dropTableIfExists(schema[i].name);
            });
        }
    }
    return result;
}

function createDatabase() {
    //Assigns the variable to a stupid promise
    let result = db.schema.dropTableIfExists("dumb_query");
    //Loops for every table specified in the Schema json
    for (let i = 0; i < schema.length; i++) {
        //get the current table object
        let table = schema[i];
        result = result.then(function () {
            //Create tables, then calls a callback
            return db.schema.createTable(table.name, function (t) {
                let cols = table.columns;
                //Reads name and datatype of the column, then adds it
                for (let j = 0; j < cols.length; j++) {
                    switch (cols[j].type) {
                        case "id":
                            t.increments(cols[j].name);
                            break;
                        case "integer":
                            t.integer(cols[j].name);
                            break;
                        case "string":
                            t.string(cols[j].name);
                            break;
                        case "text":
                            t.text(cols[j].name);
                            break;
                        case "boolean":
                            t.boolean(cols[j].name);
                            break;
                    }
                }
                //Reads which column is a foreign key and the key it makes reference to, then adds the relation
                let foreign = table.foreign;
                for (let j = 0; j < foreign.length; j++) {
                    t.foreign(foreign[j].name).references(foreign[j].references);
                }
            });
        });
    }
    return result;
};


//Populate the db using information from the JSONs
function populateDatabase() {
    // A promise that has to be returned
    let result;
    for (let i = 0; i < schema.length; i++) {
        //Load the array of object from the JSON specified in the schema JSON
        if(schema[i].file === null){
            continue;
        }
        let json = require(schema[i].file);
        //Insert, if it's the first element it make result equal to a promise, otherwise appends another promise in a then()
        for (let j = 0; j < json.length; j++) {
            if (i === 0 && j === 0) {
                result = db(schema[i].name).insert(json[j]);
            } else {
                result = result.then(() => {
                    return db(schema[i].name).insert(json[j]);
                });
            }
        }
    }
    return result;
};


//Export module
exports.initDB = initDB;
exports.getSQLDB = getSQLDB;