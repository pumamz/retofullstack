import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Container, Row, Col, Card, Form, Button, Table, InputGroup, ListGroup, Alert, Badge } from 'react-bootstrap';
import { clienteService } from '../../services/clienteService';
import { productoService } from '../../services/productoService';
import { VentaService } from '../../services/ventaService';
import { mostrarError } from '../../api/toast';

const initialVentaState = {
  client: { id: '' },
  paymentMethod: '',
  notes: '',
  details: []
};

const initialItemState = {
  product: { id: '' },
  quantity: 1,
  unitPrice: 0
};

const METODOS_PAGO = [
  { value: 'Efectivo', label: 'Efectivo', icon: '💵' },
  { value: 'Tarjeta', label: 'Tarjeta', icon: '💳' },
  { value: 'Transferencia', label: 'Transferencia Bancaria', icon: '🏦' },
  { value: 'Paypal', label: 'PayPal', icon: '📱' }
];

const FormularioVentaProducto = () => {
  const navigate = useNavigate();

  const [venta, setVenta] = useState(initialVentaState);
  const [item, setItem] = useState(initialItemState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [sugerenciasClientes, setSugerenciasClientes] = useState([]);
  const [mostrarClientes, setMostrarClientes] = useState(false);
  const [loadingClientes, setLoadingClientes] = useState(false);

  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [sugerenciasProductos, setSugerenciasProductos] = useState([]);
  const [mostrarProductos, setMostrarProductos] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [todosProductos, setTodosProductos] = useState([]);

  useEffect(() => {
    const cargarInicial = async () => {
      try {
        const productos = await productoService.buscarProductos('');
        setTodosProductos(productos);
      } catch (error) {
        mostrarError(error, 'Error al cargar productos');
      }
    };

    cargarInicial();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.autocomplete-container')) {
        setMostrarClientes(false);
        setMostrarProductos(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const buscarClientes = useCallback(async (term) => {
    if (!term.trim()) {
      setSugerenciasClientes([]);
      return;
    }

    setLoadingClientes(true);
    try {
      const resultados = await clienteService.buscarClientes(term);
      setSugerenciasClientes(resultados);
    } catch (error) {
      mostrarError(error, 'Error al buscar clientes');
      setSugerenciasClientes([]);
    } finally {
      setLoadingClientes(false);
    }
  }, []);

  const buscarProductos = useCallback(async (term) => {
    if (!term.trim()) {
      setSugerenciasProductos([]);
      return;
    }

    setLoadingProductos(true);
    try {
      const resultados = await productoService.buscarProductos(term);
      setSugerenciasProductos(resultados);
    } catch (error) {
      mostrarError(error, 'Error al buscar productos');
      setSugerenciasProductos([]);
    } finally {
      setLoadingProductos(false);
    }
  }, []);

  const seleccionarCliente = useCallback((cliente) => {
    setVenta(prev => ({ ...prev, client: { id: cliente.id } }));
    setBusquedaCliente(`${cliente.firstName} ${cliente.lastName}`);
    setMostrarClientes(false);
    setErrors(prev => ({ ...prev, client: null }));
  }, []);

  const seleccionarProducto = useCallback((producto) => {
    if (producto.stock <= 0) {
      toast.warning(`El producto ${producto.name} no tiene stock disponible`);
      return;
    }

    setItem({
      product: { id: producto.id },
      quantity: 1,
      unitPrice: producto.priceSale || 0
    });
    setBusquedaProducto(`${producto.name} - $${producto.priceSale?.toFixed(2)}`);
    setMostrarProductos(false);
    setErrors(prev => ({ ...prev, product: null }));
  }, []);

  const handleVentaChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'clienteId') {
      setVenta(prev => ({ ...prev, client: { id: value } }));
    } else {
      setVenta(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  const handleItemChange = useCallback((e) => {
    const { name, value } = e.target;
    setItem(prev => ({
      ...prev,
      [name]: name === 'quantity' ? Math.max(1, Number(value)) : parseFloat(value) || 0
    }));
  }, []);

  const handleClienteInputChange = useCallback((e) => {
    const value = e.target.value;
    setBusquedaCliente(value);
    setMostrarClientes(true);

    if (venta.client.id) {
      setVenta(prev => ({ ...prev, client: { id: '' } }));
    }

    buscarClientes(value);
  }, [buscarClientes, venta.client.id]);

  const handleProductoInputChange = useCallback((e) => {
    const value = e.target.value;
    setBusquedaProducto(value);
    setMostrarProductos(true);

    if (item.product.id) {
      setItem(initialItemState);
    }

    buscarProductos(value);
  }, [buscarProductos, item.product.id]);

  const validarFormulario = useCallback(() => {
    const newErrors = {};

    if (!venta.client.id) {
      newErrors.client = 'Debe seleccionar un cliente';
    }

    if (!venta.paymentMethod) {
      newErrors.paymentMethod = 'Debe seleccionar un método de pago';
    }

    if (venta.details.length === 0) {
      newErrors.details = 'Debe agregar al menos un producto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [venta]);

  const validarStock = useCallback((producto, cantidad) => {
    const productoData = todosProductos.find(p => p.id === producto.id) ||
      sugerenciasProductos.find(p => p.id === producto.id);

    if (!productoData) return false;

    const cantidadExistente = venta.details
      .filter(d => d.product.id === producto.id)
      .reduce((acc, d) => acc + d.quantity, 0);

    return (cantidadExistente + cantidad) <= productoData.stock;
  }, [todosProductos, sugerenciasProductos, venta.details]);

  const agregarProducto = useCallback(() => {
    if (!item.product.id) {
      setErrors(prev => ({ ...prev, product: 'Debe seleccionar un producto' }));
      return;
    }

    if (item.quantity <= 0) {
      setErrors(prev => ({ ...prev, quantity: 'La cantidad debe ser mayor a 0' }));
      return;
    }

    if (!validarStock(item.product, item.quantity)) {
      const productoData = todosProductos.find(p => p.id === item.product.id) ||
        sugerenciasProductos.find(p => p.id === item.product.id);
      toast.error(`Stock insuficiente. Disponible: ${productoData?.stock || 0}`);
      return;
    }

    const productoExistente = venta.details.find(d => d.product.id === item.product.id);

    if (productoExistente) {
      setVenta(prev => ({
        ...prev,
        details: prev.details.map(d =>
          d.product.id === item.product.id
            ? { ...d, quantity: d.quantity + item.quantity }
            : d
        )
      }));
    } else {
      setVenta(prev => ({
        ...prev,
        details: [...prev.details, { ...item }]
      }));
    }

    setItem(initialItemState);
    setBusquedaProducto('');
    setErrors(prev => ({ ...prev, product: null, quantity: null }));
  }, [item, venta.details, validarStock, todosProductos, sugerenciasProductos]);

  const eliminarProducto = useCallback((index) => {
    setVenta(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index)
    }));

    if (errors.details && venta.details.length <= 1) {
      setErrors(prev => ({ ...prev, details: null }));
    }
  }, [errors.details, venta.details.length]);

  const actualizarCantidadProducto = useCallback((index, nuevaCantidad) => {
    if (nuevaCantidad <= 0) return;

    const detail = venta.details[index];
    const otrasUnidades = venta.details
      .filter((_, i) => i !== index && _.product.id === detail.product.id)
      .reduce((acc, d) => acc + d.quantity, 0);

    if (!validarStock(detail.product, nuevaCantidad - detail.quantity)) {
      const productoData = todosProductos.find(p => p.id === detail.product.id) ||
        sugerenciasProductos.find(p => p.id === detail.product.id);
      toast.error(`Stock insuficiente. Disponible: ${productoData?.stock || 0}, En venta: ${otrasUnidades}`);
      return;
    }

    setVenta(prev => ({
      ...prev,
      details: prev.details.map((detail, i) =>
        i === index ? { ...detail, quantity: nuevaCantidad } : detail
      )
    }));
  }, [venta.details, validarStock, todosProductos, sugerenciasProductos]);

  const total = useMemo(() =>
    venta.details.reduce((acc, d) => acc + (d.quantity * d.unitPrice), 0),
    [venta.details]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...venta,
        client: { id: parseInt(venta.client.id) },
        details: venta.details.map(d => ({
          product: { id: d.product.id },
          quantity: d.quantity,
          unitPrice: d.unitPrice
        }))
      };

      await VentaService.crearVenta(payload);
      toast.success('Venta registrada exitosamente');
      navigate('/productos/ventas');
    } catch (error) {
      mostrarError(error, 'Error al registrar la venta');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = useCallback(() => {
    navigate('/productos/ventas');
  }, [navigate]);

  const obtenerDatosProducto = useCallback((productId) => {
    return todosProductos.find(p => p.id === productId) ||
      sugerenciasProductos.find(p => p.id === productId) ||
      { name: 'Producto', stock: 0 };
  }, [todosProductos, sugerenciasProductos]);

  const productosConPocoStock = useMemo(() => {
    return venta.details.filter(detail => {
      const producto = obtenerDatosProducto(detail.product.id);
      return producto.stock <= 5;
    });
  }, [venta.details, obtenerDatosProducto]);

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="shadow-sm">
            <Card.Header>
              <h3 className="mb-0">
                Nueva venta de productos
              </h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <div className="autocomplete-container position-relative">
                      <Form.Group>
                        <Form.Label>Cliente:</Form.Label>
                        <Form.Control
                          type="text"
                          value={busquedaCliente}
                          onChange={handleClienteInputChange}
                          placeholder="Buscar cliente por nombre"
                          autoComplete="off"
                          isInvalid={!!errors.client}
                        />
                        {loadingClientes && (
                          <div className="position-absolute end-0 top-50 translate-middle-y pe-3">
                            <div className="spinner-border spinner-border-sm" role="status">
                              <span className="visually-hidden">Buscando...</span>
                            </div>
                          </div>
                        )}
                        <Form.Control.Feedback type="invalid">
                          {errors.client}
                        </Form.Control.Feedback>
                      </Form.Group>

                      {mostrarClientes && sugerenciasClientes.length > 0 && (
                        <ListGroup
                          className="position-absolute w-100 shadow-sm"
                          style={{ zIndex: 1050, maxHeight: '200px', overflowY: 'auto' }}
                        >
                          {sugerenciasClientes.map(cliente => (
                            <ListGroup.Item
                              key={cliente.id}
                              action
                              onClick={() => seleccionarCliente(cliente)}
                            >
                              <div>
                                <strong>{cliente.firstName} {cliente.lastName}</strong>
                              </div>
                              <small className="text-muted">
                                {cliente.email} - {cliente.phone}
                              </small>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      )}
                    </div>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Método de pago:</Form.Label>
                      <Form.Select
                        name="paymentMethod"
                        value={venta.paymentMethod}
                        onChange={handleVentaChange}
                        isInvalid={!!errors.paymentMethod}
                      >
                        <option value="">Seleccione un método</option>
                        {METODOS_PAGO.map(metodo => (
                          <option key={metodo.value} value={metodo.value}>
                            {metodo.icon} {metodo.label}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.paymentMethod}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Notas</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="notes"
                        value={venta.notes}
                        onChange={handleVentaChange}
                        placeholder="Notas adicionales (opcional)"
                        maxLength={500}
                      />
                      <Form.Text className="text-muted">
                        {venta.notes.length}/500 caracteres
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Card className="border">
                      <Card.Header>
                        <h5 className="mb-0">Agregar Productos</h5>
                      </Card.Header>
                      <Card.Body>
                        <Row className="g-2 align-items-end">
                          <Col md={5}>
                            <div className="autocomplete-container position-relative">
                              <Form.Group>
                                <Form.Label>Buscar Producto</Form.Label>
                                <Form.Control
                                  type="text"
                                  value={busquedaProducto}
                                  onChange={handleProductoInputChange}
                                  placeholder="Buscar por nombre o código"
                                  autoComplete="off"
                                  isInvalid={!!errors.product}
                                />
                                {loadingProductos && (
                                  <div className="position-absolute end-0 top-50 translate-middle-y pe-3">
                                    <div className="spinner-border spinner-border-sm" role="status">
                                      <span className="visually-hidden">Buscando...</span>
                                    </div>
                                  </div>
                                )}
                                <Form.Control.Feedback type="invalid">
                                  {errors.product}
                                </Form.Control.Feedback>
                              </Form.Group>

                              {mostrarProductos && sugerenciasProductos.length > 0 && (
                                <ListGroup
                                  className="position-absolute w-100 shadow-sm"
                                  style={{ zIndex: 1040, maxHeight: '200px', overflowY: 'auto' }}
                                >
                                  {sugerenciasProductos.map(producto => (
                                    <ListGroup.Item
                                      key={producto.id}
                                      action
                                      onClick={() => seleccionarProducto(producto)}
                                      className={producto.stock <= 0 ? 'text-muted' : ''}
                                    >
                                      <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                          <strong>{producto.name}</strong>
                                          <div>
                                            <small className="text-muted">
                                              ${producto.priceSale?.toFixed(2)}
                                            </small>
                                          </div>
                                        </div>
                                        <div className="text-end">
                                          <Badge
                                            bg={producto.stock > 5 ? 'success' : producto.stock > 0 ? 'warning' : 'danger'}
                                          >
                                            Stock: {producto.stock}
                                          </Badge>
                                        </div>
                                      </div>
                                    </ListGroup.Item>
                                  ))}
                                </ListGroup>
                              )}
                            </div>
                          </Col>

                          <Col md={2}>
                            <Form.Group>
                              <Form.Label>Cantidad</Form.Label>
                              <Form.Control
                                type="number"
                                min="1"
                                name="quantity"
                                value={item.quantity}
                                onChange={handleItemChange}
                                isInvalid={!!errors.quantity}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.quantity}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>

                          <Col md={2}>
                            <Form.Group>
                              <Form.Label>Precio Unitario</Form.Label>
                              <InputGroup>
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control
                                  type="number"
                                  step="0.01"
                                  value={item.unitPrice}
                                  readOnly
                                />
                              </InputGroup>
                            </Form.Group>
                          </Col>

                          <Col md={2}>
                            <Form.Group>
                              <Form.Label>Subtotal</Form.Label>
                              <InputGroup>
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control
                                  type="text"
                                  value={(item.quantity * item.unitPrice).toFixed(2)}
                                  readOnly
                                />
                              </InputGroup>
                            </Form.Group>
                          </Col>

                          <Col md={1}>
                            <Button
                              variant="success"
                              onClick={agregarProducto}
                              disabled={!item.product.id || item.quantity <= 0}
                              className="w-100"
                            >
                              +
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>

                  {productosConPocoStock.length > 0 && (
                    <Col md={12}>
                      <Alert variant="warning">
                        <Alert.Heading>⚠️ Advertencia de Stock</Alert.Heading>
                        Los siguientes productos tienen stock bajo:
                        <ul className="mb-0 mt-2">
                          {productosConPocoStock.map((detail, index) => {
                            const producto = obtenerDatosProducto(detail.product.id);
                            return (
                              <li key={index}>
                                <strong>{producto.name}</strong> - Stock disponible: {producto.stock}
                              </li>
                            );
                          })}
                        </ul>
                      </Alert>
                    </Col>
                  )}

                  {venta.details.length > 0 && (
                    <Col md={12}>
                      <Card>
                        <Card.Header>
                          <h6 className="mb-0">Productos de la Venta</h6>
                        </Card.Header>
                        <Card.Body className="p-0">
                          <Table responsive hover>
                            <thead className="table-light">
                              <tr>
                                <th>Producto</th>
                                <th>Stock Disp.</th>
                                <th>Cantidad</th>
                                <th>Precio Unit.</th>
                                <th>Subtotal</th>
                                <th width="100">Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {venta.details.map((detail, index) => {
                                const producto = obtenerDatosProducto(detail.product.id);
                                return (
                                  <tr key={index}>
                                    <td>{producto.name}</td>
                                    <td>
                                      <Badge
                                        bg={producto.stock > 5 ? 'success' : producto.stock > 0 ? 'warning' : 'danger'}
                                      >
                                        {producto.stock}
                                      </Badge>
                                    </td>
                                    <td>
                                      <Form.Control
                                        type="number"
                                        min="1"
                                        max={producto.stock}
                                        value={detail.quantity}
                                        onChange={(e) => actualizarCantidadProducto(index, parseInt(e.target.value))}
                                        style={{ width: '80px' }}
                                        size="sm"
                                      />
                                    </td>
                                    <td>${detail.unitPrice.toFixed(2)}</td>
                                    <td><strong>${(detail.quantity * detail.unitPrice).toFixed(2)}</strong></td>
                                    <td>
                                      <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => eliminarProducto(index)}
                                      >
                                        Eliminar
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                            <tfoot className="table-light">
                              <tr>
                                <th colSpan="4" className="text-end">Total:</th>
                                <th>${total.toFixed(2)}</th>
                                <th></th>
                              </tr>
                            </tfoot>
                          </Table>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}

                  {errors.details && (
                    <Col md={12}>
                      <Alert variant="danger">
                        {errors.details}
                      </Alert>
                    </Col>
                  )}

                  {venta.details.length > 0 && (
                    <Col md={12}>
                      <Card className="bg-light">
                        <Card.Body>
                          <Row>
                            <Col md={8}>
                              <h6>Resumen de la Venta</h6>
                              <p className="mb-1">
                                <strong>Cliente:</strong> {busquedaCliente || 'No seleccionado'}
                              </p>
                              <p className="mb-1">
                                <strong>Método de Pago:</strong> {venta.paymentMethod || 'No seleccionado'}
                              </p>
                              <p className="mb-0">
                                <strong>Productos:</strong> {venta.details.length}
                              </p>
                            </Col>
                            <Col md={4} className="text-end">
                              <h4 className="text-primary">
                                Total: ${total.toFixed(2)}
                              </h4>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}

                  <Col md={12} className="d-flex justify-content-end gap-2 mt-4">
                    <Button
                      variant="secondary"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading || !venta.client.id || !venta.paymentMethod || venta.details.length === 0}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Guardando...
                        </>
                      ) : (
                        'Registrar Venta'
                      )}
                    </Button>
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

export default FormularioVentaProducto;