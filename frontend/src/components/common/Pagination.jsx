import Button from "./Button";

const Pagination = ({ page = 1, totalPages = 1, onChange }) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2">
      <p className="text-xs text-text-muted">
        Page <span className="tabular-nums font-semibold text-text">{page}</span> of{" "}
        <span className="tabular-nums font-semibold text-text">{totalPages}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => onChange?.(page - 1)}>
          Previous
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => onChange?.(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;