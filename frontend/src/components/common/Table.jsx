const Table = ({ columns = [], rows = [], emptyMessage = "No data found.", className = "" }) => {
  return (
    <div className={`erp-card overflow-hidden ${className}`}>
      <div className="erp-scrollbar overflow-x-auto">
        <table className="erp-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={column.numeric ? "tabular-nums text-right" : ""}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-10 text-center text-text-muted" colSpan={Math.max(columns.length, 1)}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={row.id || index} className="border-b border-border hover:bg-background transition-colors">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`text-text-secondary ${column.numeric ? "tabular-nums text-right" : ""}`}
                    >
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;