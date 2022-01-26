import React, {useState, useEffect} from "react";
import {createReservation, editReservation, getReservation} from "../utils/api"
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "./ErrorAlert"

function ReservationForm(){
const history = useHistory();
const { reservation_id } = useParams();

const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
}

const [form, setForm] = useState({...initialFormState});
const [errors, setErrors] = useState([])


useEffect(() => {
    const abortController = new AbortController();

    if (reservation_id) {
        async function loadReservation() {
            try {
                const reservation = await getReservation(reservation_id, abortController.status);
                setForm(reservation);
            } catch (error) {
                setErrors([error.message]);
                console.log(error)
            }
        }
        loadReservation();
    }
    return () => abortController.abort();
}, [reservation_id]);




const handleChange = ({ target }) => {
    setErrors([])
    for (const field in form) {
        if (form[field] === "") {
          errors.push({
            message: `${field.split("_").join(" ")} cannot be left blank.`,
          });
        }
    }
    for (const field in form) {
    if (form[field] === "reservation_date") {
        const newDate = new Date(`${form.reservation_date} ${form.reservation_time}:00.000`);
        const currentTime = Date.now();

        if (newDate.getDay() === 2 && newDate < currentTime) {
            setErrors([ "The restaurant is closed on Tuesday.", "Reservation must be in the future."]);
        } else if (newDate.getDay() === 2) {
            setErrors(["The restaurant is closed on Tuesday."]);
        } else if (newDate < currentTime) {
            setErrors(["Reservation must be in the future."]);
        } else {
            setErrors([]);
        }
    }
}
    // validate reservation time is during open hours
    for (const field in form) {
    if (form[field] === "reservation_time") {
        const open = 1030;
        const close = 2130;
        const reservation = form.reservation_time.substring(0, 2) + form.reservation_time.substring(3);
        if (reservation > open && reservation < close) {
            setErrors([]);
        } else {
            setErrors(["Please create a reservation between 10:30am and 9:30pm."]);
        }
    }
    setForm({
        ...form,
        [target.name]: target.name === "people" ? Number(target.value) : target.value,
         });
    }
}



function submitHandler(e){
    e.preventDefault();
    const abortController = new AbortController();

    // POST request (new reservation)
    if (!reservation_id) {
        async function postData() {
            try {
                await createReservation(form, abortController.signal);
                history.push(`/dashboard?date=${form.reservation_date}`);
            } catch (error) {
                setErrors([...errors, error.message]);
            }
        }
        // do not send POST request if there is a pending error message
        if (errors.length === 0) {
            postData();
        }
    }
    // PUT request (edit reservation)
    if (reservation_id) {
        async function putData() {
            try {
                setErrors([]);
                await editReservation(reservation_id, form, abortController.signal);
                history.push(`/dashboard?date=${form.reservation_date}`);
            } catch (error) {
                setErrors([...errors, error.message]);
            }
        }
        // do not send PUT request if there is a pending error message
        if (errors.length === 0) {
            putData();
            }
        }
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
    value= {form.first_name}
    placeholder= "First Name"
    onChange={handleChange}
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
    value= {form.last_name}
    placeholder= "Last Name"
    onChange={handleChange}

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
        value= {form.mobile_number}
        onChange={handleChange}
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
        value= {form.reservation_date}
        onChange={handleChange}
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
        value= {form.reservation_time}
        onChange={handleChange}
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
        value= {+form.people}
        onChange={handleChange}
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
