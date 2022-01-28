

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { listReservations} from "../utils/api";
import { listTables } from "../utils/api";
import ListTables from "../layout/Tables";
import {today, previous, next} from "../utils/date-time"
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
// import { formatAsTime, formatAsDate} from "../utils/date-time";
import Reservation from "../layout/Reservation";
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

  return (
    <main>
      <div className="jumbotron">
      <h1 className="display-4">Reservations</h1>
      <div className="d-md-flex mb-1">
        <h4 className="mb-0 lead">View by date: </h4>
      </div>
      <hr className="my-4"/>
      <div>
      <button
            className="button-grey"
            type="button"
            name="previous"
            onClick={handleClick}
          >
            Yesterday
          </button>
        <button
            className="button-grey"
            type="button"
            name="today"
            onClick={handleClick}
          >
            Today
          </button>

          <button
            className="button-grey"
            type="button"
            name="next"
            onClick={handleClick}
          >
            Tomorrow
          </button>
      </div>
      </div>

      <ErrorAlert error={reservationsError} />
{reservations.filter(res=> res.status !== "cancelled").map (res => <Reservation reservation = {res} />)}

{tables.map (tab => <ListTables table={tab} refresh={()=>history.go(0)}/>)}


    </main>
  );
}

export default Dashboard;
