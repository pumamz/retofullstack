
import React, { useState, useEffect } from 'react';
import { ProductoService } from '../../services/productoService';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

const ListaProductos = () => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = async () => {
        try {
            setCargando(true);
            const response = await ProductoService.listarProductos();
            setProductos(response.data);
        } catch (error) {
            console.error('Error al cargar productos:', error);
            setError('Error al cargar los productos');
        } finally {
            setCargando(false);
        }
    };

    const eliminarProducto = async (id) => {
        if (window.confirm('¿Está seguro de eliminar este producto?')) {
            try {
                await ProductoService.eliminarProducto(id);
                cargarProductos();
            } catch (error) {
                console.error('Error al eliminar producto:', error);
                setError('Error al eliminar el producto');
            }
        }
    };

    if (cargando) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h2>Lista de Productos</h2>
                <Link to="/productos/crear" className="btn btn-success d-flex align-items-center justify-content-center">
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Nuevo Producto
                </Link>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Precio Compra</th>
                            <th>Precio Venta</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map(producto => (
                            <tr key={producto.id}>
                                <td>{producto.id}</td>
                                <td>{producto.name}</td>
                                <td>{producto.description}</td>
                                <td>${producto.priceBuy}</td>
                                <td>${producto.priceSale}</td>
                                <td>{producto.stock}</td>
                                <td>
                                    <Link to={`/productos/editar/${producto.id}`} className="btn btn-success btn-sm me-2">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </Link>
                                    <button 
                                        className="btn btn-danger btn-sm"
                                        onClick={() => eliminarProducto(producto.id)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListaProductos;