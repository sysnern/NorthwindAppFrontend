import React from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const SortableHeader = React.memo(({ 
  field, 
  currentSort, 
  onSort, 
  children, 
  className = '' 
}) => {
  const isActive = currentSort.field === field;
  const isAscending = currentSort.direction === 'asc';

  const getSortIcon = () => {
    if (!isActive) return <FaSort />;
    return isAscending ? <FaSortUp /> : <FaSortDown />;
  };

  const getAriaLabel = () => {
    if (!isActive) return `Sırala: ${children}`;
    return isAscending ? `${children} azalan sırada` : `${children} artan sırada`;
  };

  return (
    <th 
      onClick={() => onSort(field)}
      style={{ cursor: 'pointer' }}
      className={className}
      role="button"
      tabIndex={0}
      aria-label={getAriaLabel()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSort(field);
        }
      }}
    >
      {children} {getSortIcon()}
    </th>
  );
});

SortableHeader.displayName = 'SortableHeader';

export default SortableHeader; 