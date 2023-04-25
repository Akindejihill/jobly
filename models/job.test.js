"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const Decimal = require('decimal.js');
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

const eq = new Decimal(0.0001);

describe("create", function () {
  const newJob = {
    title : "New",
    salary : 240000,
    equity : eq.toNumber(),
    companyHandle : 'c1'
  };

  test("works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual({
      id : expect.any(Number),
      title : "New",
      salary : 240000,
      equity : eq.toString(),
      companyHandle : 'c1'
    });

    const result = await db.query(
          `SELECT id, title, salary, equity, company_handle AS "companyHandle"
           FROM jobs
           WHERE title = 'New'`);
    expect(result.rows).toEqual([
      {
        id : expect.any(Number),
        title : "New",
        salary : 240000,
        equity : eq.toString(),
        companyHandle : 'c1'
      }
    ]);
  });

});



/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        id: expect.any(Number),
        title: "job1",
        salary: 98000,
        equity: "0.00001",
        companyHandle: "c1",
      },
      {
        id: expect.any(Number),
        title: "job2",
        salary: 120000,
        equity: "0.00002",
        companyHandle: "c2",
      },
      {
        id: expect.any(Number),
        title: "job3",
        salary: 140000,
        equity: "0.00003",
        companyHandle: "c3",
      },
      {
        id: expect.any(Number),
        title: "job4",
        salary: 160000,
        equity: "0.00004",
        companyHandle: "c2",
      },
      {
        id: expect.any(Number),
        title: "job5",
        salary: 180000,
        equity: "0.00005",
        companyHandle: "c3",
      }
    ]);
  });
 
  test("Conditional search", async () => {
    let jobs = await Job.findAll({minSalary : 120000, hasEquity : true, search : 'b3'});
    expect(jobs).toEqual([{
      "companyHandle": "c3",
      "equity": "0.00003",
      "id": expect.any(Number),
      "salary": 140000,
      "title": "job3",
      }]);
  });


});

/***************************************get */

describe("get", function () {
  test("works", async function () {
    let job = await Job.get(1);
    expect(job).toEqual({"companyHandle": "c1",
                          "equity": "0.00001", 
                          "id": 1, 
                          "salary": 98000, 
                          "title": "job1"});
  });

  test("not found if no such job", async function () {
    try {
      await Job.get(9999);
      fail("Error wasn't thrown or caught");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
      expect(err.message).toContain("No job: 9999");
    }
  });
});




/************************************** get company jobs*/

describe("get by company", function () {
  test("works", async function () {
    let job = await Job.get_by_company('c1');
    expect(job).toEqual([{"companyHandle": "c1",
                          "equity": "0.00001", 
                          "id": expect.any(Number), 
                          "salary": 98000, 
                          "title": "job1"}]);
  });

  test("not found if no such company", async function () {
    try {
      await Job.get_by_company("nope");
      fail("Error wasn't thrown or caught");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
      expect(err.message).toContain("No company: nope");
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    title: "New",
    salary: "200000",
    equity: 0.0002
  };

  test("works", async function () {
    let company = await Job.update(1, updateData);
    expect(company).toEqual({
      id: 1,
      title : "New",
      salary : 200000,
      equity : "0.0002",
      companyHandle : 'c1'
    });


    const result = await db.query(
          `SELECT id, title, salary, equity, company_handle AS "companyHandle"
           FROM jobs
           WHERE id = 1`);
    expect(result.rows).toEqual([{
      id: 1,
      title : "New",
      salary : 200000,
      equity : "0.0002",
      companyHandle : 'c1'
    }]);
  });

  test("works: null fields", async function () {
    const updateDataSetNulls = {
      title: "New",
      salary: 300000,
      equity: null,
    };

    let job = await Job.update(1, updateDataSetNulls);
    expect(job).toEqual({
      id: 1,
      title : "New",
      salary : 300000,
      equity : null,
      companyHandle : 'c1'
    });
  });

  test("not found if no such job", async function () {
    try {
      await Job.update(9999, updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Job.update(1, {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Job.remove(1);
    const res = await db.query(
        "SELECT id FROM jobs WHERE id=1");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such job", async function () {
    try {
      await Job.remove(9999);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
