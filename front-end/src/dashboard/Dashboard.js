import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import {today, previous, next} from "../utils/date-time"
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const history = useHistory();
  const dateQuery = useQuery().get("date");
  if (dateQuery) {
    date = dateQuery;
  }

  useEffect(loadDashboard, [date]);

function loadDashboard() {
  const abortController = new AbortController();
  setReservationsError(null);
  listReservations({ date }, abortController.signal)
    .then(setReservations)
    .catch(setReservationsError);
  return () => abortController.abort();
}


    /** uses:
     * previous() to set the reservations' list date to be the previous day
     * next() to set the reservations' list date to be the following day
     * today() to set reservation's list date to current day
     */
function handleClick({ target }) {
let newDate;
let useDate;

    if (!date) {
      useDate = today();
    } else {
      useDate = date;
    }

    if (target.name === "previous") {
      newDate = previous(useDate);
    } else if (target.name === "next") {
      newDate = next(useDate);
    } else {
      newDate = today();
    }

    history.push(`/dashboard?date=${newDate}`);
  }

console.log(reservations)
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>


        <button
            className="btn-xs rounded btn-success btn-outline-success m-1 text-white"
            type="button"
            name="today"
            onClick={handleClick}
          >
            Today
          </button>

          <button
            className="btn-xs rounded btn-success btn-outline-success m-1 text-white"
            type="button"
            name="next"
            onClick={handleClick}
          >
            Tomorrow
          </button>


      </div>
      <ErrorAlert error={reservationsError} />
      {reservations.map (res => <>
      <li key="{first_name}">{res.first_name}</li>
      <li key="{last_name}">{res.last_name}</li>
      <li key="{mobile_number}">{res.mobile_number}</li>
      <li key="{reservation_date}">{res.reservation_date.substr(0, 10)}</li>
      <li key="{reservation_time}">{res.reservation_time.substr(0, 5)}</li>
      <li key="{people}">{res.people}</li>
      <li key="{status}">{res.status}</li>
      </>)}
    </main>
  );
}

export default Dashboard;
