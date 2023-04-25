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


// /************************************** GET /applications */

describe("GET /applications", function () {
    test("ok for anon", async function () {
        const resp = await request(app).get("/applications");
        expect(resp.body).toEqual({"applications": 
            [
                {
                    jobID: 1,
                    username: "u1",
                },
                {
                    jobID: 2,
                    username: "u2",
                },
            ]
        });
    });

      test("Test searching by username", async () => {
          const resp = await request(app).get('/applications?username=u1');
          expect(resp.body).toEqual(
            {"applications": [
                                {"jobID": 1, "username": "u1"}
                             ]
            });
      });
  
  
    test("fails: test next() handler", async function () {
      // there's no normal failure event which will cause this route to fail ---
      // thus making it hard to test that the error-handler works with it. This
      // should cause an error, all right :)
      await db.query("DROP TABLE applications CASCADE");
      const resp = await request(app)
          .get("/applications")
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(500);
    });
  });


  // /************************************** DELETE /applications/:id */

describe("DELETE /applications/:username/:jobID", function () {
    test("works for admin", async function () {
      const resp = await request(app)
          .delete(`/applications/u1/1`)
          .set("authorization", `Bearer ${a1Token}`);
      expect(resp.body).toEqual({ deleted: "1" });
    });
  
    test("unauth for anon", async function () {
      const resp = await request(app)
          .delete(`/applications/u2/2`);
      expect(resp.statusCode).toEqual(500);
    });
  
    test("not found for no such job", async function () {
      const resp = await request(app)
          .delete(`/applications/u5/999`)
          .set("authorization", `Bearer ${a1Token}`);
      expect(resp.statusCode).toEqual(404);
    });
  });