import React, { useState, useEffect } from "react";
import { clienteService } from "../../services/clienteService";
import { Table, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const ListaClientes = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadClients = async () => {
    try {
      setLoading(true);
      const response = await clienteService.obtenerClientes();
      setClients(response);
    } catch (error) {
      toast.error("Error al cargar los clientes");
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
      const response = await clienteService.buscarClientes(searchTerm);
      setClients(response);
    } catch (error) {
      toast.error("Error en la búsqueda");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await clienteService.cambiarEstado(id, !currentStatus);
      toast.success("Estado actualizado correctamente");
      await loadClients();
    } catch (error) {
      toast.error("Error al actualizar el estado");
    }
  };

  const eliminarCliente = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      try {
        await clienteService.eliminarCliente(id);
        await loadClients();
        toast.success("Cliente eliminado correctamente");
      } catch (error) {
        toast.error("Error al eliminar el cliente");
      }
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
      <h2>Lista de Clientes</h2>
      <br />
      <Form onSubmit={handleSearch} className="mb-4">
        <div className="row">
          <div className="col-md-8">
            <InputGroup>
              <Form.Control
                placeholder="Buscar por nombre o DNI"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" variant="primary">
                Buscar
              </Button>
              <Button variant="secondary" onClick={loadClients} className="ms-2">
                Limpiar
              </Button>
            </InputGroup>
          </div>
          <div className="col-md-4 text-end">
            <Button variant="success" onClick={() => navigate("/clientes/nuevo")}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Nuevo Cliente
            </Button>
          </div>
        </div>
      </Form>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>DNI</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Edad</th>
            <th>Altura</th>
            <th>Peso</th>
            <th>Estado</th>
            <th>Membresía</th>
            <th>Estado</th>
            <th>Días restantes</th>
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
              <td>{client.age}</td>
              <td>{client.height}</td>
              <td>{client.weight}</td>
              <td>
                <Form.Check
                  type="switch"
                  checked={client.enabled}
                  onChange={() => handleToggleStatus(client.id, client.enabled)}
                />
              </td>
              <td>{client.membershipType}</td>
              <td>{client.membershipStatus}</td>
              <td>{client.remainingDays}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/clientes/editar/${client.id}`)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => eliminarCliente(client.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ListaClientes;
