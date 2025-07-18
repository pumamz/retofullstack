import React, { useState, useEffect, useCallback } from "react";
import { clienteService } from "../../services/clienteService";
import { Table, Button, Form, InputGroup, Row, Col, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faSearch, faTimes, faFilter } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { mostrarError } from "../../api/toast";

const ListaClientes = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtrosActivos, setFiltrosActivos] = useState({
    enabled: true,
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
      mostrarError(error, "Error al cargar los clientes");
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
      mostrarError(error, "Error al actualizar el estado");
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

  return (
    <div className="container mt-4">
      <h2>Lista de clientes</h2>
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
              <Button variant="outline-primary">
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </InputGroup>
          </Col>

          <Col md={6} className="d-flex justify-content-between">
            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                onClick={() => setMostrarFiltros(!mostrarFiltros)} >
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
              onClick={() => navigate("/clientes/crear")}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Crear cliente
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

      <Table className="text-center" striped bordered hover responsive>
        <thead>
          <tr>
            <th>DNI</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Altura</th>
            <th>Peso</th>
            <th
              className="text-center">
              Membresía</th>
            <th
              className="text-center">
              Suscripción</th>
            <th
              className="text-center">
              Días restantes</th>
            <th
              className="text-center">
              Editar
            </th>
            <th
              className="text-center">
              Estado
            </th>
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
                <td>{client.height} cm</td>
                <td>{client.weight} kg</td>
                <td
                  className="text-center">
                  {client.membershipType || "-"}
                </td>
                <td
                  className="text-center">
                  {client.membershipStatus ?
                    getMembershipStatusBadge(client.membershipStatus) : "-"}
                </td>
                <td
                  className="text-center">
                  {client.remainingDays != null ? (
                    <span className={
                      client.remainingDays <= 7 ? 'text-danger fw-bold' :
                        client.remainingDays <= 14 ? 'text-warning' : 'text-success'}>
                      {client.remainingDays}
                    </span>) : ("-")
                  }
                </td>
                <td
                  className="text-center">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate(`/clientes/editar/${client.id}`)}
                    disabled={!client.enabled}>
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                </td>
                <td
                  className="text-center">
                  <Form.Check
                    type="switch"
                    checked={client.enabled}
                    onChange={() => handleToggleStatus(client.id, client.enabled)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      <Form.Check
        type="switch"
        id="mostrar-inactivos-switch"
        label="Mostrar inactivos"
        checked={filtrosActivos.enabled === false}
        onChange={(e) => {
          const nuevoEstado = e.target.checked ? false : true;
          handleFiltroChange("enabled", nuevoEstado);
        }}
        className="mb-3"
      />
    </div>
  );
};

export default ListaClientes;