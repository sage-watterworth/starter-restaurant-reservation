import React from "react";
import { Link } from "react-router-dom";
import { updateResStatus } from "../utils/api";

function Reservation({ reservation }) {
  if (!reservation || reservation.status === "finished") return null;



  function handleCancel() {
    if (window.confirm(
        "Do you want to cancel this reservation? This cannot be undone.")
    ) {
      const abortController = new AbortController();

      updateResStatus(
        reservation.reservation_id,
        "cancelled",
        abortController.status
      )

      return () => abortController.abort();
    }
  }


  return (
<main>
    <div>
    <h2 key="{reservation_id}">{reservation.reservation_id}</h2>
      <p key="{first_name}">{reservation.first_name}</p>
      <p key="{last_name}">{reservation.last_name}</p>
      <p key="{mobile_number}">{reservation.mobile_number}</p>
      <p key="{reservation_date}">{reservation.reservation_date}</p>
      <p key="{reservation_time}">{reservation.reservation_time}</p>
      <p key="{people}">{reservation.people}</p>
      <p key="{status}">{reservation.status}</p>

    </div>
      {reservation.status === "booked" && (
        <>
          <h3 >
            <Link to={`/reservations/${reservation.reservation_id}/edit`}>
              <button className="btn btn-sm btn-primary" type="button">
                Edit
              </button>
            </Link>
          </h3>

          <h3>
            <button
              className="btn btn-sm btn-danger"
              type="button"
              onClick={handleCancel}
              data-reservation-id-cancel={reservation.reservation_id}
            >
              Cancel
            </button>
          </h3>

          <h3>
          <a href={`/reservations/${reservation.reservation_id}/seat`}>
              <button className="btn btn-sm btn-success" type="button">
                Seat
              </button>
              </a>
          </h3>
        </>
      )}
</main>

);

}

export default Reservation;
