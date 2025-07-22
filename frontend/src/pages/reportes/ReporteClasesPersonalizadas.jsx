import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { reporteService } from '../../services/reporteService';
import { PDFGenerator } from '../../utils/pdfGenerator';
import { Card, Button, Form, Row, Col, Spinner } from 'react-bootstrap';
import DataTable from '../../components/common/DataTable';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ReporteClasesPersonalizadas = () => {
  const [loading, setLoading] = useState(false);
  const [datos, setDatos] = useState([]);
  const [filtros, setFiltros] = useState({ fechaInicio: '', fechaFin: '', estado: '' });

  const estadosOptions = [
    { value: '', label: 'Todos' },
    { value: 'Scheduled', label: 'Programadas' },
    { value: 'Completed', label: 'Completadas' },
    { value: 'Cancelled', label: 'Canceladas' }
  ];

  const columnas = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'className', label: 'Clase', sortable: true },
    { key: 'client', label: 'Cliente', sortable: true, render: (item) => `${item.client?.firstName || ''} ${item.client?.lastName || ''}` },
    { key: 'date', label: 'Fecha', type: 'date', sortable: true },
    { key: 'time', label: 'Hora', sortable: true },
    { key: 'price', label: 'Precio', type: 'currency', sortable: true },
    { key: 'status', label: 'Estado', sortable: true, },
    { key: 'paymentMethod', label: 'Método Pago', sortable: true }
  ];

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      let data;

      if (filtros.estado) {
        data = await reporteService.obtenerClasesPorEstado(filtros.estado);
      } else if (filtros.fechaInicio && filtros.fechaFin) {
        data = await reporteService.obtenerReporteClasesPersonalizadas(filtros.fechaInicio, filtros.fechaFin);
      } else {
        data = await reporteService.obtenerReporteClasesPersonalizadas();
      }

      setDatos(data);
    } catch (error) {
      toast.error('Error al cargar datos de clases personalizadas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const exportarPDF = () => {
    const doc = PDFGenerator.generarReporteClasesPersonalizadas(datos, filtros);
    PDFGenerator.descargar(doc, 'reporte_clases_personalizadas');
    toast.success('Reporte PDF generado exitosamente');
  };

  const estadisticas = {
    total: datos.length,
    programadas: datos.filter(c => c.status === 'Scheduled').length,
    completadas: datos.filter(c => c.status === 'Completed').length,
    canceladas: datos.filter(c => c.status === 'Cancelled').length,
    ingresos: datos.reduce((sum, c) => sum + (c.price || 0), 0)
  };

  if (loading) return <div className="text-center my-5"><Spinner animation="border" variant="primary" /></div>;

  return (
    <div className="container mt-4">
      <h3>Reporte de Clases Personalizadas</h3>

      <Card className="my-4 p-3">
        <h5><FontAwesomeIcon icon={faFilter} className="me-2" />Filtros</h5>
        <Row className="gy-2 mt-2">
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
          <Col md={3}>
            <Form.Group controlId="estado">
              <Form.Label>Estado</Form.Label>
              <Form.Select name="estado" value={filtros.estado} onChange={handleFiltroChange}>
                {estadosOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3} className="d-flex align-items-end gap-2">
            <Button variant="outline-dark" onClick={cargarDatos}>Aplicar</Button>
            <Button variant="outline-dark" onClick={() => { setFiltros({ fechaInicio: '', fechaFin: '', estado: '' }); setTimeout(cargarDatos, 100); }}>Limpiar</Button>
          </Col>
        </Row>
      </Card>

      <Card className="my-4 p-3 text-center">
        <Row>
          {[{
            label: 'Total', value: estadisticas.total, color: 'dark'
          }, {
            label: 'Programadas', value: estadisticas.programadas, color: 'dark'
          }, {
            label: 'Completadas', value: estadisticas.completadas, color: 'dark'
          }, {
            label: 'Canceladas', value: estadisticas.canceladas, color: 'dark'
          }, {
            label: 'Ingresos Totales', value: `$${estadisticas.ingresos.toFixed(2)}`, color: 'dark'
          }].map(({ label, value, color }, i) => (
            <Col key={i} md={2}>
              <Card className="text-center p-2">
                <h6 className={`text-${color}`}>{label}</h6>
                <h4>{value}</h4>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>


      <DataTable
        data={datos}
        columns={columnas}
        title="Lista de Clases Personalizadas"
        onExportPDF={exportarPDF}
        itemsPerPage={15}
      />
    </div>
  );
};

export default ReporteClasesPersonalizadas;