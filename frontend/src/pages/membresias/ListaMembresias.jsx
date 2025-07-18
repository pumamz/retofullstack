import React, { useState, useEffect, useCallback } from 'react';
import { membresiaService } from '../../services/membresiaService';
import { Table, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { mostrarError } from '../../api/toast';

const ListaMembresias = () => {
  const navigate = useNavigate();
  const [membresias, setMembresias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [mostrarInactivos, setMostrarInactivos] = useState(false);

  const loadMembresias = useCallback(async (term = '', inactivos = false) => {
    try {
      const response = await membresiaService.buscarMembresias(term);
      const filtradas = response.filter(m => m.enabled === !inactivos);
      setMembresias(filtradas);
    } catch (error) {
      mostrarError(error, 'Error al cargar las membresías');
    }
  }, []);

  useEffect(() => {
    loadMembresias(searchTerm, mostrarInactivos);
  }, [searchTerm, mostrarInactivos, loadMembresias]);

  const limpiarBusqueda = async () => {
    setSearchTerm('');
    await loadMembresias('', mostrarInactivos);
  };

  const handleToggleEstado = async (id, estadoActual) => {
    try {
      await membresiaService.cambiarEstado(id, !estadoActual);
      toast.success('Estado actualizado correctamente');
      await loadMembresias(searchTerm, mostrarInactivos);
    } catch (error) {
      mostrarError(error, 'Error al actualizar el estado');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lista de membresías</h2>
      <br />
      <Form className="mb-4">
        <Row>
          <Col md={6}>
            <InputGroup>
              <Form.Control
                placeholder="Buscar por nombre o descripción"
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
                onClick={limpiarBusqueda}>
                <FontAwesomeIcon icon={faTimes} className="me-2" />
                Limpiar
              </Button>
            </div>
            <Button
              variant="outline-primary"
              onClick={() => navigate('/membresias/crear')}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Crear membresía
            </Button>
          </Col>
        </Row>
      </Form>

      <Table className='text-center' striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Duración (días)</th>
            <th>Fecha de creación</th>
            <th>Descripción</th>
            <th className="text-center">Editar</th>
            <th className="text-center">Estado</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(membresias) && membresias.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                No se encontraron membresías
              </td>
            </tr>
          ) : (
            membresias.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>${m.price.toFixed(2)}</td>
                <td>{m.durationDays}</td>
                <td>{m.creationDate}</td>
                <td>{m.description}</td>
                <td className="text-center">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate(`/membresias/editar/${m.id}`)}
                    disabled={!m.enabled}>
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                </td>
                <td className="text-center">
                  <Form.Check
                    type="switch"
                    checked={m.enabled}
                    onChange={() => handleToggleEstado(m.id, m.enabled)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Form.Check
        type="switch"
        id="switch-inactivos"
        label="Mostrar inactivos"
        checked={mostrarInactivos}
        onChange={() => setMostrarInactivos(!mostrarInactivos)}
        className="mb-3"
      />
    </div>
  );
};

export default ListaMembresias;
