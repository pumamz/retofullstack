import React, { useState, useEffect, useCallback } from "react";
import { productoService } from "../../services/productoService";
import { Table, Button, Form, InputGroup, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { mostrarError } from "../../api/toast";

const ListaProductos = () => {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [mostrarInactivos, setMostrarInactivos] = useState(false);

    const loadProducts = useCallback(async (term = "", inactivos = false) => {
        try {
            const response = await productoService.buscarProductos(term);
            const filtrados = response.filter(p => p.enabled === !inactivos);
            setProductos(filtrados);
        } catch (error) {
            mostrarError(error, "Error al cargar los productos");
        }
    }, []);

    useEffect(() => {
        loadProducts(searchTerm, mostrarInactivos);
    }, [searchTerm, mostrarInactivos, loadProducts]);

    const limpiarBusqueda = async () => {
        setSearchTerm("");
        await loadProducts("", mostrarInactivos);
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await productoService.cambiarEstado(id, !currentStatus);
            toast.success("Estado actualizado correctamente");
            await loadProducts(searchTerm, mostrarInactivos);
        } catch (error) {
            mostrarError(error, "Error al actualizar el estado");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Lista de productos</h2>
            <br />
            <Form className="mb-4">
                <Row>
                    <Col md={6}>
                        <InputGroup>
                            <Form.Control
                                placeholder="Buscar por nombre o código"
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
                            onClick={() => navigate("/productos/crear")}>
                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                            Crear producto
                        </Button>
                    </Col>
                </Row>
            </Form>

            <Table className="text-center" striped bordered hover responsive>
                <thead className="text-center">
                    <tr>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio Compra</th>
                        <th>Precio Venta</th>
                        <th>Stock</th>
                        <th>Stock Mínimo</th>
                        <th>Editar</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {productos.length === 0 ? (
                        <tr>
                            <td colSpan="10">No se encontraron productos</td>
                        </tr>
                    ) : (
                        productos.map((producto) => (
                            <tr key={producto.id}
                                className={producto.stock <= producto.minimumStock ? "table-warning" : ""}
                            >
                                <td>{producto.barcode}</td>
                                <td>{producto.name}</td>
                                <td>{producto.description}</td>
                                <td>${producto.priceBuy.toFixed(2)}</td>
                                <td>${producto.priceSale.toFixed(2)}</td>
                                <td>{producto.stock}</td>
                                <td>{producto.minimumStock}</td>
                                <td>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => navigate(`/productos/editar/${producto.id}`)}
                                        disabled={!producto.enabled}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </Button>
                                </td>
                                <td>
                                    <Form.Check
                                        type="switch"
                                        checked={producto.enabled}
                                        onClick={() => handleToggleStatus(producto.id, producto.enabled)}
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

export default ListaProductos;