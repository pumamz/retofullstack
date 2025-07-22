import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { VentaService } from "../../services/ventaService";
import {  Table,  Button,  Modal,  Form,  InputGroup,  Row,  Col,  Badge,  Card,  OverlayTrigger,  Tooltip,} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faPlus,  faTimes,  faSearch,  faFilter,  faFileInvoice,} from "@fortawesome/free-solid-svg-icons";
import { mostrarError } from "../../api/toast";

const ListaVentas = () => {
  const navigate = useNavigate();
  const [ventas, setVentas] = useState([]);
  const [todasLasVentas, setTodasLasVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estado, setEstado] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const cargarVentas = useCallback(async () => {
    try {
      const response = await VentaService.listarVentas();
      setTodasLasVentas(response.data);
      setVentas(response.data);
    } catch (error) {
      mostrarError(error, "Error al cargar las ventas");
    }
  }, []);

  const aplicarFiltros = useCallback(() => {
    try {
      let resultado = [...todasLasVentas];

      if (searchTerm.trim()) {
        resultado = resultado.filter(
          (v) =>
            v.invoiceNumber.toString().includes(searchTerm) ||
            v.client?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.client?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (estado) {
        resultado = resultado.filter((v) =>
          estado === "Activa" ? !v.cancelled : v.cancelled
        );
      }

      if (fechaInicio && fechaFin) {
        resultado = resultado.filter((v) => {
          const fecha = new Date(v.dateTime);
          return (
            fecha >= new Date(fechaInicio) && fecha <= new Date(fechaFin)
          );
        });
      }

      setVentas(resultado);
    } catch (error) {
      mostrarError(error, "Error al aplicar filtros");
    }
  }, [searchTerm, estado, fechaInicio, fechaFin, todasLasVentas]);

  useEffect(() => {
    cargarVentas();
  }, [cargarVentas]);

  useEffect(() => {
    aplicarFiltros();
  }, [searchTerm, estado, fechaInicio, fechaFin, aplicarFiltros]);

  const limpiarFiltros = () => {
    setSearchTerm("");
    setEstado("");
    setFechaInicio("");
    setFechaFin("");
    setVentas(todasLasVentas);
    setMostrarFiltros(false);
  };

  const mostrarDetalles = async (invoiceNumber) => {
    try {
      const response = await VentaService.obtenerVentaPorNumero(invoiceNumber);
      setVentaSeleccionada(response.data);
    } catch (error) {
      mostrarError(error, "Error al obtener detalles");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Ventas</h2>
      <br />
      <Form className="mb-4">
        <Row>
          <Col md={6}>
            <InputGroup>
              <Form.Control
                placeholder="Buscar por Nº factura o cliente"
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
              <Button variant="outline-primary" onClick={limpiarFiltros}>
                <FontAwesomeIcon icon={faTimes} className="me-2" />
                Limpiar
              </Button>
            </div>
            <Button
              variant="outline-primary"
              onClick={() => navigate("/productos/ventas/crear")}
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Nueva Venta
            </Button>
          </Col>
        </Row>
      </Form>

      {mostrarFiltros && (
        <Card className="mb-4">
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Estado</Form.Label>
                  <Form.Select value={estado} onChange={(e) => setEstado(e.target.value)}>
                    <option value="">Todos</option>
                    <option value="Activa">Activa</option>
                    <option value="Cancelada">Cancelada</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Fecha Inicio</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Fecha Fin</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      <Table striped bordered hover responsive className="text-center">
        <thead>
          <tr>
            <th>Nº Factura</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Notas</th>
            <th>Pago</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Detalles</th>
          </tr>
        </thead>
        <tbody>
          {ventas.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center">
                No se encontraron ventas
              </td>
            </tr>
          ) : (
            ventas.map((venta) => (
              <tr key={venta.id} className={venta.cancelled ? "table-danger" : ""}>
                <td>{venta.invoiceNumber}</td>
                <td>{venta.client?.firstName} {venta.client?.lastName}</td>
                <td>{venta.dateTime}</td>
                <td>{venta.notes}</td>
                <td>{venta.paymentMethod}</td>
                <td>${venta.totalAmount.toFixed(2)}</td>
                <td>
                  <Badge bg={venta.cancelled ? "danger" : "success"}>
                    {venta.cancelled ? "Cancelada" : "Activa"}
                  </Badge>
                </td>
                <td>
                  <OverlayTrigger placement="top" overlay={<Tooltip>Ver Detalles</Tooltip>}>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => mostrarDetalles(venta.invoiceNumber)}
                    >
                      <FontAwesomeIcon icon={faFileInvoice} />
                    </Button>
                  </OverlayTrigger>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {ventaSeleccionada && (
        <Modal
          show={true}
          onHide={() => setVentaSeleccionada(null)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Detalles de Venta - Factura #{ventaSeleccionada.invoiceNumber}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table bordered>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {ventaSeleccionada.details?.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No se encontraron productos
                    </td>
                  </tr>
                ) : (
                  ventaSeleccionada.details.map((detalle, index) => (
                    <tr key={index}>
                      <td>{detalle.product.name}</td>
                      <td>{detalle.quantity}</td>
                      <td>${detalle.unitPrice.toFixed(2)}</td>
                      <td>${detalle.subtotal.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setVentaSeleccionada(null)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ListaVentas;