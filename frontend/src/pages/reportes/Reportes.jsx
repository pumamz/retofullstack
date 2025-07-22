import React, { useState, useEffect } from 'react';
import { Button, Card, Spinner, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faUsers, faBox, faTruck, faFilePdf, faUserTie, faIdCard, faDumbbell, faShoppingCart, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { reporteService } from '../../services/reporteService';
import { PDFGenerator } from '../../utils/pdfGenerator';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const Reportes = () => {
  const [loading, setLoading] = useState(false);
  const [resumenGeneral, setResumenGeneral] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/reportes') {
      cargarResumenGeneral();
    }
  }, [location.pathname]);

  const cargarResumenGeneral = async () => {
    setLoading(true);
    try {
      const resumen = await reporteService.obtenerResumenGeneral();
      setResumenGeneral(resumen);
    } catch {
      toast.error('Error al cargar el resumen general');
    } finally {
      setLoading(false);
    }
  };

  const generarReporteCompleto = async () => {
    setLoading(true);
    try {
      const [membresias, clases, ventas, clientes, productos] = await Promise.all([
        reporteService.obtenerReporteMembresias(),
        reporteService.obtenerReporteClasesPersonalizadas(),
        reporteService.obtenerTodasLasVentas(),
        reporteService.obtenerReporteClientes(),
        reporteService.obtenerReporteProductos(),
      ]);

      const doc = new (await import('jspdf')).jsPDF();
      const startY = PDFGenerator.configurarDocumento(doc, 'Reporte Completo del Sistema');

      doc.setFontSize(14);
      doc.setTextColor(44, 62, 80);
      doc.text('Resumen Ejecutivo', 20, startY + 10);

      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(`Total de membresías: ${membresias.length}`, 20, startY + 25);
      doc.text(`Total de clases personalizadas: ${clases.length}`, 20, startY + 35);
      doc.text(`Total de ventas: ${ventas.length}`, 20, startY + 45);
      doc.text(`Total de clientes: ${clientes.length}`, 20, startY + 55);
      doc.text(`Total de productos: ${productos.length}`, 20, startY + 65);

      const totalIngresos = [
        ...membresias.map(m => m.totalAmount || 0),
        ...clases.map(c => c.price || 0),
        ...ventas.filter(v => !v.cancelled).map(v => v.totalAmount || 0)
      ].reduce((sum, val) => sum + val, 0);

      doc.text(`Ingresos totales: $${totalIngresos.toFixed(2)}`, 20, startY + 75);

      PDFGenerator.descargar(doc, 'reporte_completo_sistema');
      toast.success('Reporte completo generado');
    } catch {
      toast.error('Error al generar el reporte completo');
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => {
    if (loading) return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" variant="primary" />
      </div>
    );

    const resumenes = [
      {
        title: 'Ventas Hoy',
        value: resumenGeneral?.ventasHoy?.length || 0,
        icon: faShoppingCart,
        variant: 'primary',
        description: 'transacciones'
      },
      {
        title: 'Membresías (7 días)',
        value: resumenGeneral?.membresiasSemana?.length || 0,
        icon: faIdCard,
        variant: 'success',
        description: 'nuevas membresías'
      },
      {
        title: 'Clases Programadas',
        value: Array.isArray(resumenGeneral?.clasesProgramadas)
          ? resumenGeneral.clasesProgramadas.filter(c => c.status === 'Scheduled').length
          : 0,
        icon: faDumbbell,
        variant: 'info',
        description: 'programadas'
      },
      {
        title: 'Clientes Activos',
        value: resumenGeneral?.clientesActivos?.length || 0,
        icon: faUsers,
        variant: 'warning',
        description: 'registrados'
      }
    ];

    const botones = [
      { path: '/reportes/membresias', icon: faIdCard, text: 'Membresías', variant: 'dark' },
      { path: '/reportes/clases', icon: faDumbbell, text: 'Clases Personalizadas', variant: 'dark' },
      { path: '/reportes/ventas', icon: faShoppingCart, text: 'Ventas de Productos', variant: 'dark' },
      { path: '/reportes/clientes', icon: faUsers, text: 'Clientes', variant: 'dark' },
      { path: '/reportes/productos', icon: faBox, text: 'Productos', variant: 'dark' },
      { path: '/reportes/pedidos', icon: faTruck, text: 'Pedidos', variant: 'dark' },
      { path: '/reportes/proveedores', icon: faUserTie, text: 'Proveedores', variant: 'dark' },
    ];

    return (
      <>
        <Row className="mb-4 g-3">
          {resumenes.map(({ title, value, icon, variant, description }, idx) => (
            <Col key={idx} xs={12} md={6} lg={3}>
              <Card
                bg="white"
                className={`shadow-sm rounded-lg border-0 h-100 text-center p-3`}
                style={{ cursor: 'default', transition: 'transform 0.3s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div className={`text-${variant} mb-2`}>
                  <FontAwesomeIcon icon={icon} size="3x" />
                </div>
                <Card.Title className="fw-bold">{title}</Card.Title>
                <h2 className={`text-${variant} fw-bold`}>{value}</h2>
                <small className="text-muted">{description}</small>
              </Card>
            </Col>
          ))}
        </Row>

        <Card className="mb-4 shadow-sm rounded-lg border-0">
          <Card.Header className="d-flex align-items-center fs-5">
            <FontAwesomeIcon icon={faFilePdf} className="me-2" />
            Reporte General
          </Card.Header>
          <Card.Body className="d-flex justify-content-center">
            <Button
              variant="outline-danger"
              size="lg"
              onClick={generarReporteCompleto}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faChartPie} className="me-2" />
              Generar PDF Completo
            </Button>
          </Card.Body>
        </Card>

        <Card className="shadow-sm rounded-lg border-0">
          <Card.Header className="d-flex align-items-center fs-5">
            <FontAwesomeIcon icon={faChartPie} className="me-2" />
            Reportes Detallados
          </Card.Header>
          <Card.Body>
            <Row xs={2} sm={3} md={4} lg={7} className="g-3">
              {botones.map(({ path, icon, text, variant }) => (
                <Col key={path}>
                  <Button
                    variant={`outline-${variant}`}
                    className="w-100 py-3 shadow-sm rounded-lg d-flex flex-column align-items-center justify-content-center text-center"
                    style={{ minHeight: 100, transition: 'all 0.3s ease' }}
                    onClick={() => navigate(path)}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = `var(--bs-${variant})`;
                      e.currentTarget.style.color = '#fff';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = '';
                      e.currentTarget.style.color = '';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <FontAwesomeIcon icon={icon} size="2x" className="mb-2" />
                    <span className="fw-semibold">{text}</span>
                  </Button>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </>
    );
  };

  const isDashboard = location.pathname === '/reportes';

  return (
    <div className="container mt-4">
      {isDashboard && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>
            Centro de Reportes
          </h2>
        </div>
      )}

      {!isDashboard && (
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button variant="outline-dark" onClick={() => navigate('/reportes')}>
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Volver
          </Button>
        </div>
      )}

      {isDashboard ? renderDashboard() : <Outlet />}
    </div>
  );
};

export default Reportes;