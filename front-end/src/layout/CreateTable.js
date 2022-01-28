import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { newTable } from "../utils/api";



function CreateTable({ loadDashboard }) {

  const history = useHistory();
  const [,setError] = useState([]);
  const [tableName, setTableName] = useState("")
  const [capacity, setCapacity] = useState("")

  const tableData = {
    table_name : tableName,
    capacity : +capacity
}

  function submitHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();

    if (validateFields()) {
      newTable(tableData, abortController.signal)
        .then(console.log)
        .then(loadDashboard)
        .then(() =>
            history.push(`/dashboard`))
            .catch(setError)
        }
        return () => abortController.abort();
    }

  //validate all vields are filled out
  function validateFields() {
      let submitError = null;
    if (tableData.table_name === "" || tableData.capacity === "") {
      submitError = { message: `All fields must be completed.`,};
    } else if (tableData.table_name.length < 2) {
        submitError = { message: "table name must contain at least two characters"};
    }
setError(submitError)
return submitError === null;
}


  return (

    <form onSubmit = {submitHandler}>
    <div className="mb-3">
        <label htmlFor="tableName" className="table_name">Table Name</label>
        <input
        type="text"
        className="form-control"
        id="table_name"
        name="table_name"
        minLength="2"
        onChange={e => setTableName(e.target.value)}
        value={tableName}
        required
        />
    </div>

    <div className="mb-3">
        <label htmlFor="capacity" className="capacity">Capacity</label>
        <input
        type="number"
        className="form-control"
        id="capacity"
        name="capacity"
        min="1"
        onChange={e => setCapacity(e.target.value)}
        value={capacity}
        required
        />
    </div>


  <button type="submit" className="btn btn-sm btn-info"> Submit </button>
  <button type="cancel" className="btn btn-sm btn-dark"
 onClick={history.goBack}> Cancel </button>
</form>
  );
}

export default CreateTable;
