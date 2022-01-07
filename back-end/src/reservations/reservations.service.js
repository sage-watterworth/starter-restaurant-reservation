const knex = require("../db/connection");


function list(reservation_id){
    return knex("reservations")
    .select("*")
}

function listByDate(date) {
    return knex("reservations")
      .select("*")
      .where({ reservation_date: date })
      .orderBy("reservation_time", "asc")
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

  module.exports = {
    list,
    listByDate,
    read,
    create
}
