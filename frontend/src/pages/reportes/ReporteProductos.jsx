import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { reporteService } from '../../services/reporteService';
import { PDFGenerator } from '../../utils/pdfGenerator';
import { Container, Row, Col, Card, Button, Table, Badge, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faSyncAlt, faArrowDown } from '@fortawesome/free-solid-svg-icons';

const ReporteProductos = () => {
  const [loading, setLoading] = useState(false);
  const [datos, setDatos] = useState([]);

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await reporteService.obtenerReporteProductos();
      setDatos(data);
    } catch (error) {
      toast.error('Error al cargar productos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const exportarPDF = () => {
    if (datos.length === 0) {
      toast.info('No hay datos para exportar');
      return;
    }
    const doc = PDFGenerator.generarReporteProductos(datos);
    PDFGenerator.descargar(doc, 'reporte_productos');
    toast.success('Reporte PDF generado exitosamente');
  };

  // Estadísticas
  const activos = datos.filter(p => p.active);
  const stockBajo = datos.filter(p => (p.stock || 0) < 5);
  const valorInventario = datos.reduce(
    (sum, p) => sum + (p.stock || 0) * (p.pricePurchase || 0),
    0
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-50">
        <Spinner animation="border" variant="primary" role="status" />
      </div>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h3>Reporte de Productos</h3>
        </Col>
      </Row>

      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title className="text-primary">Total Productos</Card.Title>
              <h4>{datos.length}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title className="text-success">Activos</Card.Title>
              <h4>{activos.length}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title className="text-danger">Stock Bajo</Card.Title>
              <h4>{stockBajo.length}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title className="text-info">Valor Inventario</Card.Title>
              <h4>${valorInventario.toFixed(2)}</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Row className="g-2">
            <Col md={3}>
              <Button
                variant="outline-dark"
                size="sm"
                className="w-100"
                onClick={async () => {
                  setLoading(true);
                  try {
                    const data = await reporteService.obtenerProductosStockBajo();
                    setDatos(data);
                    toast.success('Productos con stock bajo cargados');
                  } catch (error) {
                    toast.error('Error al cargar productos con stock bajo');
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <FontAwesomeIcon icon={faArrowDown} className="me-2" />
                Stock Bajo
              </Button>
            </Col>
            <Col md={3}>
              <Button
                variant="outline-dark"
                size="sm"
                className="w-100"
                onClick={cargarDatos}
              >
                <FontAwesomeIcon icon={faSyncAlt} className="me-2" />
                Todos
              </Button>
            </Col>
            <Col md={3}>
              <Button
                variant="outline-dark"
                size="sm"
                className="w-100"
                onClick={exportarPDF}
              >
                <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                Exportar PDF
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <div className="table-responsive">
        <Table striped hover bordered responsive>
          <thead className="table">
            <tr>
              <th>ID</th>
              <th>Código</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio Compra</th>
              <th>Precio Venta</th>
              <th>Stock</th>
              <th>Stock Mínimo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {datos.map(producto => (
              <tr
                key={producto.id}
                className={
                  producto.stock <= producto.minimumStock ? 'table-warning' : ''
                }
              >
                <td>{producto.id}</td>
                <td>{producto.barcode}</td>
                <td>{producto.name}</td>
                <td>{producto.description}</td>
                <td>${producto.priceBuy?.toFixed(2)}</td>
                <td>${producto.priceSale?.toFixed(2)}</td>
                <td>{producto.stock}</td>
                <td>{producto.minimumStock}</td>
                <td>
                  <Badge bg={producto.enabled ? 'success' : 'danger'}>
                    {producto.enabled ? 'Activo' : 'Inactivo'}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default ReporteProductos;
