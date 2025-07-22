import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { reporteService } from '../../services/reporteService';
import { PDFGenerator } from '../../utils/pdfGenerator';
import { Container, Row, Col, Card, Button, Form, Badge, Spinner, } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faFilter, faTimes, } from '@fortawesome/free-solid-svg-icons';
import DataTable from '../../components/common/DataTable';

const ReporteVentasProductos = () => {
  const [loading, setLoading] = useState(false);
  const [datos, setDatos] = useState([]);
  const [filtros, setFiltros] = useState({ fechaInicio: '', fechaFin: '' });

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      let data;
      if (filtros.fechaInicio && filtros.fechaFin) {
        data = await reporteService.obtenerReporteVentasProductos(
          filtros.fechaInicio,
          filtros.fechaFin
        );
      } else {
        data = await reporteService.obtenerTodasLasVentas();
      }
      setDatos(data);
    } catch (error) {
      toast.error('Error al cargar datos de ventas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filtros.fechaInicio, filtros.fechaFin]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const exportarPDF = () => {
    if (datos.length === 0) {
      toast.info('No hay datos para exportar');
      return;
    }
    const doc = PDFGenerator.generarReporteVentasProductos(datos, filtros);
    PDFGenerator.descargar(doc, 'reporte_ventas_productos');
    toast.success('Reporte PDF generado exitosamente');
  };

  const handleFiltroChange = e => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const limpiarFiltros = () => {
    setFiltros({ fechaInicio: '', fechaFin: '' });
  };

  const productosVendidos = {};
  datos.forEach(venta => {
    if (!venta.cancelled && venta.details) {
      venta.details.forEach(detail => {
        const nombre = detail.product?.name || 'Producto sin nombre';
        if (!productosVendidos[nombre]) {
          productosVendidos[nombre] = { cantidad: 0, ingresos: 0 };
        }
        productosVendidos[nombre].cantidad += detail.quantity || 0;
        productosVendidos[nombre].ingresos +=
          (detail.quantity || 0) * (detail.unitPrice || 0);
      });
    }
  });
  const topProductos = Object.entries(productosVendidos)
    .sort((a, b) => b[1].cantidad - a[1].cantidad)
    .slice(0, 5);

  const columnas = [
    { key: 'invoiceNumber', label: 'Factura', sortable: true },
    { key: 'client.firstName', label: 'Cliente', sortable: true, render: row => `${row.client?.firstName} ${row.client?.lastName}` },
    { key: 'dateTime', label: 'Fecha', type: 'date', sortable: true },
    { key: 'totalAmount', label: 'Total', type: 'currency', sortable: true },
    { key: 'cancelled', label: 'Estado', render: row => <Badge bg={row.cancelled ? 'danger' : 'success'}>{row.cancelled ? 'Cancelada' : 'Completada'}</Badge> },
    {
      key: 'details', label: 'Productos', render: row => (
        <>
          {row.details?.slice(0, 2).map((d, i) => (
            <div key={i} title={d.product?.name} className="text-truncate">
              {d.product?.name} (x{d.quantity})
            </div>
          ))}
          {row.details?.length > 2 && <small className="text-muted">... y {row.details.length - 2} más</small>}
        </>
      )
    },
  ];

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h3>Reporte de Ventas de Productos</h3>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-end g-3">
            <Col md={3}>
              <Form.Group controlId="fechaInicio">
                <Form.Label>Fecha Inicio</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaInicio"
                  value={filtros.fechaInicio}
                  onChange={handleFiltroChange}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="fechaFin">
                <Form.Label>Fecha Fin</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaFin"
                  value={filtros.fechaFin}
                  onChange={handleFiltroChange}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="d-flex gap-2">
              <Button
                variant="outline-dark"
                onClick={cargarDatos}
                className="flex-grow-1"
              >
                <FontAwesomeIcon icon={faFilter} className="me-2" />
                Aplicar Filtros
              </Button>
              <Button
                variant="outline-dark"
                onClick={limpiarFiltros}
                className="flex-grow-1"
              >
                <FontAwesomeIcon icon={faTimes} className="me-2" />
                Limpiar
              </Button>
              <Button
                variant="outline-dark"
                onClick={() => {
                  const hoy = new Date().toISOString().split('T')[0];
                  setFiltros({ fechaInicio: hoy, fechaFin: hoy });
                }}
                className="flex-grow-1"
              >
                <FontAwesomeIcon icon={faCalendarDay} className="me-2" />
                Hoy
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {topProductos.length > 0 && (
        <Card className="mb-4">
          <Card.Header>
            <h5>Productos Más Vendidos</h5>
          </Card.Header>
          <Card.Body className="text-center">
            <Row className="justify-content-center">
              {topProductos.map(([nombre, datos], idx) => (
                <Col key={nombre} xs={6} sm={4} md={2} className="mb-3">
                  <Card className="text-center border h-100">
                    <div className="fw-bold text-dark">#{idx + 1}</div>
                    <small className="d-block text-truncate" title={nombre}>
                      {nombre}
                    </small>
                    <div className="text-success fw-bold">x{datos.cantidad}</div>
                    <small className="text-muted">${datos.ingresos.toFixed(2)}</small>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}




      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <DataTable
          data={datos}
          columns={columnas}
          title="Ventas Registradas"
          onExportPDF={exportarPDF}
        />
      )}
    </Container>
  );
};

export default ReporteVentasProductos;
