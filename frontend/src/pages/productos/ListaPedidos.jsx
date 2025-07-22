import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { pedidoService } from "../../services/pedidoService";
import { Table, Button, Modal, Form, InputGroup, Row, Col, } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faSearch, faBoxOpen, faFilter, } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { mostrarError } from "../../api/toast";

const ListaPedidos = () => {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [todosLosPedidos, setTodosLosPedidos] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cantidadesRecibidas, setCantidadesRecibidas] = useState({});
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');
  const [filtroEstado, setFiltroEstado] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const cargarPedidos = useCallback(async () => {
    try {
      const response = await pedidoService.listarPedidos();
      setTodosLosPedidos(response);
      setPedidos(response);
    } catch (error) {
      mostrarError(error, "Error al cargar los pedidos");
    }
  }, []);

  const aplicarFiltros = useCallback(() => {
    try {
      let resultado = [...todosLosPedidos];

      if (searchTerm.trim()) {
        resultado = resultado.filter(
          (p) =>
            p.orderNumber.toString().includes(searchTerm) ||
            p.supplier.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.supplier.lastName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filtroEstado) {
        resultado = resultado.filter((p) => p.status === filtroEstado);
      }

      if (filtroFechaInicio && filtroFechaFin) {
        resultado = resultado.filter((p) => {
          const fechaClase = new Date(p.dateTime);
          return fechaClase >= new Date(filtroFechaInicio) && fechaClase <= new Date(filtroFechaFin);
        });
      }
      setPedidos(resultado);
    } catch (error) {
      mostrarError(error, 'Error al aplicar filtros');
    }
  }, [searchTerm, filtroEstado, filtroFechaInicio, filtroFechaFin, todosLosPedidos]);

  useEffect(() => {
    cargarPedidos();
  }, [cargarPedidos]);

  useEffect(() => {
    aplicarFiltros();
  }, [searchTerm, filtroEstado, filtroFechaFin, filtroFechaFin, aplicarFiltros]);

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await pedidoService.actualizarEstadoPedido(id, nuevoEstado);
      toast.success("Estado actualizado exitosamente");
      cargarPedidos();
    } catch (error) {
      mostrarError(error, "Error al actualizar el estado");
    }
  };

  const registrarRecepcion = async (orderId) => {
    try {
      if (Object.keys(cantidadesRecibidas).length === 0) {
        toast.info("Debe ingresar al menos una cantidad");
        return;
      }

      const cantidadesValidas = Object.values(cantidadesRecibidas).every(
        (cantidad) => cantidad > 0
      );

      if (!cantidadesValidas) {
        toast.info("Las cantidades recibidas deben ser mayores a 0");
        return;
      }

      await pedidoService.recibirPedido(orderId, cantidadesRecibidas);
      toast.success("Recepción registrada exitosamente");
      setPedidoSeleccionado(null);
      setCantidadesRecibidas({});
      cargarPedidos();
    } catch (error) {
      mostrarError(error, "Error al registrar la recepción");
    }
  };

  const limpiarBusqueda = () => {
    setSearchTerm("");
    setFiltroEstado("");
    setFiltroFechaInicio('');
    setFiltroFechaFin('');
    setPedidos(todosLosPedidos);
    setMostrarFiltros(false);
  };

  const handleCantidadRecibidaChange = (detalleId, cantidad) => {
    const cantidadNumerica = parseInt(cantidad) || 0;
    setCantidadesRecibidas((prev) => ({
      ...prev,
      [detalleId]: cantidadNumerica,
    }));
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Pedidos</h2>
      <br />
      <Form className="mb-4">
        <Row>
          <Col md={6}>
            <InputGroup>
              <Form.Control
                placeholder="Buscar por Nº pedido o proveedor"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline-primary">
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </InputGroup>
          </Col>

          <Col md={6} className="d-flex justify-content-between">
            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
              >
                <FontAwesomeIcon icon={faFilter} className="me-2" />
                Filtros
              </Button>
              <Button variant="outline-primary" onClick={limpiarBusqueda}>
                <FontAwesomeIcon icon={faTimes} className="me-2" />
                Limpiar
              </Button>
            </div>
            <Button
              variant="outline-primary"
              onClick={() => navigate("/productos/pedidos/crear")}
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Crear pedido
            </Button>
          </Col>
        </Row>
      </Form>

      {mostrarFiltros && (
        <div className="card mb-4">
          <div className="card-body">
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="Pending">Pendiente</option>
                    <option value="Received">Recibido</option>
                    <option value="Cancelled">Cancelado</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Fecha Inicio</Form.Label>
                  <Form.Control type="date" value={filtroFechaInicio} onChange={(e) => setFiltroFechaInicio(e.target.value)} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Fecha Fin</Form.Label>
                  <Form.Control type="date" value={filtroFechaFin} onChange={(e) => setFiltroFechaFin(e.target.value)} />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </div>
      )}

      <Table className="text-center" striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nº Pedido</th>
            <th>Proveedor</th>
            <th>Fecha</th>
            <th>Notas</th>
            <th>Total</th>
            <th>Entrega</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center">
                No se encontraron pedidos
              </td>
            </tr>
          ) : (
            pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.orderNumber}</td>
                <td>{pedido.supplier.firstName} {pedido.supplier.lastName}</td>
                <td>{pedido.dateTime}</td>
                <td>{pedido.notes}</td>
                <td>${pedido.totalAmount.toFixed(2)}</td>
                <td>{pedido.expectedDeliveryDate}</td>
                <td>
                  <Form.Select
                    size="sm"
                    value={pedido.status}
                    onChange={(e) => actualizarEstado(pedido.id, e.target.value)}
                  >
                    <option value="Pending">Pendiente</option>
                    <option value="Received">Recibido</option>
                    <option value="Cancelled">Cancelado</option>
                  </Form.Select>
                </td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => setPedidoSeleccionado(pedido)}
                  >
                    <FontAwesomeIcon icon={faBoxOpen} />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {pedidoSeleccionado && (
        <Modal
          show={true}
          onHide={() => {
            setPedidoSeleccionado(null);
            setCantidadesRecibidas({});
          }}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Recepción de Pedido #{pedidoSeleccionado.orderNumber}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="alert alert-info">
              Las cantidades ingresadas actualizarán automáticamente el stock
              de los productos.
            </div>
            <Table className="text-center" striped>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad Pedida</th>
                  <th>Cantidad Ya Recibida</th>
                  <th>Cantidad a Recibir</th>
                </tr>
              </thead>
              <tbody>
                {pedidoSeleccionado.details.map((detalle) => (
                  <tr key={detalle.id}>
                    <td>{detalle.product.name}</td>
                    <td>{detalle.quantity}</td>
                    <td>{detalle.receivedQuantity}</td>
                    <td>
                      <Form.Control
                        type="number"
                        size="sm"
                        min="0"
                        max={detalle.quantity - detalle.receivedQuantity}
                        value={cantidadesRecibidas[detalle.id] || ""}
                        onChange={(e) =>
                          handleCantidadRecibidaChange(
                            detalle.id,
                            e.target.value
                          )
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={() => {
                setPedidoSeleccionado(null);
                setCantidadesRecibidas({});
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => registrarRecepcion(pedidoSeleccionado.id)}
            >
              Registrar Recepción
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ListaPedidos;
