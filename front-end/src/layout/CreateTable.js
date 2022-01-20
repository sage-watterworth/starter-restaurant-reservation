import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { newTable } from "../utils/api";
import ErrorAlert from "./ErrorAlert"



function CreateTable({ loadDashboard }) {

  const history = useHistory();
  const [error, setError] = useState([]);
  const [tableName, setTableName] = useState()
  const [capacity, setCapacity] = useState()

  const tableData = {
    table_name : tableName,
    capacity : capacity
}

  function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();

    if (validateFields()) {
      newTable(tableData, abortController.signal)
        .then(console.log)
        .then(loadDashboard)
        .then(() =>
            history.push(`/dashboard`))
        .catch(setError);
    }

    return () => abortController.abort();
  }


  function validateFields() {
    let submitError = null;
    if (tableData.table_name === "" || tableData.capacity === "") {
      submitError = { message: `All fields must be completed.`,};
    } else if (tableData.table_name.length < 2) {
        submitError = { message: "table name must contain at least two characters"};
    }
    setError(submitError);
    return submitError === null;
  }


  return (

    <form onSubmit = {handleSubmit}>
    <ErrorAlert error={error}/>
    <div className="mb-3">
        <label htmlFor="tableName" className="table_name">Table Name</label>
        <input
        type="text"
        className="form-control"
        id="table_name"
        name="table_name"
        minLength="2"
        onChange={e => setTableName(e.target.value)}
        value={tableData.table_name}
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
        value={tableData.table_name}
        required
        />
    </div>


  <button type="submit" onClick={handleSubmit} className="btn btn-primary"> Submit </button>
  <button type="cancel" className="btn btn-danger" onClick={history.goBack}> Cancel </button>
</form>
  );
}

export default CreateTable;
