import React, { useState, useEffect } from "react";
import { ProductoService } from "../../services/productoService";
import { Link } from "react-router-dom";
import { Table, Button, Badge, Alert, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { mostrarError } from "../../api/toast";

const ListaProductos = () => {
    const [productos, setProductos] = useState([]);
    const [productosStockBajo, setProductosStockBajo] = useState([]);

    useEffect(() => {
        cargarProductos();
        cargarProductosStockBajo();
    }, []);

    const cargarProductos = async () => {
        try {
            const response = await ProductoService.listarProductos();
            setProductos(response.data);
        } catch (error) {
            mostrarError(error, "Error al cargar los productos");
        }
    };

    const cargarProductosStockBajo = async () => {
        try {
            const response = await ProductoService.obtenerProductosStockBajo();
            setProductosStockBajo(response.data);
        } catch (error) {
            mostrarError(error, "Error al cargar productos con stock bajo:", error);
        }
    };

    const eliminarProducto = async (id) => {
        if (window.confirm("¿Está seguro de eliminar este producto?")) {
            try {
                await ProductoService.eliminarProducto(id);
                toast.success("Producto eliminado exitosamente");
                cargarProductos();
            } catch (error) {
                mostrarError(error, "Error al eliminar el producto");
            }
        }
    };

    return (
        <div className="container mt-4">
            {productosStockBajo.length > 0 && (
                <Alert variant="warning" className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                    Hay {productosStockBajo.length} producto
                    {productosStockBajo.length > 1 && "s"} con stock bajo
                </Alert>
            )}

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Lista de Productos</h2>
                <Button as={Link} to="/productos/crear" variant="success">
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Nuevo Producto
                </Button>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio Compra</th>
                        <th>Precio Venta</th>
                        <th>Stock</th>
                        <th>Stock Mínimo</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.length === 0 ? (
                        <tr>
                            <td colSpan="10" className="text-center">
                                No se encontraron productos
                            </td>
                        </tr>
                    ) : (
                        productos.map((producto) => (
                            <tr
                                key={producto.id}
                                className={
                                    producto.stock <= producto.minimumStock
                                        ? "table-warning"
                                        : ""
                                }
                            >
                                <td>{producto.id}</td>
                                <td>{producto.barcode}</td>
                                <td>{producto.name}</td>
                                <td>{producto.description}</td>
                                <td>${producto.priceBuy.toFixed(2)}</td>
                                <td>${producto.priceSale.toFixed(2)}</td>
                                <td>{producto.stock}</td>
                                <td>{producto.minimumStock}</td>
                                <td>
                                    <Badge bg={producto.active ? "success" : "danger"}>
                                        {producto.active ? "Activo" : "Inactivo"}
                                    </Badge>
                                </td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip>Editar</Tooltip>}
                                        >
                                            <Button
                                                as={Link}
                                                to={`/productos/editar/${producto.id}`}
                                                size="sm"
                                                variant="outline-success"
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Button>
                                        </OverlayTrigger>

                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip>Eliminar</Tooltip>}
                                        >
                                            <Button
                                                size="sm"
                                                variant="outline-danger"
                                                onClick={() => eliminarProducto(producto.id)}
                                            >
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

            {productos.length > 0 && (
                <div className="mt-3 text-muted">
                    Mostrando {productos.length} producto
                    {productos.length !== 1 ? "s" : ""}
                </div>
            )}
        </div>
    );
};

export default ListaProductos;