import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { membresiaVentaService } from '../../services/membresiaVentaService';
import { clienteService } from '../../services/clienteService';
import { membresiaService } from '../../services/membresiaService';
import { mostrarError } from '../../api/toast';
import jsPDF from 'jspdf';

const FormularioVentaMembresia = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [venta, setVenta] = useState({
    client: { id: '' },
    membership: { id: '' },
    paymentMethod: ''
  });

  const [clienteInput, setClienteInput] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [membresias, setMembresias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const autocompleteRef = useRef(null);
  const debounceRef = useRef(null);

  const METODOS_PAGO = [
    { value: 'Efectivo', label: 'Efectivo' },
    { value: 'Tarjeta', label: 'Tarjeta' },
    { value: 'Transferencia', label: 'Transferencia Bancaria' },
    { value: 'Paypal', label: 'PayPal' }
  ];

  const buscarClientes = useCallback(async (term) => {
    if (!term.trim()) {
      setSugerencias([]);
      return;
    }

    try {
      const resultados = await clienteService.buscarClientes(term);
      setSugerencias(resultados);
    } catch (error) {
      mostrarError(error, 'Error al buscar clientes');
      setSugerencias([]);
    }
  }, []);

  const handleClienteInputChange = useCallback((e) => {
    const valor = e.target.value;
    setClienteInput(valor);
    setMostrarSugerencias(true);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      buscarClientes(valor);
    }, 300);
  }, [buscarClientes]);

  const seleccionarCliente = useCallback((cliente) => {
    setClienteInput(`${cliente.firstName} ${cliente.lastName} (${cliente.dni})`);
    setVenta(prev => ({
      ...prev,
      client: { id: cliente.id }
    }));
    setMostrarSugerencias(false);
  }, []);

  const cargarMembresias = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await membresiaService.obtenerMembresiasActivas();
      setMembresias(res.map(m => ({
        value: m.id,
        label: `${m.name} - $${m.price?.toFixed(2)}`
      })));
    } catch (error) {
      mostrarError(error, 'Error al cargar membresías');
      navigate('/membresias/ventas');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    cargarMembresias();
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [cargarMembresias]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target)) {
        setMostrarSugerencias(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setVenta(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'membershipId') {
      setVenta(prev => ({
        ...prev,
        membership: { id: value }
      }));
    } else {
      handleChange(e);
    }
  }, [handleChange]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!venta.client.id) {
      toast.error('Debe seleccionar un cliente válido.');
      return;
    }

    setIsLoading(true);

    try {
      const datos = {
        client: { id: parseInt(venta.client.id) },
        membership: { id: parseInt(venta.membership.id) },
        paymentMethod: venta.paymentMethod
      };

      await membresiaVentaService.crearVentaMembresia(datos);
      toast.success('Venta de membresía creada exitosamente');

      const clienteCompleto = sugerencias.find(c => c.id === parseInt(venta.client.id));
      const membresiaCompleta = membresias.find(m => m.value === Number(venta.membership.id));

      if (clienteCompleto && membresiaCompleta) {
        const [nombreMembresia, precioTexto] = membresiaCompleta.label.split(' - $');

        const confirmacion = window.confirm('¿Desea imprimir el carnet para el cliente?');
        if (confirmacion) {
          generarCarnetPDF(clienteCompleto, {
            name: nombreMembresia,
            price: parseFloat(precioTexto),
            duration: 30
          });
        }
      } else {
        console.warn('No se pudo encontrar cliente o membresía para imprimir carnet');
      }

      navigate('/membresias/ventas');
    } catch (error) {
      mostrarError(error, 'Error al crear la venta');
    } finally {
      setIsLoading(false);
    }
  };

  const generarCarnetPDF = (cliente, membresia) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85, 54],
    });

    const colorFondo1 = '#374151';
    const colorFondo2 = '#6B7280';

    doc.setFillColor(colorFondo1);
    doc.rect(0, 0, 85, 27, 'F');

    doc.setFillColor(colorFondo2);
    doc.rect(0, 27, 85, 27, 'F');

    doc.setTextColor('#F3F4F6');
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Gym system', 5, 10);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Carnet de Membresía Activa', 5, 17);

    doc.setTextColor('#E5E7EB');
    doc.setFontSize(9);
    doc.text(`Nombre: ${cliente.firstName} ${cliente.lastName}`, 5, 32);
    doc.text(`Cédula: ${cliente.dni}`, 5, 38);
    doc.text(`Teléfono: ${cliente.phone}`, 5, 44);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`Membresía: ${membresia.name}`, 45, 32);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Duración: ${membresia.duration} días`, 45, 38);

    const fechaInicio = cliente.membershipStartDate || 'N/A';
    const fechaFin = cliente.membershipEndDate || 'N/A';

    doc.text(`Desde: ${fechaInicio}`, 45, 44);
    doc.text(`Hasta: ${fechaFin}`, 45, 50);

    doc.text(`Precio: $${membresia.price.toFixed(2)}`, 45, 56);

    const fechaEmision = new Date().toLocaleDateString();
    doc.setFontSize(7);
    doc.setTextColor('#D1D5DB');
    doc.text(`Emitido: ${fechaEmision}`, 65, 53);

    doc.setDrawColor('#D1D5DB');
    doc.setLineWidth(0.7);
    doc.rect(1, 1, 83, 52);

    doc.save(`Carnet-${cliente.firstName}-${cliente.lastName}.pdf`);
  };



  const handleCancel = useCallback(() => {
    navigate('/membresias/ventas');
  }, [navigate]);

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="shadow-sm">
            <Card.Header>
              <h4 className="mb-0">{id ? 'Editar' : 'Nueva'} Venta de Membresía</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <div ref={autocompleteRef} className="position-relative">
                      <Form.Label>Cliente *</Form.Label>
                      <Form.Control
                        type="text"
                        name="cliente"
                        value={clienteInput}
                        onChange={handleClienteInputChange}
                        placeholder="Ingrese nombre o cédula"
                        autoComplete="off"
                        required
                      />
                      {mostrarSugerencias && sugerencias.length > 0 && (
                        <ListGroup
                          className="position-absolute w-100 shadow-sm"
                          style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}
                        >
                          {sugerencias.map(cliente => (
                            <ListGroup.Item
                              key={cliente.id}
                              action
                              onClick={() => seleccionarCliente(cliente)}
                              className="cursor-pointer"
                            >
                              <strong>{cliente.dni}</strong> - {cliente.firstName} {cliente.lastName}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      )}
                    </div>
                  </Col>

                  <Col md={6}>
                    <Form.Label>Membresía *</Form.Label>
                    <Form.Select
                      name="membershipId"
                      value={venta.membership.id}
                      onChange={handleSelectChange}
                      required
                    >
                      <option value="">Seleccione una membresía</option>
                      {membresias.map(membresia => (
                        <option key={membresia.value} value={membresia.value}>
                          {membresia.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  <Col md={6}>
                    <Form.Label>Método de Pago *</Form.Label>
                    <Form.Select
                      name="paymentMethod"
                      value={venta.paymentMethod}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione un método</option>
                      {METODOS_PAGO.map(metodo => (
                        <option key={metodo.value} value={metodo.value}>
                          {metodo.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  <Col xs={12}>
                    <Alert variant="info">
                      <Alert.Heading as="h6">Información importante</Alert.Heading>
                      La fecha de venta se generará automáticamente. La fecha de vencimiento se calculará
                      según la duración de la membresía seleccionada.
                    </Alert>
                  </Col>

                  <Col xs={12}>
                    <div className="d-flex gap-2 justify-content-end">
                      <Button variant="secondary" onClick={handleCancel} disabled={isLoading}>
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isLoading || !venta.client.id || !venta.membership.id || !venta.paymentMethod}
                      >
                        {isLoading ? 'Guardando...' : 'Guardar Venta'}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FormularioVentaMembresia;
