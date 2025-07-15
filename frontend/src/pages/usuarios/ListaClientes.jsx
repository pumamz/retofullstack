import React, { useState, useEffect, useCallback } from "react";
import { clienteService } from "../../services/clienteService";
import { Table, Button, Form, InputGroup, Row, Col, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash, faSearch, faTimes, faFilter } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const ListaClientes = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtrosActivos, setFiltrosActivos] = useState({
    enabled: undefined,
    membershipType: "",
    membershipStatus: ""
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const loadClients = useCallback(async (filtros = {}) => {
    try {
      const filtrosCompletos = {
        searchTerm,
        ...filtrosActivos,
        ...filtros
      };
      const response = await clienteService.filtrarClientes(filtrosCompletos);
      setClients(response);
    } catch (error) {
      toast.error("Error al cargar los clientes");
    }
  }, [searchTerm, filtrosActivos]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleSearch = async (e) => {
    e.preventDefault();
    await loadClients({ searchTerm });
  };

  const handleFiltroChange = async (key, value) => {
    const nuevosFiltros = { ...filtrosActivos, [key]: value };
    setFiltrosActivos(nuevosFiltros);
    await loadClients(nuevosFiltros);
  };

  const limpiarFiltros = async () => {
    setSearchTerm("");
    setFiltrosActivos({
      enabled: undefined,
      membershipType: "",
      membershipStatus: ""
    });
    await loadClients({
      searchTerm: "",
      enabled: undefined,
      membershipType: "",
      membershipStatus: ""
    });
    setMostrarFiltros(false);
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

  const getMembershipStatusBadge = (status) => {
    const statusConfig = {
      'Active': { variant: 'success', text: 'Activa' },
      'Expired': { variant: 'danger', text: 'Expirada' },
      'Suspended': { variant: 'warning', text: 'Suspendida' },
      'Cancelled': { variant: 'secondary', text: 'Cancelada' }
    };

    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const contarFiltrosActivos = () => {
    let count = 0;
    if (searchTerm) count++;
    if (filtrosActivos.enabled !== undefined) count++;
    if (filtrosActivos.membershipType) count++;
    if (filtrosActivos.membershipStatus) count++;
    return count;
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Clientes</h2>
      <br />
      <Form onSubmit={handleSearch} className="mb-4">
        <Row>
          <Col md={6}>
            <InputGroup>
              <Form.Control
                placeholder="Buscar por nombre o DNI"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" variant="primary">
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </InputGroup>
          </Col>

          <Col md={6} className="d-flex justify-content-between">
            <div className="d-flex gap-2">
              <Button
                onClick={() => setMostrarFiltros(!mostrarFiltros)} >
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
              onClick={() => navigate("/clientes/crear")}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Nuevo Cliente
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Panel de filtros expandible */}
      {mostrarFiltros && (
        <div className="card mb-4">
          <div className="card-body">
            <h6 className="card-title">Filtros Avanzados</h6>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Estado del Cliente</Form.Label>
                  <Form.Select
                    value={filtrosActivos.enabled === undefined ? "" : filtrosActivos.enabled.toString()}
                    onChange={(e) => {
                      const value = e.target.value === "" ? undefined : e.target.value === "true";
                      handleFiltroChange("enabled", value);
                    }}
                  >
                    <option value="">Todos</option>
                    <option value="true">Activos</option>
                    <option value="false">Inactivos</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Tipo de Membresía</Form.Label>
                  <Form.Select
                    value={filtrosActivos.membershipType}
                    onChange={(e) => handleFiltroChange("membershipType", e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="Mensual">Mensual</option>
                    <option value="Trimestral">Trimestral</option>
                    <option value="Anual">Anual</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Estado de Membresía</Form.Label>
                  <Form.Select
                    value={filtrosActivos.membershipStatus}
                    onChange={(e) => handleFiltroChange("membershipStatus", e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="Active">Activa</option>
                    <option value="Expired">Expirada</option>
                    <option value="Suspended">Suspendida</option>
                    <option value="Cancelled">Cancelada</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </div>
        </div>
      )}

      {/* Tabla de clientes */}
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
            <th>Suscripción</th>
            <th>Días restantes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.length === 0 ? (
            <tr>
              <td colSpan="13" className="text-center">
                No se encontraron clientes
              </td>
            </tr>
          ) : (
            clients.map((client) => (
              <tr key={client.id}>
                <td>{client.dni}</td>
                <td>{client.firstName}</td>
                <td>{client.lastName}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>{client.age}</td>
                <td>{client.height} cm</td>
                <td>{client.weight} kg</td>
                <td>
                  <Form.Check
                    type="switch"
                    checked={client.enabled}
                    onChange={() => handleToggleStatus(client.id, client.enabled)}
                  />
                </td>
                <td> {client.membershipType} </td>
                <td>{getMembershipStatusBadge(client.membershipStatus)}</td>
                <td>
                  <span className={client.remainingDays <= 7 ? 'text-danger fw-bold' :
                    client.remainingDays <= 7 ? 'text-warning' : 'text-success'}>
                    {client.remainingDays} días
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <OverlayTrigger placement="top" overlay={<Tooltip>Editar</Tooltip>}>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => navigate(`/clientes/editar/${client.id}`)}
                        disabled={[0].includes(client.enabled)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                    </OverlayTrigger>

                    <OverlayTrigger placement="top" overlay={<Tooltip>Eliminar</Tooltip>}>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => eliminarCliente(client.id)}>
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

      {/* Información de resultados */}
      {clients.length > 0 && (
        <div className="mt-3 text-muted">
          Mostrando {clients.length} cliente{clients.length !== 1 ? 's' : ''}
          {contarFiltrosActivos() > 0 && ' (filtrados)'}
        </div>
      )}
    </div>
  );
};

export default ListaClientes;