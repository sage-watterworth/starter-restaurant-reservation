import React, {useState} from "react";
import {createReservation} from "../utils/api"
import { useHistory } from "react-router-dom";
import ErrorAlert from "./ErrorAlert"

function ReservationForm({loadDashboard}){
const history = useHistory();

const [firstName, setFirstName] = useState("")
const [lastName, setLastName] = useState("")
const [mobileNumber, setMobileNumber] = useState("")
const [reservationTime, setReservationTime] = useState("")
const [reservationDate, setReservationDate] = useState("")
const [people, setPeople] = useState("")
const [errors, setErrors] = useState([])

const newReservation = {
    first_name : firstName,
    last_name : lastName,
    mobile_number : mobileNumber,
    reservation_time : reservationTime,
    reservation_date : reservationDate,
    people : +people
}

function submitHandler(e){
    e.preventDefault()
    const abortController = new AbortController();
    const submitError = [];

    if (validateDate(submitError) && validateFormFields(submitError)){
        createReservation(newReservation, abortController.signal)
        .then(console.log)
        .then(loadDashboard)
        .then(() =>
                history.push(`/dashboard?date=${newReservation.reservationDate}`)
              )
        .catch(setErrors)
    }
    setErrors(submitError);
    return () => abortController.abort();
}


function validateFormFields(submitError){
    for(const field in newReservation){
        if (newReservation[field] === ""){
            submitError.push({message: `${field} cannot be left empty.`});
        }
    }
return submitError.length === 0;
}

function validateDate(submitError){
        const newReservationDate = new Date(
          `${newReservation.reservation_date} ${newReservation.reservation_time}:00.000`
        );
        const today = new Date();

        if (newReservationDate.getDay() === 2) {
            submitError.push({message: "resturant is closed on Tuesday"});
        }

        if (newReservationDate < today) {
            submitError.push({message: "please make a reservation for a future date"});
        }

        if (newReservationDate.getHours() < 10 || (newReservationDate.getHours() === 10 && newReservationDate.getMinutes() < 30)) {
            submitError.push({message: "restaurant is not open until 10:30AM"});
        }

        if (newReservationDate.getHours() > 22 || (newReservationDate.getHours() === 22 && newReservationDate.getMinutes() >= 30)) {
            submitError.push({message: "restaurant is closed after 10:30PM"});
        }

        if (newReservationDate.getHours() > 21 || (newReservationDate.getHours() === 21 && newReservationDate.getMinutes() > 30)) {
            submitError.push({message: "reservation must be made at least an hour before closing (10:30PM)"});
        }
    return submitError.length === 0;
}

const returnError = () => {
    return errors.map((error, idx) => <ErrorAlert key={idx} error={error} />);

  };


return (

    <form onSubmit = {submitHandler}>
    {returnError()}
  <div className="mb-3">
    <label htmlFor="firstName" className="form-label">
        First Name</label>
    <input
    type="text"
    className="form-control"
    id="first_name"
    name="first_name"
    value= {firstName}
    placeholder= "First Name"
    onChange={e => setFirstName(e.target.value)}
    required />
  </div>
  <div className="mb-3">
    <label htmlFor="lastName" className="form-label">
        Last Name</label>
    <input
    type="text"
    className="form-control"
    id="last_name"
    name="last_name"
    value= {lastName}
    placeholder= "Last Name"
    onChange={e => setLastName(e.target.value)}

    required />
  </div>
  <div className="mb-3">
    <label htmlFor="mobile_number" className="form-label">
            Mobile Number</label>
        <input
        type="tel"
        className="form-control"
        id="mobile_bumber"
        name="mobile_number"
        value= {mobileNumber}
        onChange={e => setMobileNumber(e.target.value)}
        placeholder= "111-222-3456"
        required />
  </div>
  <div className="mb-3">
  <label htmlFor="reservation_date" className="form-label">
            Reservation Date</label>
        <input
        type="date"
        className="reservation-date"
        id="reservation-date"
        name="reservation_date"
        value= {reservationDate}
        onChange={e => setReservationDate(e.target.value)}
        required />
  </div>
  <div className="mb-3">
    <label htmlFor="reservation_time" className="form-label">
            Reservation Time</label>
        <input
        type="time"
        className="form-control"
        id="reservation_time"
        name="reservation_time"
        value= {reservationTime}
        onChange={e => setReservationTime(e.target.value)}
        required />
  </div>
  <div className="mb-3">
    <label htmlFor="people" className="form-label">
            Party Size</label>
        <input
        type="number"
        className="form-control"
        id="people"
        name="people"
        value= {people}
        onChange={e => setPeople(e.target.value)}
        min={1}
        required />
  </div>
  <button type="submit" className="btn btn-primary">Submit</button>
  <button type="cancel" className="btn btn-primary" onClick={history.goBack}
>Cancel</button>

</form>

)
}



export default ReservationForm;
