import React, { useState, useEffect } from 'react';
import { ProveedorService } from '../../services/proveedorService';
import { Table, Button, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ListaProveedores = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState({ name: '', dni: '' });

  const loadSuppliers = async () => {
    try {
      const response = await ProveedorService.obtenerProveedores();
      setSuppliers(response.data);
    } catch (error) {
      toast.error('Error al cargar los proveedores');
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await ProveedorService.buscarProveedores(search);
      setSuppliers(response.data);
    } catch (error) {
      toast.error('Error en la búsqueda');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await ProveedorService.cambiarEstado(id, !currentStatus);
      loadSuppliers();
      toast.success('Estado actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar el estado');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Listado de Proveedores</h2>

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
            <Button variant="secondary" onClick={loadSuppliers}>
              Limpiar
            </Button>
          </div>
        </div>
      </Form>

      <Link to="/proveedores/crear" className="btn btn-success mb-3">
        Nuevo Proveedor
      </Link>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>DNI</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Empresa</th>
            <th>RUC</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
        {suppliers.length === 0 ? (
            <tr>
              <td colSpan="13" className="text-center">
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
              <td>
                <Form.Check
                  type="switch"
                  checked={supplier.enabled}
                  onChange={() => handleToggleStatus(supplier.id, supplier.enabled)}
                />
              </td>
              <td>
                <Link
                  to={`/proveedores/editar/${supplier.id}`}
                  className="btn btn-warning btn-sm me-2"
                >
                  Editar
                </Link>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleToggleStatus(supplier.id, supplier.enabled)}
                >
                  {supplier.enabled ? 'Desactivar' : 'Activar'}
                </Button>
              </td>
            </tr>
          ))
          )}
        
        </tbody>
      </Table>
    </div>
  );
};

export default ListaProveedores;
