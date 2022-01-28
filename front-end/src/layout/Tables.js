import { useState } from "react";
import { finishTable} from "../utils/api";
import Reservation from "./Reservation"

function ListTables({table, refresh}) {
  // const [reservations, setReservations] = useState();
  // const [error, setError] = useState();

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
        abortController.signal).then(refresh)

        // Reservation()
        // .then(setReservations)
        // .catch(setError);

      return () => abortController.abort();
    }
  }

  return (
  <main>
    <div className="tables-div row mt-10">
      {/* <p key ="{table_id}">{table.table_id}</p> */}
      <p key ="{table_name}">Table: {table.table_name} | </p>

      <p key ="{capacity}">Capacity: {table.capacity} | </p>

      <p data-table-id-status={table.table_id}> Status:
        {table.status}
        {/* {table.reservation_id ? table.reservation_id.last_name : "--"} */}
        </p>
      {table.status === "occupied" && (
        <p className="text-center">
          <button
            className="btn btn-sm btn-info"
            data-table-id-finish={table.table_id}
            onClick={handleFinish}
            type="button"
          >
            Finish
          </button>
        </p>
      )}
      </div>
    </main>
  );
}

export default ListTables;
