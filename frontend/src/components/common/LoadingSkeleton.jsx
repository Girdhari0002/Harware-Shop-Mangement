const LoadingSkeleton = ({ rows = 4 }) => {
  return (
    <div className="erp-card animate-pulse p-5">
      <div className="mb-4 h-5 w-40 rounded bg-border" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="h-10 w-full rounded bg-border" />
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;