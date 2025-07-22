import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { reporteService } from '../../services/reporteService';
import { PDFGenerator } from '../../utils/pdfGenerator';
import { Table, Card, Row, Col, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo, faFilePdf, faHourglassHalf, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const ReportePedidos = () => {
  const [loading, setLoading] = useState(false);
  const [datos, setDatos] = useState([]);

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await reporteService.obtenerReportePedidos();
      setDatos(data);
    } catch (error) {
      toast.error('Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const exportarPDF = () => {
    const doc = PDFGenerator.generarReportePedidos(datos);
    PDFGenerator.descargar(doc, 'reporte_pedidos');
    toast.success('Reporte PDF generado exitosamente');
  };

  const pendientes = datos.filter(p => p.status === 'PENDING');
  const recibidos = datos.filter(p => p.status === 'RECEIVED');
  const totalPedidos = datos.reduce((sum, p) => sum + (p.totalAmount || 0), 0);

  const estadisticas = {
    total: datos.length,
    pendientes: pendientes.length,
    recibidos: recibidos.length,
    totalPedidos
  };

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  }

  return (
    <div className="container mt-4">
      <Row className="mb-4">
        <Col>
          <h3>Reporte de Pedidos</h3>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="p-3 text-center">
            <h6 className="text-primary">Total Pedidos</h6>
            <h4>{estadisticas.total}</h4>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="p-3 text-center">
            <h6 className="text-warning">Pendientes</h6>
            <h4>{estadisticas.pendientes}</h4>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="p-3 text-center">
            <h6 className="text-success">Recibidos</h6>
            <h4>{estadisticas.recibidos}</h4>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="p-3 text-center">
            <h6 className="text-info">Valor Total</h6>
            <h4>${estadisticas.totalPedidos.toFixed(2)}</h4>
          </Card>
        </Col>
      </Row>

      <Card className="p-3 mb-4">
        <h5 className="mb-3">Acciones</h5>
        <Row className="g-2">
          <Col md={3}>
            <Button variant="outline-dark" size="sm" className="w-100" onClick={() => setDatos(pendientes)}>
              <FontAwesomeIcon icon={faHourglassHalf} className="me-2" />Pendientes
            </Button>
          </Col>
          <Col md={3}>
            <Button variant="outline-dark" size="sm" className="w-100" onClick={() => setDatos(recibidos)}>
              <FontAwesomeIcon icon={faCheckCircle} className="me-2" />Recibidos
            </Button>
          </Col>
          <Col md={3}>
            <Button variant="outline-dark" size="sm" className="w-100" onClick={cargarDatos}>
              <FontAwesomeIcon icon={faRedo} className="me-2" />Todos
            </Button>
          </Col>
          <Col md={3}>
            <Button variant="outline-dark" size="sm" className="w-100" onClick={exportarPDF}>
              <FontAwesomeIcon icon={faFilePdf} className="me-2" />Exportar PDF
            </Button>
          </Col>
        </Row>
      </Card>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nº Pedido</th>
            <th>Fecha</th>
            <th>Proveedor</th>
            <th>Total</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((p, i) => (
            <tr key={i}>
              <td>{p.orderNumber}</td>
              <td>{p.dateTime || p.orderDate || ''}</td>
              <td>{p.supplier?.firstName || p.supplier?.companyName || ''}</td>
              <td>${(p.totalAmount || 0).toFixed(2)}</td>
              <td>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ReportePedidos;
