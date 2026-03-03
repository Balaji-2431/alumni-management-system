const DataTable = ({ columns, data }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="overflow-x-auto sm:overflow-visible">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`px-3 py-2 sm:px-6 sm:py-4 text-xs font-semibold text-gray-500 uppercase text-center ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data.length ? (
              data.map((row, r) => (
                <tr key={r} className="hover:bg-gray-50 capitalize">
                  {columns.map((col, c) => (
                    <td
                      key={c}
                      className={`px-3 py-2 sm:px-6 sm:py-4 text-center text-gray-700 break-words ${col.className || ""}`}
                    >
                      {col.cell ? col.cell(row) : row[col.accessor] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-gray-400">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable