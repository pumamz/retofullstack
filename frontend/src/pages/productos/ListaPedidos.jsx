import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PedidoService } from "../../services/pedidoService";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { mostrarError } from "../../api/toast";

const ListaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [cantidadesRecibidas, setCantidadesRecibidas] = useState({});

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const response = await PedidoService.listarPedidos();
      setPedidos(response.data);
    } catch (error) {
      mostrarError(error, "Error al cargar los pedidos");
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await PedidoService.actualizarEstadoPedido(id, nuevoEstado);
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

      await PedidoService.recibirPedido(orderId, cantidadesRecibidas);
      toast.success("Recepción registrada exitosamente");
      setPedidoSeleccionado(null);
      setCantidadesRecibidas({});
      cargarPedidos();
    } catch (error) {
      mostrarError(error, "Error al registrar la recepción");
    }
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Lista de Pedidos</h2>
        <Button variant="success" as={Link} to="/productos/pedidos/crear">
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Nuevo Pedido
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nº Pedido</th>
            <th>Fecha</th>
            <th>Proveedor</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No se encontraron pedidos
              </td>
            </tr>
          ) : (
            pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.orderNumber}</td>
                <td>{pedido.dateTime}</td>
                <td>{pedido.supplier.firstName}</td>
                <td>${pedido.totalAmount.toFixed(2)}</td>
                <td>
                  <Form.Select
                    size="sm"
                    value={pedido.status}
                    onChange={(e) =>
                      actualizarEstado(pedido.id, e.target.value)
                    }
                  >
                    <option value="Pending">Pendiente</option>
                    <option value="Received">Recibido</option>
                    <option value="Cancelled">Cancelado</option>
                  </Form.Select>
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="info"
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
            <Table striped bordered>
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
              variant="secondary"
              onClick={() => {
                setPedidoSeleccionado(null);
                setCantidadesRecibidas({});
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
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