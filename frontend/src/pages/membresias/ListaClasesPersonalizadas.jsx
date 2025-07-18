import React, { useState, useEffect, useCallback } from 'react';
import { clasePersonalizadaService } from '../../services/clasePersonalizadaService';
import { clienteService } from '../../services/clienteService';
import { Table, Button, Form, Modal, Row, Col, InputGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEllipsisV, faEdit, faTrash, faCheck, faTimes, faClock, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { mostrarError } from '../../api/toast';

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
            mostrarError(error, 'Error al cargar clases personalizadas');
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
            mostrarError(error, 'Error al aplicar filtros');
        }
    }, [todasLasClases, searchTerm, filtroEstado, filtroFechaInicio, filtroFechaFin]);

    const limpiarFiltros = () => {
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
                mostrarError(error, 'Error al eliminar clase personalizada');
            }
        }
    };

    const completarClase = async (id) => {
        try {
            await clasePersonalizadaService.completarClase(id);
            toast.success('Clase marcada como completada');
            cargarClases();
        } catch (error) {
            mostrarError(error, 'Error al completar clase');
        }
    };

    const cancelarClase = async (id) => {
        try {
            await clasePersonalizadaService.cancelarClase(id);
            toast.info('Clase cancelada');
            cargarClases();
        } catch (error) {
            mostrarError(error, 'Error al cancelar clase');
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
            await clasePersonalizadaService.reprogramarClase(claseAReprogramar.id, nuevaFecha, nuevoHora);
            toast.success('Clase reprogramada');
            setShowReprogramarModal(false);
            cargarClases();
        } catch (error) {
            mostrarError(error, 'Error al reprogramar clase');
        }
    };

    const renderEstadoBadge = (estado) => {
        let texto = '';
        switch (estado) {
            case 'Scheduled':
                texto = 'Programada';
                break;
            case 'Completed':
                texto = 'Completada';
                break;
            case 'Cancelled':
                texto = 'Cancelada';
                break;
            default:
                texto = estado;
        }
        return texto;
    };


    useEffect(() => {
        cargarClases();
    }, [cargarClases]);

    useEffect(() => {
        aplicarFiltros();
    }, [searchTerm, filtroEstado, filtroFechaInicio, filtroFechaFin, aplicarFiltros]);

    const renderDropdownActions = (clase) => (
        <DropdownButton
            variant="outline-primary"
            title={<FontAwesomeIcon icon={faEllipsisV} />}
            size="sm"
        >
            <Dropdown.Item
                onClick={() => navigate(`/membresias/clases/editar/${clase.id}`)}
                disabled={['Completed', 'Cancelled'].includes(clase.status)}
            >
                <FontAwesomeIcon icon={faEdit} className="me-2" /> Editar
            </Dropdown.Item>
            <Dropdown.Item
                onClick={() => completarClase(clase.id)}
                disabled={['Completed', 'Cancelled'].includes(clase.status)}
            >
                <FontAwesomeIcon icon={faCheck} className="me-2" /> Completar
            </Dropdown.Item>
            <Dropdown.Item
                onClick={() => cancelarClase(clase.id)}
                disabled={['Completed', 'Cancelled'].includes(clase.status)}
            >
                <FontAwesomeIcon icon={faTimes} className="me-2" /> Cancelar
            </Dropdown.Item>
            <Dropdown.Item
                onClick={() => abrirModalReprogramar(clase)}
                disabled={['Completed', 'Cancelled'].includes(clase.status)}
            >
                <FontAwesomeIcon icon={faClock} className="me-2" /> Reprogramar
            </Dropdown.Item>
            <Dropdown.Item
                onClick={() => eliminarClasePersonalizada(clase.id)}
            >
                <FontAwesomeIcon icon={faTrash} className="me-2" /> Eliminar
            </Dropdown.Item>
        </DropdownButton>
    );

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
                            <Button variant="outline-primary" type="submit">
                                <FontAwesomeIcon icon={faSearch} />
                            </Button>
                        </InputGroup>
                    </Col>
                    <Col md={6} className="d-flex justify-content-between">
                        <div className="d-flex gap-2">
                            <Button variant="outline-primary" onClick={() => setMostrarFiltros(!mostrarFiltros)}>
                                <FontAwesomeIcon icon={faFilter} className="me-2" /> Filtros
                            </Button>
                            <Button variant="outline-primary" onClick={limpiarFiltros}>
                                <FontAwesomeIcon icon={faTimes} className="me-2" /> Limpiar
                            </Button>
                        </div>
                        <Button variant="outline-primary" onClick={() => navigate('/membresias/clases/crear')}>
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
                                    <Form.Select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
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

            <Table className='text-center' striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Nombre Clase</th>
                        <th>Descripción</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Precio</th>
                        <th>Pago</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clasesPersonalizadas.length === 0 ? (
                        <tr>
                            <td colSpan="13" className="text-center">No se encontraron clases personalizadas</td>
                        </tr>
                    ) : (
                        clasesPersonalizadas.map((clase) => (
                            <tr key={clase.id}>
                                <td>{clase.className}</td>
                                <td>{clase.description || 'Sin descripción'}</td>
                                <td>{clase.client?.firstName} {clase.client?.lastName}</td>
                                <td>{clase.date}</td>
                                <td>{clase.time}</td>
                                <td>${clase.price?.toFixed(2)}</td>
                                <td>{clase.paymentMethod}</td>
                                <td className='text-center'>{renderEstadoBadge(clase.status)}</td>
                                <td className='text-center'>{renderDropdownActions(clase)}</td>
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
                            <Form.Control type="date" value={nuevaFecha} onChange={(e) => setNuevaFecha(e.target.value)} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Nueva Hora</Form.Label>
                            <Form.Control type="time" value={nuevoHora} onChange={(e) => setNuevoHora(e.target.value)} required />
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
