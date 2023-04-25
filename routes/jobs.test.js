"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  a1Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe("POST /jobs", function () {
    const newJob = {
        title: "New",
        salary: 240000,
        equity: 0.1,
        companyHandle: "c1",
    };

    test("requires admin", async function () {
        const resp = await request(app)
            .post("/jobs")
            .send(newJob)
            .set("authorization", `Bearer ${a1Token}`);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            job: {
                companyHandle: "c1",
                equity: "0.1",
                id: expect.any(Number),
                salary: 240000,
                title: "New",
              }
        });
    });

  test("bad request with missing data", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send({
          title: "New",
          salary: 500000,
        })
        .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
        .post("/jobs")
        .send({
          ...newJob,
          equity: "not-a-decimal",
        })
        .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

// /************************************** GET /jobs */

describe("GET /companies", function () {
  test("ok for anon", async function () {
    const resp = await request(app).get("/jobs");
    expect(resp.body).toEqual({"jobs": [
        {"companyHandle": "c1", "equity": "0.00001", "id": 1, "salary": 98000, "title": "job1"}, 
        {"companyHandle": "c2", "equity": "0.00002", "id": 2, "salary": 120000, "title": "job2"}, 
        {"companyHandle": "c3", "equity": "0.00003", "id": 3, "salary": 140000, "title": "job3"}, 
        {"companyHandle": "c2", "equity": "0.00004", "id": 4, "salary": 160000, "title": "job4"}, 
        {"companyHandle": "c3", "equity": "0.00005", "id": 5, "salary": 180000, "title": "job5"}]
    });
  });


    test("Test get request with query search option", async () => {
        const resp = await request(app).get('/jobs?search=b2');
        expect(resp.body).toEqual({
            "jobs": [{
                "companyHandle": "c2", 
                "equity": "0.00002", 
                "id": 2, 
                "salary": 120000, 
                "title": "job2"
            }]
        });
    });

    test("Test get request with query minSalary option", async () => {
        const resp = await request(app).get('/jobs?minSalary=140000');
        expect(resp.body).toEqual({
            jobs: 
            [
                {
                  companyHandle: "c3",
                  equity: "0.00003",
                  id: 3,
                  salary: 140000,
                  title: "job3",
                },
                {
                  companyHandle: "c2",
                  equity: "0.00004",
                  id: 4,
                  salary: 160000,
                  title: "job4",
                },
                {
                   companyHandle: "c3",
                   equity: "0.00005",
                   id: 5,
                   salary: 180000,
                   title: "job5",
                }
            ],
        });
    });


  test("fails: test next() handler", async function () {
    // there's no normal failure event which will cause this route to fail ---
    // thus making it hard to test that the error-handler works with it. This
    // should cause an error, all right :)
    await db.query("DROP TABLE jobs CASCADE");
    const resp = await request(app)
        .get("/jobs")
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(500);
  });
});

// /************************************** GET /companies/:handle */

describe("GET /jobs/:id", function () {
  test("works for anon", async function () {
    const resp = await request(app).get(`/jobs/1`);
    expect(resp.body).toEqual({
      job: {
        id: 1,
        title: "job1",
        salary: 98000,
        equity: "0.00001",
        companyHandle: "c1",
      },
    });
  });

  test("not found for no such job", async function () {
    const resp = await request(app).get(`/jobs/99999`);
    expect(resp.statusCode).toEqual(404);
  });
});

// /************************************** PATCH /companies/:handle */

describe("PATCH /jobs/:id", function () {
  test("works for users", async function () {
    const resp = await request(app)
        .patch(`/jobs/1`)
        .send({
          title: "New-title",
        })
        .set("authorization", `Bearer ${a1Token}`);
    expect(resp.body).toEqual({
        job: {
            id: 1,
            title: "New-title",
            salary: 98000,
            equity: "0.00001",
            companyHandle: "c1",
          },
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .patch(`/jobs/1`)
        .send({
          title: "new-title",
        });
    expect(resp.statusCode).toEqual(500);
  });

  test("not found on no such job", async function () {
    const resp = await request(app)
        .patch(`/jobs/999999`)
        .send({
          title: "new-nope",
        })
        .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request on handle change attempt", async function () {
    const resp = await request(app)
        .patch(`/jobs/1`)
        .send({
          id: "999",
        })
        .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request on invalid data", async function () {
    const resp = await request(app)
        .patch(`/jobs/1`)
        .send({
          equity: "not-a-decimal",
        })
        .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

// /************************************** DELETE /companies/:handle */

describe("DELETE /jobs/:id", function () {
  test("works for users", async function () {
    const resp = await request(app)
        .delete(`/jobs/1`)
        .set("authorization", `Bearer ${a1Token}`);
    expect(resp.body).toEqual({ deleted: "1" });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .delete(`/jobs/1`);
    expect(resp.statusCode).toEqual(500);
  });

  test("not found for no such job", async function () {
    const resp = await request(app)
        .delete(`/jobs/999`)
        .set("authorization", `Bearer ${a1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});
