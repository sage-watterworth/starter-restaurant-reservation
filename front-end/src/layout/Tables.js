import { finishTable} from "../utils/api";


function ListTables({table, refresh}) {

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

      return () => abortController.abort();
    }
  }

  return (
  <main>
      <div className="col-md-6 col-lg-3 mt-4">
        <div className="card shadow pb-5 mb-4" style={{ width: "18rem" }}>
         <p key ="{table_name}" className="card-title mt-4 align-center">Table: {table.table_name} </p>
      <div className="card-body">
       <p key ="{capacity}">Capacity: {table.capacity} </p>
       <p data-table-id-status={table.table_id}> Status: {table.status}</p>
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
      </div>
      </div>
    </main>
  );
}

export default ListTables;
