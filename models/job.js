"use strict";
const db = require("../db");
const Decimal = require('decimal.js');
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { getWhere } = require("../helpers/where");

class Job{


    /** Create a job, update the db and return new job data
     * 
     * Takes {title, salary, equity, companyHandle)}
     * 
     * Returns {id, title, salary, equity, companyHandle}
     */
    static async create({ title, salary, equity, companyHandle}) {
        if (equity > 1) throw new BadRequestError("Equity can't be more than 1");
        const result = await db.query(
              `INSERT INTO jobs
               (title, salary, equity, company_handle)
               VALUES ($1, $2, $3, $4)
               RETURNING id, title, salary, equity, company_handle AS "companyHandle"`,
            [
              title,
              salary,
              equity,
              companyHandle,
            ],
        );
        const job = result.rows[0];
    
        return job;
      }  


    /** Find all jobs.
   * 
   * Returns [{id, title, salary, equity, companyHandle}, ...]
   * */

    static async findAll(options) {
      const { where , values } = getWhere(options, "jobs");
      const jobsRes = await db.query(
            `SELECT id,
                    title,
                    salary,
                    equity,
                    company_handle AS "companyHandle"
             FROM jobs
             ${where}
             ORDER BY title`, values);
      return jobsRes.rows;
    }


   /** Given a job id.
   *
   * Returns the job like [{id, title, salary, equity, companyHandle }]
   * Throws NotFoundError if not found.
   **/

   static async get(id) {
    const jobRes = await db.query(
          `SELECT id,
                  title,
                  salary,
                  equity,
                  company_handle AS "companyHandle"
           FROM jobs
           WHERE id = $1`,
        [id]);

    const job = jobRes.rows[0];
 
    if (!job) throw new NotFoundError(`No job: ${id}`);

    return job;
  }



   /** Given a company handle.
   *
   * Returns list of jobs for a company like [{id, title, salary, equity, companyHandle }]
   * Throws NotFoundError if not found.
   **/

  static async get_by_company(handle) {
    const jobRes = await db.query(
          `SELECT id,
                  title,
                  salary,
                  equity,
                  company_handle AS "companyHandle"
           FROM jobs
           WHERE company_handle = $1`,
        [handle]);

    const jobs = jobRes.rows;
 
    if (jobs.length === 0) throw new NotFoundError(`No company: ${handle}`);

    return jobs;
  }


    /** Update job data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {title, salary, equity}
   *
   * Returns {handle, name, description, numEmployees, logoUrl}
   *
   * Throws NotFoundError if not found.
   */

    static async update(id, data) {
      const { setCols, values } = sqlForPartialUpdate(
          data,
          {});
      const querySql = `UPDATE jobs 
                        SET ${setCols} 
                        WHERE id = ${id} 
                        RETURNING id, 
                                  title, 
                                  salary, 
                                  equity,
                                  company_handle AS "companyHandle"`; 
      const result = await db.query(querySql, [...values]);
      const job = result.rows[0];
  
      if (!job) throw new NotFoundError(`No job: ${id}`);
  
      return job;
    }


 /** Delete given job from database; returns undefined.
   *
   * Throws NotFoundError if job not found.
   **/

  static async remove(id) {
    const result = await db.query(
          `DELETE
          FROM jobs
          WHERE id = $1
          RETURNING id`,
        [id]);
    const job = result.rows[0];

    if (!job) throw new NotFoundError(`No job: ${id}`);
  }


}




module.exports = Job;