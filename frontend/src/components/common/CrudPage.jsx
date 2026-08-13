import { useState } from "react";
import SearchBar from "./SearchBar";
import Button from "./Button";
import Table from "./Table";

const CrudPage = ({
  title, subtitle, columns, data, loading,
  onAdd, onEdit, onDelete,
  searchValue, onSearchChange, addLabel = "Add New",
  extraActions, headerExtra,
}) => {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record? This cannot be undone.")) return;
    setDeleting(id);
    try { await onDelete(id); } finally { setDeleting(null); }
  };

  const columnsWithActions = [
    ...columns,
    { key: "actions", label: "Actions", render: (_, row) => (
      <div className="flex items-center gap-2">
        {extraActions ? extraActions(row) : null}
        <Button variant="ghost" size="sm" onClick={() => onEdit(row)} className="h-8 px-2 py-0">
          ✏️ Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={() => handleDelete(row._id)} disabled={deleting === row._id} className="h-8 px-2 py-0 text-danger hover:bg-danger-light hover:text-danger">
          🗑️ Delete
        </Button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
          {subtitle && <p className="text-text-secondary mt-1">{subtitle}</p>}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full sm:w-auto">
          {onSearchChange && (
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              placeholder="🔍 Search..."
              className="w-full sm:w-72"
            />
          )}
          {headerExtra}
          <Button variant="primary" onClick={onAdd} className="whitespace-nowrap">
            <span>＋</span> {addLabel}
          </Button>
        </div>
      </div>

      <Table
        columns={columnsWithActions}
        rows={data}
        emptyMessage={loading ? "⏳ Loading..." : "📭 No records found"}
      />
    </div>
  );
};

export default CrudPage;