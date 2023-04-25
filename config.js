"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");
const fs = require('fs');

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

const PORT = +process.env.PORT || 3001;

let db_password = fs.readFileSync("/var/www/cerebro/CodingBootcamp/projects/express-jobly/db_password.txt", "utf8").trim();
// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
        ? `postgresql://akindeji:${db_password}@localhost:5432/jobly_test` 
        : `postgresql://akindeji:${db_password}@localhost:5432/jobly`;
}

// //If you don't need a database password, comment out the other version
// //of getDatabaseUri and uncomment this one
// function getDatabaseUri() {
//   // return (process.env.NODE_ENV === "test")
//   //     ? "jobly_test"
//   //     : process.env.DATABASE_URL || "jobly";
// }

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("Jobly Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
