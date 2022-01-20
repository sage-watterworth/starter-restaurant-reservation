import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import { listTables } from "../utils/api";
import {today, previous, next} from "../utils/date-time"
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { formatAsTime, formatAsDate} from "../utils/date-time"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [, setError] = useState();

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

useEffect(() => {
  const abortController = new AbortController();

  async function loadTables() {
    try {
      setError([]);
      const tablesList = await listTables(abortController.signal);
      setTables(tablesList);
    } catch (error) {
      setTables([]);
      setError([error.message]);
    }
  }
  loadTables();
  return () => abortController.abort();
}, []);

    /*
    allow user to toggle between yesterday, today, and tomorrow's reservations
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
            name="previous"
            onClick={handleClick}
          >
            Yesterday
          </button>
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
      {reservations.map (res => <ul key = {res.reservation_id}>
      <li key="{first_name}">{res.first_name}</li>
      <li key="{last_name}">{res.last_name}</li>
      <li key="{mobile_number}">{res.mobile_number}</li>
      <li key="{reservation_date}">{formatAsDate(res.reservation_date)}</li>
      <li key="{reservation_time}">{formatAsTime(res.reservation_time)}</li>
      <li key="{people}">{res.people}</li>
      <li key="{status}">{res.status}</li>
      </ul>)}
<div>
{tables.map (tab => <ul key = {tab.table_id}>
        <li key="{table_name}">{tab.table_name}</li>
        <li key="{capacity}">{tab.capacity}</li>
      </ul>)}
</div>



    </main>
  );
}

export default Dashboard;
