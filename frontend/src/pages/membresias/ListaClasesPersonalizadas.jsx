import React, { useState, useEffect, useCallback } from 'react';
import { clasePersonalizadaService } from '../../services/clasePersonalizadaService';
import { clienteService } from '../../services/clienteService';
import { Table, Button, Form, Modal, OverlayTrigger, Tooltip, Row, Col, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faCheck, faTimes, faClock, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const ListaClasesPersonalizadas = () => {
    const navigate = useNavigate();
    const [clasesPersonalizadas, setClasesPersonalizadas] = useState([]);
    const [todasLasClases, setTodasLasClases] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
    const [filtroFechaFin, setFiltroFechaFin] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [showReprogramarModal, setShowReprogramarModal] = useState(false);
    const [claseAReprogramar, setClaseAReprogramar] = useState(null);
    const [nuevaFecha, setNuevaFecha] = useState('');
    const [nuevoHora, setNuevoHora] = useState('');

    const cargarClases = useCallback(async () => {
        try {
            const data = await clasePersonalizadaService.obtenerClases();
            setTodasLasClases(data);
            setClasesPersonalizadas(data);
        } catch (error) {
            toast.error('Error al cargar clases personalizadas');
        }
    }, []);

    const aplicarFiltros = useCallback(async () => {
        try {
            let resultado = [...todasLasClases];

            if (searchTerm.trim()) {
                const clientes = await clienteService.buscarClientes(searchTerm.trim());
                const idsClientes = clientes.map((c) => c.id);
                resultado = resultado.filter((clase) => idsClientes.includes(clase.client?.id));
            }

            if (filtroEstado) {
                resultado = resultado.filter((clase) => clase.status === filtroEstado);
            }

            if (filtroFechaInicio && filtroFechaFin) {
                resultado = resultado.filter((clase) => {
                    const fechaClase = new Date(clase.date);
                    return fechaClase >= new Date(filtroFechaInicio) && fechaClase <= new Date(filtroFechaFin);
                });
            }

            setClasesPersonalizadas(resultado);
        } catch (error) {
            toast.error('Error al aplicar filtros');
        }
    }, [todasLasClases, searchTerm, filtroEstado, filtroFechaInicio, filtroFechaFin]);

    const limpiarFiltros = async () => {
        setSearchTerm('');
        setFiltroEstado('');
        setFiltroFechaInicio('');
        setFiltroFechaFin('');
        setClasesPersonalizadas(todasLasClases);
        setMostrarFiltros(false);
    };

    const eliminarClasePersonalizada = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta clase personalizada?')) {
            try {
                await clasePersonalizadaService.eliminarClase(id);
                toast.success('Clase eliminada');
                cargarClases();
            } catch (error) {
                toast.error('Error al eliminar clase personalizada');
            }
        }
    };

    const completarClase = async (id) => {
        try {
            await clasePersonalizadaService.completarClase(id);
            toast.success('Clase marcada como completada');
            cargarClases();
        } catch (error) {
            toast.error('Error al completar clase');
        }
    };

    const cancelarClase = async (id) => {
        try {
            await clasePersonalizadaService.cancelarClase(id);
            toast.info('Clase cancelada');
            cargarClases();
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
            cargarClases();
        } catch (error) {
            toast.error('Error al reprogramar clase');
        }
    };

    useEffect(() => {
        cargarClases();
    }, [cargarClases]);

    useEffect(() => {
        aplicarFiltros();
    }, [searchTerm, filtroEstado, filtroFechaInicio, filtroFechaFin, aplicarFiltros]);

    return (
        <div className="container mt-4">
            <h2>Lista de Clases Personalizadas</h2>
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
                            <Button variant="primary">
                                <FontAwesomeIcon icon={faSearch} />
                            </Button>
                        </InputGroup>
                    </Col>
                    <Col md={6} className="d-flex justify-content-between">
                        <div className="d-flex gap-2">
                            <Button onClick={() => setMostrarFiltros(!mostrarFiltros)}>
                                <FontAwesomeIcon icon={faFilter} className="me-2" /> Filtros
                            </Button>
                            <Button onClick={limpiarFiltros}>
                                <FontAwesomeIcon icon={faTimes} className="me-2" /> Limpiar
                            </Button>
                        </div>
                        <Button variant="success" onClick={() => navigate('/membresias/clases/crear')}>
                            <FontAwesomeIcon icon={faPlus} className="me-2" /> Nueva Clase
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
                                        <option value="Scheduled">Programadas</option>
                                        <option value="Completed">Completadas</option>
                                        <option value="Cancelled">Canceladas</option>
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
                    {clasesPersonalizadas.length === 0 ? (
                        <tr>
                            <td colSpan="13" className="text-center">
                                No se encontraron clases personalizadas
                            </td>
                        </tr>
                    ) : (
                        clasesPersonalizadas.map((clase) => (
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
                        ))
                    )}
                </tbody>
            </Table>

            <Modal show={showReprogramarModal} onHide={() => setShowReprogramarModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <FontAwesomeIcon icon={faClock} className="me-2" /> Reprogramar Clase
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
                        <FontAwesomeIcon icon={faClock} className="me-2" /> Reprogramar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ListaClasesPersonalizadas;
