const usePagination = (items = [], page = 1, pageSize = 10) => {
  const start = (page - 1) * pageSize;
  const paginated = items.slice(start, start + pageSize);
  const totalPages = Math.ceil(items.length / pageSize) || 1;
  return { paginated, totalPages };
};

export default usePagination;