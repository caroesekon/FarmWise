import { useState } from 'react';

export function usePagination(initialPage = 1, initialLimit = 20) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const goToPage = (p) => setPage(p);
  const changeLimit = (l) => {
    setLimit(l);
    setPage(1);
  };

  return { page, limit, nextPage, prevPage, goToPage, changeLimit };
}