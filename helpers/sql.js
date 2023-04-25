const { BadRequestError } = require("../expressError");

/**
 * Formats a set of key/value pairs to fit into an SQL query
 * by making a list of the column names, and a list of the values
 * @param {*} dataToUpdate the data, properties and their values, to update the database with
 * @param {*} jsToSql contains the actual database column names that correspond to the javascript properties.      
 * @returns A partial SQL string to specifying which columns to update and the list of values
 */
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
