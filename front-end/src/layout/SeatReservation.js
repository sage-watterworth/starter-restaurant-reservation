import {useState, useEffect} from "react";
import { useHistory, useParams } from "react-router";
import {listReservations, seatTable} from "../utils/api"
import ErrorAlert from "./ErrorAlert";

function SeatReservation ({tables, loadDashboard}){
    const history = useHistory();
    const {reservation_id} = useParams();

    const [reservation, setReservation] = useState([])
    const [table_id, setTable_id] = useState(0);
    const [resError, setResError] = useState([]);
    const [errors, setErrors] = useState([]);


useEffect(() => {
    const abortController = new AbortController();
    setResError(null);
    listReservations(null, abortController.signal)
        .then(setReservation)
        .catch(setResError)
    return () => abortController.abort();
}, []);
if (!tables || !reservation) return null;



function validateSeat () {
    const submitErrors = [];

const givenTable = tables.find((table) => table.table_id === +(table_id));
const givenRes = reservation.find((res)=> res.reservation_id === +(reservation_id));

if(!givenTable){
    submitErrors.push("Table does not exist");
}
else{
    if (givenTable.status === "occupied"){
        submitErrors.push("This table is occupied")
}
else{
    if (givenTable.capacity < givenRes.people){
        submitErrors.push("This table capacity is not large enough")
}

else {
   if (!givenRes){
   submitErrors.push("reservation does not exist");
}

         }
    }
}

setErrors(submitErrors)
return submitErrors.length === 0;

}

function submitHandler(event){
     event.preventDefault();
     const abortController = new AbortController();
     if (validateSeat()){
        seatTable(table_id, reservation_id, abortController.signal)
        .then(loadDashboard)
        .then(()=> history.pushState(`/dashboard`))
        .catch(setErrors)
    }
    return () => abortController.abort();
    }

const returnError = () => {
    return errors.map((error, idx) => <ErrorAlert key={idx} error={error} />);
    };

const showTables = () => {
    return tables.map((table)=> (
        <option key={table.table_id} value={table.table_id}>
            {table.table_name} : {table.capacity}
        </option>
    )
    )
};

    return (
        <form onSubmit = {submitHandler}>
          {returnError()}
          <ErrorAlert error={resError} />

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

          <button className="btn btn-success m-1" type="submit">Submit</button>
          <button className="btn btn-danger m-1" type="button" onClick={history.goBack}>
            Cancel
          </button>
        </form>
      );
    }

    export default SeatReservation;
