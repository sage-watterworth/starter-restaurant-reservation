const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const requiredFields = [
    table_name,
    capacity
]

// if the table capacity is less than the number of people in the reservation, return 400 with an error message.
// if the table is occupied, return 400 with an error message.

module.exports = {

  };
