const Table = ({ columns = [], rows = [], emptyMessage = "No data found.", className = "" }) => {
  // "actions" is rendered as a normal cell on desktop, but gets its own full-width
  // row (instead of a cramped label:value line) in the mobile card layout below.
  const dataColumns = columns.filter((c) => c.key !== "actions");
  const actionsColumn = columns.find((c) => c.key === "actions");

  return (
    <div className={`erp-card overflow-hidden ${className}`}>
      {/* Desktop / tablet: real table, horizontally scrollable as a last resort */}
      <div className="hidden md:block erp-scrollbar overflow-x-auto">
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

      {/* Mobile: one card per row instead of a horizontally-scrolling table */}
      <div className="md:hidden">
        {rows.length === 0 ? (
          <div className="px-4 py-10 text-center text-text-muted text-sm">{emptyMessage}</div>
        ) : (
          <div className="divide-y divide-border">
            {rows.map((row, index) => (
              <div key={row.id || index} className="p-4 space-y-2.5">
                {dataColumns.map((column) => (
                  <div key={column.key} className="flex items-start justify-between gap-3">
                    <span className="text-xs font-medium text-text-muted flex-shrink-0 pt-0.5">{column.label}</span>
                    <span className={`text-sm text-text-primary text-right min-w-0 ${column.numeric ? "tabular-nums" : ""}`}>
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </span>
                  </div>
                ))}
                {actionsColumn && (
                  <div className="pt-1.5 flex flex-wrap justify-end gap-2 border-t border-border/60 mt-2.5 pt-2.5">
                    {actionsColumn.render(row[actionsColumn.key], row)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;