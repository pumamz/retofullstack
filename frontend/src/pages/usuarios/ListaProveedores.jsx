import React, { useState, useEffect, useCallback } from "react";
import { proveedorService } from "../../services/proveedorService";
import { Table, Button, Form, InputGroup, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faSearch, faTimes, } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { mostrarError } from "../../api/toast";

const ListaProveedores = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mostrarInactivos, setMostrarInactivos] = useState(false);


  const loadSuppliers = useCallback(async (term = "", inactivos = false) => {
    try {
      const response = await proveedorService.buscarProveedores(term);
      const filtrados = response.filter(p => p.enabled === !inactivos);
      setSuppliers(filtrados);
    } catch (error) {
      mostrarError(error, "Error al cargar los proveedores");
    }
  }, []);

  useEffect(() => {
    loadSuppliers(searchTerm, mostrarInactivos);
  }, [searchTerm, mostrarInactivos, loadSuppliers]);

  const limpiarBusqueda = async () => {
    setSearchTerm("");
    await loadSuppliers("", mostrarInactivos);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await proveedorService.cambiarEstado(id, !currentStatus);
      toast.success("Estado actualizado correctamente");
      await loadSuppliers(searchTerm, mostrarInactivos);
    } catch (error) {
      mostrarError(error, "Error al actualizar el estado");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lista de proveedores</h2>
      <br />
      <Form className="mb-4">
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
                onClick={limpiarBusqueda}>
                <FontAwesomeIcon icon={faTimes} className="me-2" />
                Limpiar
              </Button>
            </div>
            <Button
              variant="outline-primary"
              onClick={() => navigate("/proveedores/crear")}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Crear proveedor
            </Button>
          </Col>
        </Row>
      </Form>

      <Table className="text-center" striped bordered hover responsive>
        <thead>
          <tr>
            <th>Dni</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Empresa</th>
            <th>RUC</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th className="text-center">Editar</th>
            <th className="text-center">Estado</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(suppliers) && suppliers.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center">
                No se encontraron proveedores
              </td>
            </tr>
          ) : (
            suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td>{supplier.dni}</td>
                <td>{supplier.firstName}</td>
                <td>{supplier.lastName}</td>
                <td>{supplier.company}</td>
                <td>{supplier.ruc}</td>
                <td>{supplier.email}</td>
                <td>{supplier.phone}</td>
                <td className="text-center">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => navigate(`/proveedores/editar/${supplier.id}`)}
                    disabled={!supplier.enabled}>
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                </td>
                <td className="text-center">
                  <Form.Check
                    type="switch"
                    checked={supplier.enabled}
                    onChange={() => handleToggleStatus(supplier.id, supplier.enabled)}
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

export default ListaProveedores;
