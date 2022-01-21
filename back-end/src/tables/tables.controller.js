const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function validData (req, res, next){
    if (!req.body.data) {
        return next({ status: 400, message: "Body must include data" });
    }
    else{
        return next();
    }
}

async function validFields (req, res, next){
    if (!req.body.data.table_name || req.body.data.table_name === "") { // validate table_name is included and more than 2 characters
        return next({ status: 400, message: "'table_name' cannot be empty",});
      }
    if (req.body.data.table_name.length < 2) {
    return next({ status: 400, message: "'table_name' must be at least 2 characters",});
    }

    if (!req.body.data.capacity || req.body.data.capacity === "") { //validate capacity is included and is a number
        return next({ status: 400, message: "'capacity' cannot be empty",});
      }
    if (typeof req.body.data.capacity !== "number") {
    return next({ status: 400, message: "'capacity' must be a number",});
    }
    if (req.body.data.capacity < 1) {
    return next({status: 400, message: "'capacity' must be at least 1"});
    }
    else{
        return next ();
    }
}


async function listTables(req, res) {
    const tables = await service.list();
    res.json({ data: tables });
  }


async function create (req, res){ // creates a new table
    const status = req.body.data.reservation_id ? "occupied" : "free"
    const newTable = { ...req.body.data, status };
    const response = await service.create(newTable)
    res.status(201).json({ data: response[0] });
}

async function validateReservation (req, res, next){
    const { reservation_id } = req.body.data;
    if (!reservation_id) {
        return next({status: 400, message: `reservation_id field must be included in the body`,});
    }

    const reservation = await service.readReservation(Number(reservation_id));
    if (!reservation) {
        return next({status: 404, message: `reservation_id ${reservation_id} does not exist`,});
    }
    res.locals.reservation = reservation;
    return next();
  }

async function validateTableId(req, res, next) {
    const { table_id } = req.params;
    const table = await service.read(table_id);

    if (!table) {
      return next({status: 404, message: `table id ${table_id} does not exist`,});
    }
    res.locals.table = table;
    next();
  }

async function validateTableSeats (req, res, next){
    if (res.locals.table.status === "occupied") {
        return next({
          status: 400,
          message: "the table you selected is currently occupied",
        });
      }

      if (res.locals.reservation.status === "seated") {
        return next({
          status: 400,
          message: "the reservation you selected is already seated",
        });
      }

      if (res.locals.table.capacity < res.locals.reservation.people) {
        return next({
          status: 400,
          message: `the table you selected does not have enough capacity to seat ${res.locals.reservation.people} people`,
        });
      }

      next();
    }


async function seatTable (req, res){
    const table_id = res.locals.table.table_id;
    const reservation_id = res.locals.reservation.reservation_id;
        await service.occupy(table_id, reservation_id);
        await service.updateReservationStatus(reservation_id, "seated");
        res.status(200).json({ data: res.locals.table });
    }

async function destroy (req, res, next){
    const table_id = res.locals.table
    if(table_id.status !== "occupied"){
        return next({status: 400, message: "Table is not occupied"})
    }
    else {
    await service.free(table_id.table_id);
        await service.updateReservationStatus(table_id.reservation_id, "finished");

    res.status(200).json({data: {status: "free"}});
    }

}


module.exports = {
    list: [asyncErrorBoundary(listTables)],

    update: [asyncErrorBoundary(validData),
            asyncErrorBoundary(validateTableId),
            asyncErrorBoundary(validateReservation),
            asyncErrorBoundary(validateTableSeats),
            asyncErrorBoundary(seatTable)],

    create: [validData, validFields, create],

    destroy: [validateTableId, destroy],

  };
