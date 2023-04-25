"use strict";
const db = require("../db");
//const Decimal = require('decimal.js');
const { BadRequestError, NotFoundError } = require("../expressError");
const { getWhere } = require("../helpers/where");

class Application{


    /** Place an application, update the db and return new application data
     * 
     * Takes {username, jobID}
     * 
     * Returns {username. jobID}
     */
    static async place({ username, jobID}) {
        const result = await db.query(
              `INSERT INTO applications
               (username, job_id)
               VALUES ($1, $2)
               RETURNING username, job_id AS "jobID"`,
            [
              username,
              jobID
            ],
        );
        const application = result.rows[0];
    
        return application;
      }  


    /** Find [all] jobs.
   * 
   * Returns [{id, title, salary, equity, companyHandle}, ...]
   * */

    static async findAll(options) {
      const { where , values } = getWhere(options, "applications");
      console.log(`\n\nWhere and values: ${where}, ${values}`);
      const sqlq = `SELECT username,
      job_id AS "jobID"
      FROM applications
      ${where}
      ORDER BY username`;
      const applicationsRes = await db.query(sqlq, values);
      console.log(`SQL: `, sqlq)
      console.log(`\n\nRows: ${Object.keys(applicationsRes.rows[0])}`);
      console.log(`\n\nRows: ${Object.values(applicationsRes.rows[0])}`);
      return applicationsRes.rows;
    }



 /** Delete given job from database; returns undefined.
   *
   * Throws NotFoundError if job not found.
   **/

  static async remove({username, jobID}) {
    const result = await db.query(
          `DELETE
          FROM applications
          WHERE username = $1 AND job_id = $2
          RETURNING username, job_id AS "jobID"`,
        [username, jobID]);
    const application = result.rows[0];

    if (!application) throw new NotFoundError(`No such application`);
  }


}




module.exports = Application;