import React, { useMemo } from 'react';
import { Button } from 'react-bootstrap';

const Pagination = React.memo(({ 
  currentPage, 
  totalCount, 
  pageSize, 
  onPageChange, 
  className = '' 
}) => {
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <div className={`d-flex justify-content-between align-items-center p-3 ${className}`}>
      <div>
        Toplam: <b>{totalCount}</b> kayıt
      </div>
      <div>
        <span style={{ marginRight: 8 }}>
          10 / sayfa
        </span>
        <Button
          variant="outline-secondary"
          size="sm"
          disabled={isFirstPage}
          onClick={() => onPageChange(currentPage - 1)}
          className="me-2"
        >
          Önceki
        </Button>
        <span>
          Sayfa <b>{currentPage}</b> / {totalPages}
        </span>
        <Button
          variant="outline-secondary"
          size="sm"
          disabled={isLastPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="ms-2"
        >
          Sonraki
        </Button>
      </div>
    </div>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination; 