/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
  const data = await service.list();
  res.json({data});
}

module.exports = {
  list: asyncErrorBoundary(list)
};
