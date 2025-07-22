import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, ListGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { clasePersonalizadaService } from '../../services/clasePersonalizadaService';
import { clienteService } from '../../services/clienteService';
import { mostrarError } from '../../api/toast';

const FormularioClasePersonalizada = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [clase, setClase] = useState({
    className: '',
    description: '',
    date: '',
    time: '',
    price: '',
    paymentMethod: 'Efectivo',
    client: { id: '' }
  });

  const [clienteInput, setClienteInput] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const autocompleteRef = useRef(null);
  const debounceRef = useRef(null);

  const METODOS_PAGO = [
    { value: 'Efectivo', label: 'Efectivo' },
    { value: 'Tarjeta', label: 'Tarjeta' },
    { value: 'Transferencia', label: 'Transferencia' },
    { value: 'Otro', label: 'Otro' }
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
    setClase(prev => ({
      ...prev,
      client: { id: cliente.id }
    }));
    setMostrarSugerencias(false);
  }, []);

  const cargarClase = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const data = await clasePersonalizadaService.obtenerClasePorId(id);
      setClase({
        ...data,
        client: { id: data.client?.id || '' }
      });
      if (data.client) {
        setClienteInput(`${data.client.firstName} ${data.client.lastName} (${data.client.dni})`);
      }
    } catch (error) {
      mostrarError(error, 'Error al cargar la clase');
      navigate('/membresias/clases');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    cargarClase();

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [cargarClase]);

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
    const { name, value, type } = e.target;
    setClase(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clase.client.id) {
      toast.error('Debe seleccionar un cliente válido.');
      return;
    }

    setIsLoading(true);
    try {
      const claseData = {
        ...clase,
        price: parseFloat(clase.price) || 0,
        client: { id: clase.client.id }
      };

      if (isEditing) {
        await clasePersonalizadaService.actualizarClase(id, claseData);
        toast.success('Clase personalizada actualizada exitosamente');
      } else {
        await clasePersonalizadaService.crearClase(claseData);
        toast.success('Clase personalizada creada exitosamente');
      }

      navigate('/membresias/clases');
    } catch (error) {
      mostrarError(error, 'Error al guardar la clase');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = useCallback(() => {
    navigate('/membresias/clases');
  }, [navigate]);

  const isFormValid = clase.className && clase.client.id && clase.date &&
    clase.time && clase.price && clase.paymentMethod;

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="shadow-sm">
            <Card.Header>
              <h3 className="mb-0">
                {isEditing ? 'Editar' : 'Nueva'} Clase Personalizada
              </h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label>Nombre de la clase *</Form.Label>
                    <Form.Control
                      type="text"
                      name="className"
                      value={clase.className}
                      onChange={handleChange}
                      placeholder="Ej: Entrenamiento funcional"
                      required
                    />
                  </Col>

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
                          style={{
                            zIndex: 1000,
                            maxHeight: '200px',
                            overflowY: 'auto'
                          }}
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

                  <Col xs={12}>
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={clase.description}
                      onChange={handleChange}
                      placeholder="Descripción de la clase (opcional)"
                    />
                  </Col>

                  <Col md={4}>
                    <Form.Label>Fecha *</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={clase.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </Col>

                  <Col md={4}>
                    <Form.Label>Hora *</Form.Label>
                    <Form.Control
                      type="time"
                      name="time"
                      value={clase.time}
                      onChange={handleChange}
                      required
                    />
                  </Col>

                  <Col md={4}>
                    <Form.Label>Precio ($) *</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={clase.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      required
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label>Método de pago *</Form.Label>
                    <Form.Select
                      name="paymentMethod"
                      value={clase.paymentMethod}
                      onChange={handleChange}
                      required
                    >
                      {METODOS_PAGO.map(metodo => (
                        <option key={metodo.value} value={metodo.value}>
                          {metodo.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>

                  <Col xs={12}>
                    <div className="d-flex gap-2 justify-content-end">
                      <Button
                        variant="secondary"
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isLoading || !isFormValid}
                      >
                        {isLoading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'} Clase
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

export default FormularioClasePersonalizada;