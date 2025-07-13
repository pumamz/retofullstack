import React, { useState, useEffect } from 'react';
import { clasePersonalizadaService } from '../../services/clasePersonalizadaService';
import { Table, Button, Form, Modal, OverlayTrigger, Tooltip, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faCheck, faTimes, faClock, faFilter } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const ListaClasesPersonalizadas = () => {
    const navigate = useNavigate();
    const [clasesPersonalizadas, setClasesPersonalizadas] = useState([]);
    const [showReprogramarModal, setShowReprogramarModal] = useState(false);
    const [claseAReprogramar, setClaseAReprogramar] = useState(null);
    const [nuevaFecha, setNuevaFecha] = useState('');
    const [nuevoHora, setNuevoHora] = useState('');
    const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
    const [filtroFechaFin, setFiltroFechaFin] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [filtroClienteDni, setFiltroClienteDni] = useState('');

    const loadClasesPersonalizadas = async () => {
        try {
            const response = await clasePersonalizadaService.obtenerClases();
            setClasesPersonalizadas(response);
        } catch (error) {
            toast.error('Error al cargar clases personalizadas');
        }
    };

    const aplicarFiltros = async () => {
        try {
            let response = [];

            if (filtroClienteDni && filtroEstado) {
                response = await clasePersonalizadaService.obtenerPorClienteYEstado(filtroClienteDni, filtroEstado);
            } else if (filtroClienteDni) {
                response = await clasePersonalizadaService.obtenerPorClienteDni(filtroClienteDni);
            } else if (filtroEstado) {
                response = await clasePersonalizadaService.obtenerPorEstado(filtroEstado);
            } else if (filtroFechaInicio && filtroFechaFin) {
                response = await clasePersonalizadaService.obtenerPorRangoFechas(filtroFechaInicio, filtroFechaFin);
            } else {
                response = await clasePersonalizadaService.obtenerClases();
            }

            setClasesPersonalizadas(response);
        } catch (error) {
            toast.error('Error al aplicar filtros');
        }
    };

    const limpiarFiltros = async () => {
        setFiltroClienteDni('');
        setFiltroEstado('');
        setFiltroFechaInicio('');
        setFiltroFechaFin('');
        await loadClasesPersonalizadas();
    };

    const eliminarClasePersonalizada = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta clase personalizada?')) {
            try {
                await clasePersonalizadaService.eliminarClase(id);
                toast.success('Clase eliminada');
                loadClasesPersonalizadas();
            } catch (error) {
                toast.error('Error al eliminar clase personalizada');
            }
        }
    };

    const completarClase = async (id) => {
        try {
            await clasePersonalizadaService.completarClase(id);
            toast.success('Clase marcada como completada');
            loadClasesPersonalizadas();
        } catch (error) {
            toast.error('Error al completar clase');
        }
    };

    const cancelarClase = async (id) => {
        try {
            await clasePersonalizadaService.cancelarClase(id);
            toast.info('Clase cancelada');
            loadClasesPersonalizadas();
        } catch (error) {
            toast.error('Error al cancelar clase');
        }
    };

    const abrirModalReprogramar = (clase) => {
        setClaseAReprogramar(clase);
        setNuevaFecha('');
        setNuevoHora('');
        setShowReprogramarModal(true);
    };

    const reprogramarClase = async () => {
        try {
            await clasePersonalizadaService.reprogramarClase(
                claseAReprogramar.id,
                nuevaFecha,
                nuevoHora
            );
            toast.success('Clase reprogramada');
            setShowReprogramarModal(false);
            loadClasesPersonalizadas();
        } catch (error) {
            toast.error('Error al reprogramar clase');
        }
    };

    useEffect(() => {
        loadClasesPersonalizadas();
    }, []);

    return (
        <div className="container mt-4">
            <h2>Lista de Clases Personalizadas</h2>
            <br />
            <Form className="mb-4">
                <Row className="align-items-end">
                    <Col md={2}>
                        <Form.Control
                            type="text"
                            value={filtroClienteDni}
                            onChange={(e) => setFiltroClienteDni(e.target.value)}
                            placeholder="Dni del cliente"
                        />
                    </Col>
                    <Col md={2}>
                        <Form.Select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="Scheduled">Programadas</option>
                            <option value="Completed">Completadas</option>
                            <option value="Cancelled">Canceladas</option>
                        </Form.Select>
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

                    <Col md={4} className="d-flex justify-content-between">
                        <div className="d-flex gap-2">
                            <Button
                                size="sm"
                                onClick={aplicarFiltros}
                            >
                                <FontAwesomeIcon icon={faFilter} className="me-2" />
                                Filtrar
                            </Button>
                            <Button
                                size="sm"
                                onClick={limpiarFiltros}
                            >
                                <FontAwesomeIcon icon={faTimes} className="me-2" />
                                Limpiar
                            </Button>
                        </div>
                        <Button
                            variant="success"
                            onClick={() => navigate('/membresias/clases/crear')}
                        >
                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                            Nueva Clase
                        </Button>
                    </Col>
                </Row>
            </Form>




            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre Clase</th>
                        <th>Descripción</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Precio</th>
                        <th>Método de Pago</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clasesPersonalizadas.map((clase) => (
                        <tr key={clase.id}>
                            <td>{clase.id}</td>
                            <td>{clase.className}</td>
                            <td>{clase.description || 'Sin descripción'}</td>
                            <td>{clase.client?.firstName} {clase.client?.lastName}</td>
                            <td>{clase.date}</td>
                            <td>{clase.time}</td>
                            <td>${clase.price?.toFixed(2)}</td>
                            <td>{clase.paymentMethod}</td>
                            <td>{clase.status}</td>
                            <td>
                                <div className="d-flex gap-1 flex-wrap">
                                    <OverlayTrigger placement="top" overlay={<Tooltip>Editar</Tooltip>}>
                                        <Button
                                            variant="outline-warning"
                                            size="sm"
                                            onClick={() => navigate(`/membresias/clases/editar/${clase.id}`)}
                                            disabled={['Completed', 'Cancelled'].includes(clase.status)}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                    </OverlayTrigger>

                                    <OverlayTrigger placement="top" overlay={<Tooltip>Completar</Tooltip>}>
                                        <Button
                                            variant="outline-success"
                                            size="sm"
                                            onClick={() => completarClase(clase.id)}
                                            disabled={['Completed', 'Cancelled'].includes(clase.status)}
                                        >
                                            <FontAwesomeIcon icon={faCheck} />
                                        </Button>
                                    </OverlayTrigger>

                                    <OverlayTrigger placement="top" overlay={<Tooltip>Cancelar</Tooltip>}>
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => cancelarClase(clase.id)}
                                            disabled={['Completed', 'Cancelled'].includes(clase.status)}
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </Button>
                                    </OverlayTrigger>

                                    <OverlayTrigger placement="top" overlay={<Tooltip>Reprogramar</Tooltip>}>
                                        <Button
                                            variant="outline-info"
                                            size="sm"
                                            onClick={() => abrirModalReprogramar(clase)}
                                            disabled={['Completed', 'Cancelled'].includes(clase.status)}
                                        >
                                            <FontAwesomeIcon icon={faClock} />
                                        </Button>
                                    </OverlayTrigger>

                                    <OverlayTrigger placement="top" overlay={<Tooltip>Eliminar</Tooltip>}>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => eliminarClasePersonalizada(clase.id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </OverlayTrigger>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showReprogramarModal} onHide={() => setShowReprogramarModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FontAwesomeIcon icon={faClock} className="me-2" />
                        Reprogramar Clase
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nueva Fecha</Form.Label>
                            <Form.Control
                                type="date"
                                value={nuevaFecha}
                                onChange={(e) => setNuevaFecha(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Nueva Hora</Form.Label>
                            <Form.Control
                                type="time"
                                value={nuevoHora}
                                onChange={(e) => setNuevoHora(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowReprogramarModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={reprogramarClase} disabled={!nuevaFecha || !nuevoHora}>
                        <FontAwesomeIcon icon={faClock} className="me-2" />
                        Reprogramar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ListaClasesPersonalizadas;
