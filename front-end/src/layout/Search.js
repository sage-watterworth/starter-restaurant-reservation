

import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";
import Reservation from "./Reservation";


function Search() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  /**
   * update the state of mobileNumber when the user makes any changes to it
   */
  function handleChange({ target }) {
    setMobileNumber(target.value);
  }

  /** makes a get request to list all reservations under the given mobileNumber **/
  function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    setError(null);

    listReservations({ mobile_number: mobileNumber }, abortController.signal)
      .then(setReservations)
      .catch(setError);

    return () => abortController.abort();
  }


  const searchResultsJSX = () => {
    return reservations.length > 0 ? (
      reservations.map((reservation) => (
        <Reservation
          key={reservation.reservation_id}
          reservation={reservation}
        />
      ))
    ) : (<p>No reservations found</p>);
  };

  return (
    <div>
       <h1 className="font-weight-bold d-flex justify-content-center mt-4 mb-4 pb-4">
          Search
        </h1>
      <form>
        <ErrorAlert error={error} />
        <div className="input-group w-50">
          <input
            className="form-control mr-2 border-dark rounded"
            name="mobile_number"
            id="mobile_number"
            type="tel"
            placeholder="Enter a customer's phone number"
            onChange={handleChange}
            value={FormData.mobile_number}
            required
          />
          <button
            className="btn-xs btn-outline-0 btn-primary rounded px-2 pb-1"
            type="submit"
            onClick={handleSubmit}
          >
          </button>
        </div>
      </form>

            {/* <th key ="{reservation_id}">ID</th>
            <th key ="{reservation_id}">First Name</th>
            <th key ="{reservation_id}">Last Name</th>
            <th key ="{reservation_id}">Mobile Number</th>
            <th key ="{reservation_id}">Date</th>
            <th key ="{reservation_id}">Time</th>
            <th key ="{reservation_id}">People</th>
            <th key ="{reservation_id}">Status</th>
            <th key ="{reservation_id}">Edit</th>
            <th key ="{reservation_id}">Cancel</th>
            <th key ="{reservation_id}">Seat</th> */}
        <div>{searchResultsJSX()}</div>
    </div>
  );
}

export default Search;
