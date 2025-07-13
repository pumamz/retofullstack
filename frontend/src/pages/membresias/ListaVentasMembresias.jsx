import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Modal, Row, Col, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye, faTrash, faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { membresiaVentaService } from '../../services/membresiaVentaService';

const ListaVentasMembresias = () => {
    const navigate = useNavigate();
    const [ventas, setVentas] = useState([]);
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [filtroCliente, setFiltroCliente] = useState('');
    const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
    const [filtroFechaFin, setFiltroFechaFin] = useState('');

    useEffect(() => {
        cargarVentas();
    }, []);

    const cargarVentas = async () => {
        try {
            const data = await membresiaVentaService.obtenerVentasMembresias();
            setVentas(data);
        } catch (error) {
            toast.error('Error al cargar ventas de membresías');
        }
    };

    const aplicarFiltros = async () => {
        try {
            if (filtroCliente) {
                const data = await membresiaVentaService.obtenerVentasPorCliente(filtroCliente);
                setVentas(data);
            } else if (filtroFechaInicio && filtroFechaFin) {
                const data = await membresiaVentaService.obtenerVentasPorRangoFechas(filtroFechaInicio, filtroFechaFin);
                setVentas(data);
            } else {
                await cargarVentas();
            }
        } catch (error) {
            toast.error('Error al aplicar filtros');
        }
    };

    const limpiarFiltros = async () => {
        setFiltroCliente('');
        setFiltroFechaInicio('');
        setFiltroFechaFin('');
        await cargarVentas();
    };

    const eliminarVenta = async (id) => {
        if (window.confirm('¿Deseas eliminar esta venta de membresía?')) {
            try {
                await membresiaVentaService.cancelarVentaMembresia(id);
                toast.success('Venta cancelada correctamente');
                await cargarVentas();
            } catch (error) {
                toast.error('Error al cancelar la venta');
            }
        }
    };

    const mostrarDetalles = (venta) => {
        setVentaSeleccionada(venta);
        setShowModal(true);
    };

    return (
        <div className="container mt-4">
            <h2>Lista de Ventas de Membresías</h2>
            <br />
            <Form className="mb-4">
                <Row className="align-items-end">
                    <Col md={2}>
                        <Form.Control
                            type="text"
                            placeholder="ID del Cliente"
                            value={filtroCliente}
                            onChange={(e) => setFiltroCliente(e.target.value)}
                        />
                    </Col>
                    <Col md={2}>
                        <Form.Control
                            type="date"
                            value={filtroFechaInicio}
                            onChange={(e) => setFiltroFechaInicio(e.target.value)}
                        />
                    </Col>
                    <Col md={2}>
                        <Form.Control
                            type="date"
                            value={filtroFechaFin}
                            onChange={(e) => setFiltroFechaFin(e.target.value)}
                        />
                    </Col>

                    <Col md={6} className="d-flex justify-content-between">
                        <div className="d-flex gap-2">
                            <Button
                                size="sm"
                                onClick={aplicarFiltros}>
                                <FontAwesomeIcon icon={faFilter} className="me-2" />
                                Filtrar
                            </Button>
                            <Button
                                size="sm"
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

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Membresía</th>
                        <th>Fecha Venta</th>
                        <th>Precio</th>
                        <th>Inicio</th>
                        <th>Fin</th>
                        <th>Cliente</th>
                        <th>Método de Pago</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ventas.map((venta) => (
                        <tr key={venta.id}>
                            <td>{venta.id}</td>
                            <td>{venta.membership?.name}</td>
                            <td>{venta.saleDate}</td>
                            <td>${venta.totalAmount.toFixed(2)}</td>
                            <td>{venta.startDate}</td>
                            <td>{venta.endDate}</td>
                            <td>{venta.client?.firstName} {venta.client?.lastName}</td>
                            <td>{venta.paymentMethod}</td>
                            <td>{venta.status}</td>
                            <td>
                                <div className="d-flex gap-1 flex-wrap">
                                    <OverlayTrigger placement="top" overlay={<Tooltip>Detalles</Tooltip>}>
                                        <Button
                                            variant="outline-info"
                                            size="sm"
                                            onClick={() => mostrarDetalles(venta)}>
                                            <FontAwesomeIcon icon={faEye} />
                                        </Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger placement="top" overlay={<Tooltip>Eliminar</Tooltip>}>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => eliminarVenta(venta.id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </OverlayTrigger>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Detalles de Venta {ventaSeleccionada?.id}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {ventaSeleccionada && (
                        <>
                            <h6>Cliente</h6>
                            <p><strong>Nombre:</strong> {ventaSeleccionada.client?.firstName} {ventaSeleccionada.client?.lastName}</p>
                            <p><strong>Email:</strong> {ventaSeleccionada.client?.email}</p>
                            <p><strong>Teléfono:</strong> {ventaSeleccionada.client?.phone}</p>

                            <hr />
                            <h6>Membresía</h6>
                            <p><strong>Nombre:</strong> {ventaSeleccionada.membership?.name}</p>
                            <p><strong>Duración:</strong> {ventaSeleccionada.membership?.durationDays} días</p>
                            <p><strong>Precio:</strong> ${ventaSeleccionada.totalAmount.toFixed(2)}</p>

                            <hr />
                            <h6>Venta</h6>
                            <p><strong>Fecha:</strong> {new Date(ventaSeleccionada.saleDate).toLocaleDateString()}</p>
                            <p><strong>Inicio:</strong> {ventaSeleccionada.startDate}</p>
                            <p><strong>Fin:</strong> {ventaSeleccionada.endDate}</p>
                            <p><strong>Método de Pago:</strong> {ventaSeleccionada.paymentMethod}</p>
                            <p><strong>Estado:</strong> {ventaSeleccionada.status}</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ListaVentasMembresias;