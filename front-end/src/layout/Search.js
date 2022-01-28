

import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";
import Reservation from "./Reservation";


function Search() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  //update the state of mobile number when the user makes any changes to it
  function handleChange({ target }) {
    setMobileNumber(target.value);
  }

  // sends a get request to list all reservations under the specified mobile number
  function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    setError(null);

    listReservations({ mobile_number: mobileNumber }, abortController.signal)
      .then(setReservations)
      .catch(setError);

    return () => abortController.abort();
  }

  // return search results from get request
  const searchResults = () => {
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
      <div >
      <h1 className="d-flex justify-content-center mt-4 mb-4 pb-4 display-4 header-font">Search Reservations</h1>
      </div>
      <form className = "form-style">
        <ErrorAlert error={error} />
        <div className="input-group w-75 justify-content-center">
          <input
            className="form-control mr-2 border-dark rounded"
            name="mobile_number"
            id="mobile_number"
            type="tel"
            placeholder="Enter a reservation phone #"
            onChange={handleChange}
            value={FormData.mobile_number}
            required
          />
          <button
            className="button-grey"
            type="submit"
            onClick={handleSubmit}
          > Search </button>
        </div>
      </form>
        <div>{searchResults()}</div>
    </div>
  );
}

export default Search;
