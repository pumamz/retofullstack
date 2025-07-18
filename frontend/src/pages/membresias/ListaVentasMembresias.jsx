import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Modal, InputGroup, Row, Col, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye, faTrash, faFilter, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { membresiaVentaService } from '../../services/membresiaVentaService';
import { clienteService } from '../../services/clienteService';
import { mostrarError } from '../../api/toast';

const ListaVentasMembresias = () => {
    const navigate = useNavigate();
    const [ventas, setVentas] = useState([]);
    const [todasLasVentas, setTodasLasVentas] = useState([]);
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
    const [filtroFechaFin, setFiltroFechaFin] = useState('');
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [filtroEstado, setFiltroEstado] = useState('');

    const cargarVentas = useCallback(async () => {
        try {
            const data = await membresiaVentaService.obtenerVentasMembresias();
            setTodasLasVentas(data);
            setVentas(data);
        } catch (error) {
            mostrarError(error, 'Error al cargar ventas de membresías');
        }
    }, []);

    const aplicarFiltros = useCallback(async () => {
        try {
            let filtradas = [...todasLasVentas];

            if (searchTerm.trim()) {
                const clientes = await clienteService.buscarClientes(searchTerm.trim());
                const idsClientes = clientes.map((c) => c.id);
                filtradas = filtradas.filter((v) => idsClientes.includes(v.client?.id));
            }

            if (filtroEstado) {
                filtradas = filtradas.filter((v) => v.status === filtroEstado);
            }

            if (filtroFechaInicio && filtroFechaFin) {
                filtradas = filtradas.filter((v) => {
                    const fechaVenta = new Date(v.saleDate);
                    return (
                        fechaVenta >= new Date(filtroFechaInicio) &&
                        fechaVenta <= new Date(filtroFechaFin)
                    );
                });
            }

            setVentas(filtradas);
        } catch (error) {
            mostrarError(null, 'Error al aplicar filtros');
        }
    }, [searchTerm, filtroFechaInicio, filtroFechaFin, filtroEstado, todasLasVentas]);


    const limpiarFiltros = async () => {
        setSearchTerm('');
        setFiltroFechaInicio('');
        setFiltroFechaFin('');
        setFiltroEstado('');
        setVentas(todasLasVentas);
        setMostrarFiltros(false);
    };

    const renderEstadoBadge = (estado) => {
        let variant = '';
        let texto = '';

        switch (estado) {
            case 'Active':
                variant = 'success';
                texto = 'Activa';
                break;
            case 'Cancelled':
                variant = 'danger';
                texto = 'Cancelada';
                break;
            case 'Expired':
                variant = 'secondary';
                texto = 'Expirada';
                break;
            default:
                variant = 'warning';
                texto = estado;
        }

        return <span className={`badge bg-${variant}`}>{texto}</span>;
    };

    useEffect(() => {
        cargarVentas();
    }, [cargarVentas]);

    useEffect(() => {
        aplicarFiltros();
    }, [searchTerm, filtroFechaInicio, filtroFechaFin, filtroEstado, aplicarFiltros]);

    const eliminarVenta = async (id) => {
        if (window.confirm('¿Deseas eliminar esta venta de membresía?')) {
            try {
                await membresiaVentaService.cancelarVentaMembresia(id);
                toast.success('Venta cancelada correctamente');
                await cargarVentas();
            } catch (error) {
                mostrarError('Error al cancelar la venta');
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
                <Row>
                    <Col md={6}>
                        <InputGroup>
                            <Form.Control
                                placeholder="Buscar cliente por nombre o DNI"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button
                                variant="outline-primary"
                                type="submit" >
                                <FontAwesomeIcon icon={faSearch} />
                            </Button>
                        </InputGroup>
                    </Col>

                    <Col md={6} className="d-flex justify-content-between">
                        <div className="d-flex gap-2">
                            <Button
                                variant="outline-primary"
                                onClick={() => setMostrarFiltros(!mostrarFiltros)}>
                                <FontAwesomeIcon icon={faFilter} className="me-2" />
                                Filtros
                            </Button>
                            <Button
                                variant="outline-primary"
                                onClick={limpiarFiltros}>
                                <FontAwesomeIcon icon={faTimes} className="me-2" />
                                Limpiar
                            </Button>
                        </div>
                        <Button
                            variant="outline-primary"
                            onClick={() => navigate('/membresias/ventas/crear')}>
                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                            Nueva Venta
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
                                    <Form.Select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                                        <option value="">Todos</option>
                                        <option value="Active">Activas</option>
                                        <option value="Cancelled">Canceladas</option>
                                        <option value="Expired">Expiradas</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Fecha Inicio</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={filtroFechaInicio}
                                        onChange={(e) => setFiltroFechaInicio(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Fecha Fin</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={filtroFechaFin}
                                        onChange={(e) => setFiltroFechaFin(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>
                </div>
            )}

            <Table className='text-center' striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Membresía</th>
                        <th>Fecha Venta</th>
                        <th>Precio</th>
                        <th>Inicio</th>
                        <th>Fin</th>
                        <th>Cliente</th>
                        <th>Estado</th>
                        <th>Pago</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ventas.length === 0 ? (
                        <tr>
                            <td colSpan="13" className="text-center">
                                No se encontraron suscripciones
                            </td>
                        </tr>
                    ) : (
                        ventas.map((venta) => (
                            <tr key={venta.id}>
                                <td>{venta.membership?.name}</td>
                                <td>{venta.saleDate}</td>
                                <td>${venta.totalAmount.toFixed(2)}</td>
                                <td>{venta.startDate}</td>
                                <td>{venta.endDate}</td>
                                <td>{venta.client?.firstName} {venta.client?.lastName}</td>
                                <td>{renderEstadoBadge(venta.status)}</td>
                                <td>{venta.paymentMethod}</td>
                                <td>
                                    <div className="d-flex text-center gap-1 flex-wrap">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => mostrarDetalles(venta)}
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => eliminarVenta(venta.id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles de Venta #{ventaSeleccionada?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {ventaSeleccionada && (
                        <>
                            <h6>Cliente</h6>
                            <p>
                                <strong>Nombre:</strong> {ventaSeleccionada.client?.firstName}{' '}
                                {ventaSeleccionada.client?.lastName}
                            </p>
                            <p>
                                <strong>Email:</strong> {ventaSeleccionada.client?.email}
                            </p>
                            <p>
                                <strong>Teléfono:</strong> {ventaSeleccionada.client?.phone}
                            </p>

                            <hr />
                            <h6>Membresía</h6>
                            <p>
                                <strong>Nombre:</strong> {ventaSeleccionada.membership?.name}
                            </p>
                            <p>
                                <strong>Duración:</strong> {ventaSeleccionada.membership?.durationDays} días
                            </p>
                            <p>
                                <strong>Precio:</strong> ${ventaSeleccionada.totalAmount.toFixed(2)}
                            </p>

                            <hr />
                            <h6>Venta</h6>
                            <p>
                                <strong>Fecha:</strong>{' '}
                                {new Date(ventaSeleccionada.saleDate).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Inicio:</strong> {ventaSeleccionada.startDate}
                            </p>
                            <p>
                                <strong>Fin:</strong> {ventaSeleccionada.endDate}
                            </p>
                            <p>
                                <strong>Método de Pago:</strong> {ventaSeleccionada.paymentMethod}
                            </p>
                            <p>
                                <strong>Estado:</strong> {renderEstadoBadge(ventaSeleccionada.status)}
                            </p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ListaVentasMembresias;