import React from "react";
import { Link } from "react-router-dom";
import { updateResStatus } from "../utils/api";

function Reservation({ reservation }) {
  if (!reservation || reservation.status === "finished") return null;


  function handleCancel(e) {
    e.preventDefault();
    if (window.confirm(
        "Do you want to cancel this reservation? This cannot be undone.")
    ) {
      const abortController = new AbortController();

      updateResStatus(
        reservation.reservation_id,
        "cancelled",
        abortController.status
      )
      window.location.reload();
      return () => abortController.abort();
    }
  }


  return (
<main>

<div class="accordion col-sm-6 mt-10" id="accordionExample">
  <div class="card">
    <div class="card-header acc-div" id="headingOne">
      <h2 class="mb-1">
        <button class="btn btn-link btn-block" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
      {reservation.last_name} party of {reservation.people}
      </button>
    </h2>
    <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
      <div class="card-body acc-card text-align-left">
      <p key="{first_name}">First Name: {reservation.first_name}</p>
      <p key="{last_name}">Last Name: {reservation.last_name}</p>
      <p key="{mobile_number}">Phone Number:{reservation.mobile_number}</p>
      <p key="{reservation_date}">Date: {reservation.reservation_date}</p>
      <p key="{reservation_time}">Time: {reservation.reservation_time}</p>
      <p key="{people}">Pary Size: {reservation.people}</p>
      <p key="{status}" data-reservation-id-status={reservation.reservation_id} >Status: {reservation.status}</p>

      {reservation.status === "booked" && (
        <>
        <div class = "row d-flex justify-content-center">
          <div class = "col-sm">
          <h3 >
            <Link to={`/reservations/${reservation.reservation_id}/edit`}>
              <button className="btn btn-sm btn-secondary" type="button">
                Edit
              </button>
            </Link>
          </h3>
        </div>

        <div class = "col-sm">
          <h3>
            <button
              className="btn btn-sm btn-dark"
              type="button"
              onClick={handleCancel}
              data-reservation-id-cancel={reservation.reservation_id}
            >
              Cancel
            </button>
          </h3>
        </div>

        <div class = "col-sm">
          <h3>
          <a href={`/reservations/${reservation.reservation_id}/seat`}>
              <button className="btn btn-sm btn-info" type="button">
                Seat
              </button>
              </a>
          </h3>
        </div>
      </div>
        </>
      )}
      </div>
      </div>
    </div>
  </div>
  </div>
</main>

);

}

export default Reservation;
