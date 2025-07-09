import React from 'react';

const TableHeader = ({ columns = [] }) => {
  if (!Array.isArray(columns)) return null;

  return (
    <thead>
      <tr>
        {columns.map((col) => (
          <th key={col}>{col}</th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
