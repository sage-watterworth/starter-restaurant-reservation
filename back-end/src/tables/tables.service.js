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

//   function tableOccupied(table_id, reservation_id){
//       return knex("tables")
//       .where({table_id: table_id})
//       .update({ reservation_id: reservation_id});
//   }

//   function tableFree(table_id) {
//     return knex("tables")
//       .where({ table_id: table_id })
//       .update({ reservation_id: null});
//   }

  function readReservation(reservation_id) {
    return knex("reservations")
      .select("*")
      .where({ reservation_id: reservation_id })
      .first();
  }


  function seatTable(reservation_id) {
    return knex("tables")
      .select("*")
      .where({reservation_id: reservation_id})
      .update({ reservation_id: null})
  }


module.exports = {
    list,
    read,
    create,
    readReservation,
    seatTable
}
