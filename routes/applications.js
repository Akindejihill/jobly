"user strict";

/** Routes for applications. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");
const { ensureAdmin } = require("../middleware/auth");
const Application = require("../models/application");

const applicationNewSchema = require("../schemas/applicationNew.json");

const router = new express.Router();

/** POST *
 * See Users routes
*/



  /** GET /  
 * Recieves query ?search=string&maxEmployees=num&minEmployees=num
 * => { companies: [ { handle, name, description, numEmployees, logoUrl }, ...] }
 *vvvvvvvvvv
 * Can filter on provided search filters:
 * - minEmployees
 * - maxEmployees
 * - nameLike (will find case-insensitive, partial matches)
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
    try {
      const applications = await Application.findAll(req.query);
      return res.json({ applications });
    } catch (err) {
      return next(err);
    }
  });



/** DELETE /[username]/[jobID]  =>  { deleted: id }
 *
 * Authorization: admin
 */

router.delete("/:username/:jobID", ensureAdmin, async function (req, res, next) {
    try {
      await Application.remove({ username : req.params.username, jobID : req.params.jobID });
      return res.json({ deleted: req.params.jobID });
    } catch (err) {
      return next(err);
    }
  });






  module.exports = router;