const { BadRequestError } = require("../expressError");


/**
 * 
 * @param {search , minEmployees, maxEmployees, minSalary, hasEquity} an object contaning optional search term, minimum number of employees, maximum number of employees.
 * @returns {where : where_statement, values : parameters} a query segment holding the where statement, parameters for the prepared statement.
 */ 
function getWhere(options, table){
    if (!options || Object.keys(options).length === 0 ) return "";

    let where_statement = "WHERE"
    let parameters = [];
    let i = 1; //parameter number

    if (typeof options.search !== "undefined"){
        if(table === "companies"){
            where_statement += ` name ILIKE $${i}`;
            parameters.push('%' + options.search + '%');
            i++;
        }
        if(table ==="jobs"){
            where_statement += ` title ILIKE $${i}`;
            parameters.push('%' + options.search + '%');
            i++;
        }
    }

    //companies query options

    if (typeof options.minEmployees !== "undefined"){
        if (i > 1) where_statement += " AND";
        where_statement += ` num_employees >= $${i}`;
        parameters.push(options.minEmployees);
        i++;
    }

    if (typeof options.maxEmployees !== "undefined"){
        if (i > 1) where_statement += " AND";
        where_statement += ` num_employees <= $${i}`;
        parameters.push(options.maxEmployees);
    }

    //jobs query options

    if (typeof options.minSalary !== "undefined"){
        if (i > 1) where_statement += " AND";
        where_statement += ` salary >= $${i}`;
        parameters.push(options.minSalary);
        i++;
    }

    if (options.hasEquity){
        if (i > 1) where_statement += " AND";
        where_statement += ` equity > 0`;
    }

    //application query options
    if (typeof options.username !== "undefined"){
        if (i > 1) where_statement += " AND";
        where_statement += ` username = $${i}`;
        parameters.push(options.username);
        i++;
    }
    if (typeof options.jobID !== "undefined"){
        if (i > 1) where_statement += " AND";
        where_statement += ` job_id = $${i}`;
        parameters.push(options.jobID);
    }

    return {where : where_statement, values : parameters}
}

module.exports = { getWhere };