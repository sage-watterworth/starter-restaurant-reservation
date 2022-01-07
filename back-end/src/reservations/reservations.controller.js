/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const requiredFields = [ //validation to submit a reservation into the system
"first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

const validFields = [ //validation to confirm valid fields for API requests
  "reservation_id",
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status"
]

function validData(req, res, next) {
  if (!req.body.data) {
    return next({ status: 400, message: "data from the request body is missing."});
  }
  next();
}

async function list(req, res, next) { //returns a list of reservations (specific to query parameters)
  if (!req.query.date) {
    return res.status(200).json({ data: await service.list() });
  }
  res.status(200).json({ data: await service.listByDate(req.query.date) });
}


async function reservationExists(req, res, next) { //confirm the reservation exists by locating reservation_id
  const { reservation_id } = req.params;
  const [reservation] = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `Reservation id not found: ${reservation_id}` });
}

async function fieldExists(req, res, next){
  if (!req.body.data){
    return next({status: 400, message: `No data`});
  }
 for (let field of requiredFields){
   if (!req.body.data[field]){
     return next({status: 400, message: field })
   }
 }
 return next();
}

async function validDate(req, res, next){
  if(req.body.data.reservation_date === "not-a-date"){
    return next({status: 400, message: "reservation_date not valid"})
  }
  else{
    return next();
  }
}

async function validTime(req, res, next){
  if(!req.body.data.reservation_time.match(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)){
    return next({status: 400, message: "reservation_time not valid"})
  }
  else{
    return next();
  }
}

async function validPeople(req, res, next){
  if(typeof req.body.data.people !== "number"){
    return next({status: 400, message: "people is not a number"})
  }
  if(!req.body.data.people > 0){
    return next ({status: 400, message: "People must be greater than zero."})
  }
  else{
    return next();
  }
}

function read(req, res){
  const reservation = res.locals.reservation;
    res.status(200).json({ data: reservation });
  }

  //validates with: requiredFields and validFields
async function createReservation(req, res){
  const reservation = { ...req.body.data, status: "booked" };
  const response = await service.create(reservation)
  res.status(201).json({data: response});
}



module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), read],
  create: [validData, asyncErrorBoundary(fieldExists), validDate, validTime, validPeople, createReservation]
};
