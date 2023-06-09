"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Company = require("../models/company");
const Job = require("../models/job");
const { createToken } = require("../helpers/tokens");

async function commonBeforeAll() {
    // noinspection SqlWithoutWhere
    await db.query("DELETE FROM applications");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM jobs");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM companies");


  await Company.create(
      {
        handle: "c1",
        name: "C1",
        numEmployees: 1,
        description: "Desc1",
        logoUrl: "http://c1.img",
      });
  await Company.create(
      {
        handle: "c2",
        name: "C2",
        numEmployees: 2,
        description: "Desc2",
        logoUrl: "http://c2.img",
      });
  await Company.create(
      {
        handle: "c3",
        name: "C3",
        numEmployees: 3,
        description: "Desc3",
        logoUrl: "http://c3.img",
      });

  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    isAdmin: false,
  });
  await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    isAdmin: false,
  });
  await User.register({
    username: "u3",
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    password: "password3",
    isAdmin: false,
  });
  await User.register({
    username: "admin",
    firstName: "ad",
    lastName: "min",
    email: "admin@admin.com",
    password: "password0",
    isAdmin: false,
  });


  // await Job.create({
  //   title: "job1",
  //   salary: 98000,
  //   equity: 0.00001,
  //   companyHandle: "c1",
  // });
  // await Job.create({
  //   title: "job2",
  //   salary: 120000,
  //   equity: 0.00002,
  //   companyHandle: "c2",
  // });
  // await Job.create({
  //   title: "job3",
  //   salary: 140000,
  //   equity: 0.00003,
  //   companyHandle: "c3",
  // });
  // await Job.create({
  //   title: "job4",
  //   salary: 160000,
  //   equity: 0.00004,
  //   companyHandle: "c2",
  // });
  // await Job.create({
  //   title: "job5",
  //   salary: 180000,
  //   equity: 0.00005,
  //   companyHandle: "c3",
  // });
  
  await db.query(`
  INSERT INTO jobs (id, title, salary, equity, company_handle)
  VALUES (1, 'job1', 98000, 0.00001, 'c1'),
         (2, 'job2', 120000, 0.00002, 'c2'),
         (3, 'job3', 140000, 0.00003, 'c3'),
         (4, 'job4', 160000, 0.00004, 'c2'),
         (5, 'job5', 180000, 0.00005, 'c3')`
  );

  await db.query(`
    INSERT INTO applications (username, job_id)
    VALUES ('u1', 1),
          ('u2', 2)`
  );
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


const u1Token = createToken({ username: "u1", isAdmin: false });
const a1Token = createToken({ username: "u1", isAdmin: true });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  a1Token,
};
