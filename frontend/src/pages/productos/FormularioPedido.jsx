import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Container, Row, Col, Card, Badge, Form, Button, Table, InputGroup, ListGroup, Alert } from 'react-bootstrap';
import { proveedorService } from '../../services/proveedorService';
import { productoService } from '../../services/productoService';
import { pedidoService } from '../../services/pedidoService';
import { mostrarError } from '../../api/toast';

const initialPedidoState = {
  supplier: { id: '' },
  expectedDeliveryDate: '',
  notes: '',
  status: 'Pending',
  details: []
};

const initialItemState = {
  product: { id: '' },
  quantity: 1,
  unitPrice: 0
};

const FormularioPedido = () => {
  const navigate = useNavigate();

  const [pedido, setPedido] = useState(initialPedidoState);
  const [item, setItem] = useState(initialItemState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [proveedorInput, setProveedorInput] = useState('');
  const [sugerenciasProveedores, setSugerenciasProveedores] = useState([]);
  const [mostrarProveedores, setMostrarProveedores] = useState(false);
  const [loadingProveedores, setLoadingProveedores] = useState(false);

  const [productoInput, setProductoInput] = useState('');
  const [sugerenciasProductos, setSugerenciasProductos] = useState([]);
  const [mostrarProductos, setMostrarProductos] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.autocomplete-container')) {
        setMostrarProveedores(false);
        setMostrarProductos(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const buscarProveedor = useCallback(async (term) => {
    if (!term.trim()) {
      setSugerenciasProveedores([]);
      return;
    }

    setLoadingProveedores(true);
    try {
      const resultados = await proveedorService.buscarProveedores(term);
      setSugerenciasProveedores(resultados);
    } catch (error) {
      mostrarError(error, 'Error al buscar proveedores');
      setSugerenciasProveedores([]);
    } finally {
      setLoadingProveedores(false);
    }
  }, []);

  const buscarProducto = useCallback(async (term) => {
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

  const seleccionarProveedor = useCallback((proveedor) => {
    setProveedorInput(`${proveedor.firstName} ${proveedor.lastName} (${proveedor.dni})`);
    setPedido(prev => ({ ...prev, supplier: { id: proveedor.id } }));
    setMostrarProveedores(false);
    setErrors(prev => ({ ...prev, supplier: null }));
  }, []);

  const seleccionarProducto = useCallback((producto) => {
    setProductoInput(`${producto.name} - $${producto.priceBuy?.toFixed(2)}`);
    setItem({
      product: { id: producto.id },
      quantity: 1,
      unitPrice: producto.priceBuy || 0
    });
    setMostrarProductos(false);
    setErrors(prev => ({ ...prev, product: null }));
  }, []);

  const handlePedidoChange = useCallback((e) => {
    const { name, value } = e.target;
    setPedido(prev => ({ ...prev, [name]: value }));

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

  const handleProveedorInputChange = useCallback((e) => {
    const value = e.target.value;
    setProveedorInput(value);
    setMostrarProveedores(true);

    if (pedido.supplier.id) {
      setPedido(prev => ({ ...prev, supplier: { id: '' } }));
    }

    buscarProveedor(value);
  }, [buscarProveedor, pedido.supplier.id]);

  const handleProductoInputChange = useCallback((e) => {
    const value = e.target.value;
    setProductoInput(value);
    setMostrarProductos(true);

    if (item.product.id) {
      setItem(initialItemState);
    }

    buscarProducto(value);
  }, [buscarProducto, item.product.id]);

  const validarFormulario = useCallback(() => {
    const newErrors = {};

    if (!pedido.supplier.id) {
      newErrors.supplier = 'Debe seleccionar un proveedor';
    }

    if (!pedido.expectedDeliveryDate) {
      newErrors.expectedDeliveryDate = 'La fecha de entrega es obligatoria';
    }

    if (pedido.details.length === 0) {
      newErrors.details = 'Debe agregar al menos un producto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [pedido]);

  const agregarProducto = useCallback(() => {
    if (!item.product.id) {
      setErrors(prev => ({ ...prev, product: 'Debe seleccionar un producto' }));
      return;
    }

    if (item.quantity <= 0) {
      setErrors(prev => ({ ...prev, quantity: 'La cantidad debe ser mayor a 0' }));
      return;
    }

    const productoExistente = pedido.details.find(d => d.product.id === item.product.id);

    if (productoExistente) {
      setPedido(prev => ({
        ...prev,
        details: prev.details.map(d =>
          d.product.id === item.product.id
            ? { ...d, quantity: d.quantity + item.quantity }
            : d
        )
      }));
    } else {
      setPedido(prev => ({
        ...prev,
        details: [...prev.details, { ...item }]
      }));
    }

    setItem(initialItemState);
    setProductoInput('');
    setErrors(prev => ({ ...prev, product: null, quantity: null }));
  }, [item, pedido.details]);

  const eliminarProducto = useCallback((index) => {
    setPedido(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index)
    }));

    if (errors.details && pedido.details.length <= 1) {
      setErrors(prev => ({ ...prev, details: null }));
    }
  }, [errors.details, pedido.details.length]);

  const actualizarCantidadProducto = useCallback((index, nuevaCantidad) => {
    if (nuevaCantidad <= 0) return;

    setPedido(prev => ({
      ...prev,
      details: prev.details.map((detail, i) =>
        i === index ? { ...detail, quantity: nuevaCantidad } : detail
      )
    }));
  }, []);

  const total = useMemo(() =>
    pedido.details.reduce((acc, d) => acc + (d.quantity * d.unitPrice), 0),
    [pedido.details]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...pedido,
        supplier: { id: parseInt(pedido.supplier.id) },
        details: pedido.details.map(d => ({
          product: { id: d.product.id },
          quantity: d.quantity,
          unitPrice: d.unitPrice
        }))
      };

      await pedidoService.crearPedido(payload);
      toast.success('Pedido registrado exitosamente');
      navigate('/productos/pedidos');
    } catch (error) {
      mostrarError(error, 'Error al registrar el pedido');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = useCallback(() => {
    navigate('/productos/pedidos');
  }, [navigate]);

  const obtenerNombreProducto = useCallback((productId) => {
    const producto = sugerenciasProductos.find(p => p.id === productId);
    return producto?.name || 'Producto';
  }, [sugerenciasProductos]);

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="shadow-sm">
            <Card.Header>
              <h3 className="mb-0">
                Nuevo pedido de productos
              </h3>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <div className="autocomplete-container position-relative">
                      <Form.Group>
                        <Form.Label>Proveedor *</Form.Label>
                        <Form.Control
                          type="text"
                          value={proveedorInput}
                          onChange={handleProveedorInputChange}
                          placeholder="Buscar por nombre o cédula"
                          autoComplete="off"
                          isInvalid={!!errors.supplier}
                        />
                        {loadingProveedores && (
                          <div className="position-absolute end-0 top-50 translate-middle-y pe-3">
                            <div className="spinner-border spinner-border-sm" role="status">
                              <span className="visually-hidden">Buscando...</span>
                            </div>
                          </div>
                        )}
                        <Form.Control.Feedback type="invalid">
                          {errors.supplier}
                        </Form.Control.Feedback>
                      </Form.Group>

                      {mostrarProveedores && sugerenciasProveedores.length > 0 && (
                        <ListGroup
                          className="position-absolute w-100 shadow-sm"
                          style={{ zIndex: 1050, maxHeight: '200px', overflowY: 'auto' }}
                        >
                          {sugerenciasProveedores.map(proveedor => (
                            <ListGroup.Item
                              key={proveedor.id}
                              action
                              onClick={() => seleccionarProveedor(proveedor)}
                            >
                              {proveedor.dni} - {proveedor.firstName} {proveedor.lastName}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      )}
                    </div>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Fecha de Entrega Esperada *</Form.Label>
                      <Form.Control
                        type="date"
                        name="expectedDeliveryDate"
                        value={pedido.expectedDeliveryDate}
                        onChange={handlePedidoChange}
                        isInvalid={!!errors.expectedDeliveryDate}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.expectedDeliveryDate}
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
                        value={pedido.notes}
                        onChange={handlePedidoChange}
                        placeholder="Notas adicionales (opcional)"
                        maxLength={500}
                      />
                      <Form.Text className="text-muted">
                        {pedido.notes.length}/500 caracteres
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
                                  value={productoInput}
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

                  {pedido.details.length > 0 && (
                    <Col md={12}>
                      <Card>
                        <Card.Header>
                          <h6 className="mb-0">Productos del Pedido</h6>
                        </Card.Header>
                        <Card.Body className="p-0">
                          <Table responsive hover>
                            <thead className="table-light">
                              <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio Unit.</th>
                                <th>Subtotal</th>
                                <th width="100">Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pedido.details.map((detail, index) => (
                                <tr key={index}>
                                  <td>{obtenerNombreProducto(detail.product.id)}</td>
                                  <td>
                                    <Form.Control
                                      type="number"
                                      min="1"
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
                              ))}
                            </tbody>
                            <tfoot className="table-light">
                              <tr>
                                <th colSpan="3" className="text-end">Total:</th>
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
                      disabled={loading || !pedido.supplier.id || !pedido.expectedDeliveryDate || pedido.details.length === 0}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Guardando...
                        </>
                      ) : (
                        'Registrar Pedido'
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

export default FormularioPedido;