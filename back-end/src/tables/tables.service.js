const knex = require("../db/connection");

function list(table_id){
    return knex("tables")
    .select("*")
    .orderBy("table_name")

}

function read(table_id) {
    return knex("tables")
    .select("*")
    .where({ table_id: table_id })
    .first();
  }

  function create(table) {
    return knex("tables")
    .insert(table)
    .returning("*");
  }

  function tableOccupied(table_id, reservation_id){
      return knex("tables")
      .where({table_id: table_id})
      .update({ reservation_id: reservation_id, status: "occupied"});
  }

  function tableFree(table_id) {
    return knex("tables")
      .where({ table_id: table_id })
      .update({ reservation_id: null, status: "free" });
  }

  function readReservation(reservation_id) {
    return knex("reservations")
      .select("*")
      .where({ reservation_id: reservation_id })
      .first();
  }

  function updateReservation(reservation_id, status) {
    return knex("reservations")
      .where({ reservation_id: reservation_id })
      .update({ status: status });
  }



module.exports = {
    list,
    read,
    create,
    tableOccupied,
    tableFree,
    readReservation,
    updateReservation
}
