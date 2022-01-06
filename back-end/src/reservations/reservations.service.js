const knex = require("../db/connection");


function list(reservation_id){
    return knex("reservations")
    .select("*")
  }
  module.exports = {
    list
}
