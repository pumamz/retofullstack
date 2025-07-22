import React, { useState, useMemo } from 'react';
import { Button, Card, Table, Pagination, ButtonGroup, } from 'react-bootstrap';
import { faFilePdf, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DataTable = ({
  data = [],
  columns = [],
  title = '',
  showExport = true,
  onExportPDF = null,
  onExportExcel = null,
  itemsPerPage = 10
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getNestedValue = (obj, path) =>
    path.split('.').reduce((current, key) => current?.[key], obj);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const formatValue = (value, type = 'text') => {
    if (value === null || value === undefined) return 'N/A';

    switch (type) {
      case 'currency':
        return `$${parseFloat(value).toFixed(2)}`;
      case 'date':
        return new Date(value).toLocaleDateString('es-ES');
      case 'boolean':
        return value ? 'Sí' : 'No';
      default:
        return value.toString();
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <i className="fas fa-sort text-muted"></i>;
    return sortConfig.direction === 'asc' ? (
      <i className="fas fa-sort-up text-primary"></i>
    ) : (
      <i className="fas fa-sort-down text-primary"></i>
    );
  };

  if (!data || data.length === 0) {
    return (
      <Card className="text-center">
        <Card.Body>
          <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
          <Card.Title className="text-muted">No hay datos disponibles</Card.Title>
          <Card.Text className="text-muted">No se encontraron registros para mostrar.</Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">{title}</h5>
        {showExport && (
          <ButtonGroup>
            {onExportPDF && (
              <Button variant="outline-danger" onClick={onExportPDF}>
                <FontAwesomeIcon icon={faFilePdf} className="me-1" /> PDF
              </Button>
            )}
            {onExportExcel && (
              <Button variant="outline-success" onClick={onExportExcel}>
                <FontAwesomeIcon icon={faFileExcel} className="me-1" /> Excel
              </Button>
            )}
          </ButtonGroup>
        )}
      </Card.Header>

      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table striped hover className="mb-0">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{ cursor: col.sortable ? 'pointer' : 'default' }}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      {col.label}
                      {col.sortable && getSortIcon(col.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row) : formatValue(getNestedValue(row, col.key), col.type)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>

      {totalPages > 1 && (
        <Card.Footer className="d-flex justify-content-between align-items-center">
          <span className="text-muted">
            Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, sortedData.length)} de {sortedData.length} registros
          </span>
          <Pagination size="sm" className="mb-0">
            <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} />
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              const isActive = page === currentPage;
              const showPage = page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1);

              if (!showPage) {
                if (page === currentPage - 2 || page === currentPage + 2) {
                  return <Pagination.Ellipsis key={page} disabled />;
                }
                return null;
              }

              return (
                <Pagination.Item key={page} active={isActive} onClick={() => setCurrentPage(page)}>
                  {page}
                </Pagination.Item>
              );
            })}
            <Pagination.Next disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} />
          </Pagination>
        </Card.Footer>
      )}
    </Card>
  );
};

export default DataTable;