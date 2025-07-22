import React, { useState, useEffect, useCallback } from 'react';
import { Table, Container, Row, Col, Card as RBCard, Button, Spinner, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faFilePdf, faUserCheck, faUserTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { reporteService } from '../../services/reporteService';
import { PDFGenerator } from '../../utils/pdfGenerator';

const ReporteProveedores = () => {
  const [loading, setLoading] = useState(false);
  const [datos, setDatos] = useState([]);

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await reporteService.obtenerReporteProveedores();
      setDatos(data);
    } catch (error) {
      toast.error('Error al cargar proveedores');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const exportarPDF = () => {
    const doc = PDFGenerator.generarReporteProveedores(datos);
    PDFGenerator.descargar(doc, 'reporte_proveedores');
    toast.success('Reporte PDF generado exitosamente');
  };

  const activos = datos.filter(p => p.enabled);
  const inactivos = datos.filter(p => !p.enabled);

  const estadisticas = {
    total: datos.length,
    activos: activos.length,
    inactivos: inactivos.length,
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h3>Reporte de Proveedores</h3>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={4}>
              <RBCard body className="text-center">
                <h6 className="text-primary">Total Proveedores</h6>
                <h4>{estadisticas.total}</h4>
              </RBCard>
            </Col>
            <Col md={4}>
              <RBCard body className="text-center">
                <h6 className="text-success">Activos</h6>
                <h4>{estadisticas.activos}</h4>
              </RBCard>
            </Col>
            <Col md={4}>
              <RBCard body className="text-center">
                <h6 className="text-danger">Inactivos</h6>
                <h4>{estadisticas.inactivos}</h4>
              </RBCard>
            </Col>
          </Row>

          <RBCard body className="mb-4">
            <h5 className="mb-3">Acciones</h5>
            <Row className="g-2">
              <Col md={3}>
                <Button variant="outline-dark" size="sm" className="w-100" onClick={() => setDatos(activos)}>
                  <FontAwesomeIcon icon={faUserCheck} className="me-2" />Activos
                </Button>
              </Col>
              <Col md={3}>
                <Button variant="outline-dark" size="sm" className="w-100" onClick={() => setDatos(inactivos)}>
                  <FontAwesomeIcon icon={faUserTimes} className="me-2" />Inactivos
                </Button>
              </Col>
              <Col md={3}>
                <Button variant="outline-dark" size="sm" className="w-100" onClick={cargarDatos}>
                  <FontAwesomeIcon icon={faSync} className="me-2" />Todos
                </Button>
              </Col>
              <Col md={3}>
                <Button variant="outline-dark" size="sm" className="w-100" onClick={exportarPDF}>
                  <FontAwesomeIcon icon={faFilePdf} className="me-2" />Exportar PDF
                </Button>
              </Col>
            </Row>
          </RBCard>

          {/* Tabla de datos */}
          <div className="table-responsive">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>DNI</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Empresa</th>
                  <th>RUC</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {datos.map(proveedor => (
                  <tr key={proveedor.id}>
                    <td>{proveedor.dni}</td>
                    <td>{proveedor.firstName}</td>
                    <td>{proveedor.lastName}</td>
                    <td>{proveedor.company}</td>
                    <td>{proveedor.ruc}</td>
                    <td>{proveedor.email}</td>
                    <td>{proveedor.phone}</td>
                    <td>
                      <Badge bg={proveedor.enabled ? 'success' : 'danger'}>
                        {proveedor.enabled ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}
    </Container>
  );
};

export default ReporteProveedores;
