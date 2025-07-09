
import React, { useState, useEffect } from 'react';
import { ClienteService } from '../../services/clienteService';
import { Table, Button, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ListaClientes = () => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState({ name: '', dni: '' });
  const [loading, setLoading] = useState(false);

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await ClienteService.obtenerClientes();
      setClients(response.data);
    } catch (error) {
      toast.error('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await ClienteService.buscarClientes(search);
      setClients(response.data);
    } catch (error) {
      toast.error('Error en la búsqueda');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await ClienteService.cambiarEstado(id, !currentStatus);
      loadClients();
      toast.success('Estado actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar el estado');
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }


  return (
    <div className="container mt-4">
      <h2>Listado de Clientes</h2>

      <Form onSubmit={handleSearch} className="mb-4">
        <div className="row">
          <div className="col-md-4">
            <InputGroup>
              <Form.Control
                placeholder="Buscar por nombre"
                value={search.name}
                onChange={(e) => setSearch({ ...search, name: e.target.value })}
              />
            </InputGroup>
          </div>
          <div className="col-md-4">
            <InputGroup>
              <Form.Control
                placeholder="Buscar por DNI"
                value={search.dni}
                onChange={(e) => setSearch({ ...search, dni: e.target.value })}
              />
            </InputGroup>
          </div>
          <div className="col-md-4">
            <Button type="submit" variant="primary" className="me-2">
              Buscar
            </Button>
            <Button variant="secondary" onClick={loadClients}>
              Limpiar
            </Button>
          </div>
        </div>
      </Form>

      <Link to="/clientes/crear" className="btn btn-success mb-3">
        Nuevo Cliente
      </Link>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>DNI</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.dni}</td>
              <td>{client.firstName}</td>
              <td>{client.lastName}</td>
              <td>{client.email}</td>
              <td>{client.phone}</td>
              <td>
                <Form.Check
                  type="switch"
                  checked={client.enabled}
                  onChange={() => handleToggleStatus(client.id, client.enabled)}
                />
              </td>
              <td>
                <Link
                  to={`/clientes/editar/${client.id}`}
                  className="btn btn-warning btn-sm me-2"
                >
                  Editar
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleToggleStatus(client.id, client.enabled)}
                >
                  {client.enabled ? 'Desactivar' : 'Activar'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ListaClientes;