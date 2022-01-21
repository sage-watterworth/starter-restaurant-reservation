import {useState, useEffect} from "react";
import { useHistory, useParams } from "react-router";
import {getReservation, seatTable, listTables} from "../utils/api"
import ErrorAlert from "./ErrorAlert";

function SeatReservation (){
    const history = useHistory();
    const {reservation_id} = useParams();

    const [reservation, setReservation] = useState([])
    const [table_id, setTable_id] = useState(0);
    const [tables, setTables] = useState([]);
    const [errors, setErrors] = useState(null);
    const submitErrors = [];


useEffect(() => {
    const abortController = new AbortController();
    getReservation(reservation_id)
        .then(setReservation)
        .catch(setErrors)

    listTables()
        .then(setTables)
        .catch(setErrors)
    return () => abortController.abort();
}, [reservation_id]);


function validateSeat () {

const givenTable = tables.find((table) => table.table_id === Number(table_id));
const givenRes = reservation


    if (!givenTable) {
      submitErrors.push("Table does not exist.");
    }
    if (!givenRes) {
        submitErrors.push("Reservation does not exist.");
    }

    if (givenTable.reservation_id) {
        submitErrors.push("Table selected is occupied.");
    }

    if (givenTable.capacity < givenRes.people) {
        submitErrors.push("Table selected cannot seat number of party size.");
    }
console.log(submitErrors)
    if (submitErrors) {
      setErrors(new Error(submitErrors.toString()));
      return false;
    }
        return true;
  }




function submitHandler(event){
     event.preventDefault();
     setErrors(null);
     const abortController = new AbortController();
     if (validateSeat()){
        seatTable(reservation_id, table_id, abortController.signal)
        .then(() => history.push("/dashboard"))
        .catch(setErrors);
    }
    return () => abortController.abort();
    }

const showTables = () => {
    return tables.map((table)=> (
        <option key={table.table_id} value={table.table_id}>
            {table.table_name} - {table.capacity}
        </option>
    )
    )
};

if (tables){

}
    return (
        <>
        <ErrorAlert error={errors} />
        <form onSubmit = {submitHandler}>
          <label className="form-label" htmlFor="table_id">
            Select a table:
          </label>
          <select
            className="form-control"
            name="table_id"
            id="table_id"
            value={table_id}
            onChange={e => setTable_id(e.target.value)}
          >
            <option value={0}>Select a table</option>
            {showTables()}
          </select>

          <button className="btn btn-primary m-1" type="submit">Submit</button>
          <button className="btn btn-danger m-1" type="button" onClick={history.goBack}>
            Cancel
          </button>
        </form>
        </>
      );
    }


    export default SeatReservation;
