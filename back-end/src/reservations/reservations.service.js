const knex = require("../db/connection");


function list(date, mobile_number) {
  if (date) {
    return knex("reservations")
      .select("*")
      .where({ reservation_date: date })
      .orderBy("reservation_time", "asc");
  }
  if (mobile_number){
      return knex("reservations")
        .whereRaw(
          "translate(mobile_number, '() -', '') like ?",
          `%${mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date");
    }
    return knex("reservations").select("*");
  }


function read(id) {
    return knex("reservations")
    .select("*")
    .where({ reservation_id: id });
  }

function create(reservation) {
  return knex("reservations")
  .insert(reservation, "*")
  .then((response) => response[0]);
}

function update(reservation_id, status){
  return knex("reservations")
  .where({ reservation_id: reservation_id })
  .update({ status: status });
}

  module.exports = {
    list,
    read,
    create,
    update
}
