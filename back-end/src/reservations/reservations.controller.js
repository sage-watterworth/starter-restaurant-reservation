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
  else{
  const date = req.query.date;
  // const mobile_number = request.query.mobile_number;
  const reservations = await service.list(date/*, mobile_number*/);
  const filteredReservation = reservations.filter((reservation) => reservation.status !== "finished");
  res.json({ data: filteredReservation });
      // res.status(200).json({ data: await service.listByDate(req.query.date) });
    }
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

async function validFutureDate(req,res,next){
    const reservationDate = new Date(
      `${req.body.data.reservation_date} ${req.body.data.reservation_time}:00.000`
    );
    const today = new Date();

    if (reservationDate.getDay() === 2) {
      return next({ status: 400, message: "restaurant is closed on tuesday",
    });
    }

    if (reservationDate < today) {
      return next({ status: 400, message: "reservation must be in the future",
      });
    }

    if (reservationDate.getHours() < 10 || (reservationDate.getHours() === 10 && reservationDate.getMinutes() < 30)) {
      return next({ status: 400, message: "restaurant is not open until 10:30AM",
      });
    }

    if (reservationDate.getHours() > 22 || (reservationDate.getHours() === 22 && reservationDate.getMinutes() >= 30)) {
      return next({ status: 400, message: "restaurant is closed after 10:30PM",
      });
    }

    if (reservationDate.getHours() > 21 || (reservationDate.getHours() === 21 && reservationDate.getMinutes() > 30)) {
      return next({ status: 400, message: "reservation must be made at least an hour before closing (10:30PM)",
      });
    }
else{
  return next();
  }
}


function read(req, res){
  const reservation = res.locals.reservation;
    res.status(200).json({ data: reservation });
  }


async function validateStatus(req, res, next) {
  const reservation = req.body.data
  const reservation_id = res.locals.reservation
  if (!reservation.status) {
    return next({ status: 400, message: "body must include a status field" });
  }

if (reservation.status !== "booked" &&
    reservation.status !== "seated" &&
    reservation.status !== "finished" &&
    reservation.status !== "cancelled") {
    return next({status: 400, message: `status cannot be ${reservation.status}`,
    });
  }
  if (reservation_id.status === "finished") {
    return next({
      status: 400,
      message: `a finished reservation cannot be updated`,
    });
  }
  return next();
}


function validateStatusCreate(req, res, next) {
  const status = req.body.data.status;
  if (status === "finished" || status === "seated") {
    return next({ status: 400, message: "A reservation cannot be created with a status of seated or finished.",
    });
  }
  return next();
}

//Prevents a user from editing a table that has a status of finished.
function validateStatusUpdate(req, res, next) {
  const status = res.locals.reservation.status;
  if (status === "finished") {
    return next({status: 400, message: "A finished reservation cannot be updated.",
    });
  }
  return next();
}

async function updateStatus(req, res) {
  const reservation = req.body.data
  const reservation_id = res.locals.reservation
  await service.update(
    reservation_id.reservation_id,
    reservation.status
  );
  res.status(200).json({ data: { status: reservation.status } });
}

  //validates with: requiredFields and validFields
async function createReservation(req, res){
  const reservation = { ...req.body.data, status: "booked" };
  const response = await service.create(reservation)
  res.status(201).json({data: response});
}



module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(reservationExists),
        read],
  create: [validData,
          asyncErrorBoundary(fieldExists),
          validDate,
          validFutureDate,
          validTime,
          validPeople,
          validateStatusCreate,
          asyncErrorBoundary(createReservation)],

  update: [validData, reservationExists, validateStatus, validateStatusUpdate, updateStatus]
};
