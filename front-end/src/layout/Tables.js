import React from "react";
import { finishTable } from "../utils/api";

function ListTables({table}) {

  if (!table) return null;

  function handleFinish() {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();

      finishTable(
      table.table_id,
      abortController.signal
      )
      return () => abortController.abort();
    }
  }

  return (
    <div>
      <p key ="{table_id}">{table.table_id}</p>
      <p key ="{table_name}">{table.table_name}</p>
      <p key ="{capacity}">{table.capacity}</p>
      <p data-table-id-status={table.table_id}>
        {table.status}
        {table.reservation_id ? table.reservation_id : "--"}
      </p>
      {table.status === "occupied" && (
        <p className="text-center">
          <button
            className="btn btn-sm btn-danger"
            data-table-id-finish={table.table_id}
            onClick={handleFinish}
            type="button"
          >
            Finish
          </button>
        </p>
      )}
    </div>
  );
}

export default ListTables;
