import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { VentaService } from "../../services/ventaService";
import { Table, Button, Form, Row, Col, Badge, Modal, OverlayTrigger, Tooltip, Card, } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faFileInvoice, faFilter, } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const ListaVentas = () => {
    const navigate = useNavigate();
    const [ventas, setVentas] = useState([]);
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [fechaInicio, setFechaInicio] = useState(new Date());
    const [fechaFin, setFechaFin] = useState(new Date());
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    useEffect(() => {
        cargarVentas();
    }, []);

    const cargarVentas = async () => {
        try {
            const response = await VentaService.listarVentas();
            setVentas(response.data);
        } catch (error) {
            console.error("Error al cargar ventas:", error);
            toast.error("Error al cargar las ventas");
        }
    };

    const buscarPorRangoFecha = async (inicio = fechaInicio, fin = fechaFin) => {
        try {
            const fechaInicioStr = inicio.toISOString().split("T")[0];
            const fechaFinStr = fin.toISOString().split("T")[0];
            const response = await VentaService.obtenerVentasPorFecha(
                fechaInicioStr,
                fechaFinStr
            );
            setVentas(response.data);
        } catch (error) {
            console.error("Error en la búsqueda:", error);
            toast.error("Error al buscar ventas");
        }
    };

    const limpiarFiltros = () => {
        const hoy = new Date();
        setFechaInicio(hoy);
        setFechaFin(hoy);
        cargarVentas();
    };

    const cancelarVenta = async (id) => {
        if (window.confirm("¿Está seguro de cancelar esta venta?")) {
            try {
                await VentaService.cancelarVenta(id);
                toast.success("Venta cancelada exitosamente");
                cargarVentas();
            } catch (error) {
                console.error("Error al cancelar la venta:", error);
                toast.error("Error al cancelar la venta");
            }
        }
    };

    const mostrarDetalles = async (invoiceNumber) => {
        try {
            const response = await VentaService.obtenerVentaPorNumero(invoiceNumber);
            setVentaSeleccionada(response.data);
        } catch (error) {
            console.error("Error al obtener detalles:", error);
            toast.error("Error al cargar los detalles");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Lista de Ventas</h2>
            <br />
            <Form className="mb-4">
                <Row>
                    <Col md={12} className="d-flex justify-content-between">
                        <div className="d-flex gap-2">
                            <Button onClick={() => setMostrarFiltros(!mostrarFiltros)}>
                                <FontAwesomeIcon icon={faFilter} className="me-2" />
                                Filtros
                            </Button>
                            <Button
                                onClick={limpiarFiltros}>
                                <FontAwesomeIcon icon={faTimes} className="me-2" />
                                Limpiar
                            </Button>
                        </div>
                        <Button
                            variant="success"
                            onClick={() => navigate('/membresias/ventas/crear')}>
                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                            Nueva Venta
                        </Button>
                    </Col>
                </Row>
            </Form>

            {mostrarFiltros && (
                <Card className="mb-4">
                    <Card.Body>
                        <h5 className="card-title mb-3">Filtrar por Fecha</h5>
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Desde</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={fechaInicio.toISOString().split("T")[0]}
                                            onChange={(e) => {
                                                const nuevaFecha = new Date(e.target.value);
                                                setFechaInicio(nuevaFecha);
                                                buscarPorRangoFecha(nuevaFecha, fechaFin);
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Hasta</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={fechaFin.toISOString().split("T")[0]}
                                            onChange={(e) => {
                                                const nuevaFecha = new Date(e.target.value);
                                                setFechaFin(nuevaFecha);
                                                buscarPorRangoFecha(fechaInicio, nuevaFecha);
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            )}

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Nº Factura</th>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ventas.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center">
                                No se encontraron ventas
                            </td>
                        </tr>
                    ) : (
                        ventas.map((venta) => (
                            <tr key={venta.id} className={venta.cancelled ? "table-danger" : ""}>
                                <td>{venta.invoiceNumber}</td>
                                <td>{venta.dateTime}</td>
                                <td>{venta.client.firstName}</td>
                                <td>${venta.totalAmount.toFixed(2)}</td>
                                <td>
                                    <Badge bg={venta.cancelled ? "danger" : "success"}>
                                        {venta.cancelled ? "Cancelada" : "Activa"}
                                    </Badge>
                                </td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <OverlayTrigger placement="top" overlay={<Tooltip>Ver Detalles</Tooltip>}>
                                            <Button
                                                size="sm"
                                                variant="info"
                                                onClick={() => mostrarDetalles(venta.invoiceNumber)}
                                            >
                                                <FontAwesomeIcon icon={faFileInvoice} />
                                            </Button>
                                        </OverlayTrigger>
                                        {!venta.cancelled && (
                                            <OverlayTrigger placement="top" overlay={<Tooltip>Cancelar Venta</Tooltip>}>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() => cancelarVenta(venta.id)}
                                                >
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </Button>
                                            </OverlayTrigger>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            {ventaSeleccionada && (
                <Modal show={true} onHide={() => setVentaSeleccionada(null)} size="lg">
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