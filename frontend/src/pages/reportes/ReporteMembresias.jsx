import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Card, Button, Spinner, Form, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSync } from '@fortawesome/free-solid-svg-icons';
import { reporteService } from '../../services/reporteService';
import { PDFGenerator } from '../../utils/pdfGenerator';
import DataTable from '../../components/common/DataTable';

const ReporteMembresias = () => {
  const [loading, setLoading] = useState(false);
  const [datos, setDatos] = useState([]);
  const [filtros, setFiltros] = useState({ fechaInicio: '', fechaFin: '' });

  const columnas = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'membership', label: 'Membresía', render: v => v.membership?.name, sortable: true },
    { key: 'saleDate', label: 'Fecha Venta', sortable: true },
    { key: 'totalAmount', label: 'Precio', render: v => `$${v.totalAmount?.toFixed(2)}` },
    { key: 'startDate', label: 'Inicio', sortable: true },
    { key: 'endDate', label: 'Fin', sortable: true },
    { key: 'client', label: 'Cliente', render: v => `${v.client?.firstName || ''} ${v.client?.lastName || ''}` },
    { key: 'paymentMethod', label: 'Método de Pago', sortable: true },
    { key: 'status', label: 'Estado', sortable: true },
  ];

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      const data = filtros.fechaInicio && filtros.fechaFin
        ? await reporteService.obtenerReporteMembresias(filtros.fechaInicio, filtros.fechaFin)
        : await reporteService.obtenerReporteMembresias();
      setDatos(data);
    } catch (error) {
      toast.error('Error al cargar datos de membresías');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  const handleFiltroChange = ({ target: { name, value } }) => {
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const limpiarFiltros = () => {
    setFiltros({ fechaInicio: '', fechaFin: '' });
    setTimeout(cargarDatos, 100);
  };

  const exportarPDF = () => {
    const doc = PDFGenerator.generarReporteMembresias(datos, filtros);
    PDFGenerator.descargar(doc, 'reporte_membresias');
    toast.success('Reporte PDF generado exitosamente');
  };

  const estadisticas = {
    total: datos.length,
    activas: datos.filter(m => m.status === 'Active').length,
    expiradas: datos.filter(m => m.status === 'Expired').length,
    ingresos: datos.reduce((sum, m) => sum + (m.totalAmount || 0), 0)
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3>Reporte de Membresías</h3>

      <Card className="mb-4 p-3">
        <h5><FontAwesomeIcon icon={faFilter} className="me-2" />Filtros</h5>
        <Form as={Row} className="g-3 mt-2">
          <Col md={3}>
            <Form.Group controlId="fechaInicio">
              <Form.Label>Fecha Inicio</Form.Label>
              <Form.Control type="date" name="fechaInicio" value={filtros.fechaInicio} onChange={handleFiltroChange} />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="fechaFin">
              <Form.Label>Fecha Fin</Form.Label>
              <Form.Control type="date" name="fechaFin" value={filtros.fechaFin} onChange={handleFiltroChange} />
            </Form.Group>
          </Col>
          <Col md={6} className="d-flex align-items-end justify-content-start">
            <Button variant="outline-dark" className="me-2" onClick={cargarDatos}>
              <FontAwesomeIcon icon={faFilter} className="me-1" /> Aplicar Filtros
            </Button>
            <Button variant="outline-dark" onClick={limpiarFiltros}>
              <FontAwesomeIcon icon={faSync} className="me-1" /> Limpiar
            </Button>
          </Col>
        </Form>
      </Card>

      <Row className="mb-4">
        {[
          { label: 'Total', value: estadisticas.total, variant: 'dark' },
          { label: 'Activas', value: estadisticas.activas, variant: 'dark' },
          { label: 'Expiradas', value: estadisticas.expiradas, variant: 'dark' },
          { label: 'Ingresos', value: `$${estadisticas.ingresos.toFixed(2)}`, variant: 'dark' },
        ].map((stat, i) => (
          <Col md={3} key={i}>
            <Card className={`text-center text-${stat.variant} p-3`}>
              <h6>{stat.label}</h6>
              <h4>{stat.value}</h4>
            </Card>
          </Col>
        ))}
      </Row>

      <DataTable
        data={datos}
        columns={columnas}
        title="Lista de Membresías"
        onExportPDF={exportarPDF}
        itemsPerPage={15}
      />
    </div>
  );
};

export default ReporteMembresias;
