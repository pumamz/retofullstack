import React, { useState, useEffect } from 'react';
import { membresiaService } from '../../services/membresiaService';
import { Table, Button, Form, InputGroup, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { mostrarError } from '../../api/toast';

const ListaMembresias = () => {
    const navigate = useNavigate();
    const [membresias, setMembresias] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const loadMembresias = async () => {
        try {
            const response = await membresiaService.obtenerMembresias();
            setMembresias(response);
        } catch (error) {
            mostrarError(error, 'Error al cargar las membresías');
        }
    };

    useEffect(() => {
        loadMembresias();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await membresiaService.buscarMembresias(searchTerm);
            setMembresias(response);
        } catch (error) {
            mostrarError(error, 'Error en la búsqueda');
        }
    };

    const handleToggleEstado = async (id, estadoActual) => {
        try {
            if (estadoActual) {
                await membresiaService.desactivarMembresia(id);
                toast.success('Membresía desactivada');
            } else {
                await membresiaService.activarMembresia(id);
                toast.success('Membresía activada');
            }
            loadMembresias();
        } catch (error) {
            mostrarError(error, 'Error al cambiar el estado de la membresía');
        }
    };

    const eliminarMembresia = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta membresía?')) {
            try {
                await membresiaService.eliminarMembresia(id);
                await loadMembresias();
                toast.success('Membresía eliminada');
            } catch (error) {
                mostrarError(error, 'Error al eliminar la membresía');
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Listado de Membresías</h2>
            <br />
            <Form onSubmit={handleSearch} className="mb-4">
                <Row>
                    <Col md={6}>
                        <InputGroup>
                            <Form.Control
                                placeholder="Buscar por nombre o descripción"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} />
                        </InputGroup>
                    </Col>
                    <Col md={6} className="d-flex justify-content-between">
                        <div className="d-flex gap-2">
                            <Button
                                type="submit"
                                variant="primary">
                                Buscar
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={loadMembresias} className="ms-2">
                                Limpiar
                            </Button>
                        </div>
                        <Button
                            variant="success"
                            onClick={() => navigate('/membresias/crear')}>
                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                            Nueva Membresía
                        </Button>
                    </Col>
                </Row>
            </Form>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Duración (días)</th>
                        <th>Fecha de creación</th>
                        <th>Estado</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {membresias.length === 0 ? (
                        <tr>
                            <td colSpan="13" className="text-center">
                                No se encontraron membresias
                            </td>
                        </tr>
                    ) : (
                        membresias.map((m) => (
                            <tr key={m.id}>
                                <td>{m.name}</td>
                                <td>${m.price.toFixed(2)}</td>
                                <td>{m.durationDays}</td>
                                <td>{m.creationDate}</td>
                                <td>
                                    <Form.Check
                                        type="switch"
                                        checked={m.active}
                                        onChange={() => handleToggleEstado(m.id, m.active)}
                                    />
                                </td>
                                <td>{m.description}</td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => navigate(`/membresias/editar/${m.id}`)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => eliminarMembresia(m.id)}
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
        </div >
    );
};

export default ListaMembresias;
