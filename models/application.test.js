"use strict";
process.env.NODE_ENV === "test";
const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError.js");
const Application = require("./application.js");
//const Decimal = require('decimal.js');
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/************************************** place */
describe("place", function () {
  const newApplication = {
    username : "u2",
    jobID : 3,
  };

  test("works", async function () {
    let application = await Application.place(newApplication);
    expect(application).toEqual({
        username : "u2",
        jobID : 3
    });

    const result = await db.query(
          `SELECT username, job_id AS "jobID"
           FROM applications
           WHERE username = 'u1' AND job_id = 1`);
    expect(result.rows).toEqual([
      {
        username : "u1",
        jobID : 1
      }
    ]);
  });

});


/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let applications = await Application.findAll();
    expect(applications).toEqual(
    [
      {"jobID": 1, "username": "u1"}, 
      {"jobID": 2, "username": "u2"}
    ]);
  });
 
  test("search by user", async () => {
    let applications = await Application.findAll({username : "u1"});
    expect(applications).toEqual([{"jobID": 1, "username": "u1"}]);
  });

  test("search by job", async () => {
    let applications = await Application.findAll({jobID : 1});
    expect(applications).toEqual([{"jobID": 1, "username": "u1"}]);
  });


});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Application.remove({username : "u2", jobID : 2});
    const res = await db.query(
        "SELECT username, job_id FROM applications WHERE username = 'u2' AND job_id = 2");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such application", async function () {
    try {
      await Application.remove({username : 'u9', jobID : 2});
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});