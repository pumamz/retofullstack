import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PedidoService } from '../../services/pedidoService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const ListaPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarPedidos();
        const modalElement = document.getElementById('detallePedidoModal');
        if (modalElement) {
            modalElement.addEventListener('hidden.bs.modal', limpiarModal);
        }

        return () => {
            const modalElement = document.getElementById('detallePedidoModal');
            if (modalElement) {
                modalElement.removeEventListener('hidden.bs.modal', limpiarModal);
            }
            limpiarModal();
        };
    }, []);

    const limpiarModal = () => {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
        document.body.classList.remove('modal-open');
        document.body.style.paddingRight = '';
        document.body.style.overflow = '';
    };

    const cargarPedidos = async () => {
        try {
            setCargando(true);
            const response = await PedidoService.listarPedidos();
            setPedidos(response.data);
        } catch (error) {
            console.error('Error al cargar pedidos:', error);
            setError('Error al cargar los pedidos');
        } finally {
            setCargando(false);
        }
    };

    const mostrarDetalles = (pedido) => {
        setPedidoSeleccionado(pedido);
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
                <h2>Lista de Pedidos</h2>
                <Link to="/productos/pedidos/pedir" className="btn btn-success d-flex align-items-center justify-content-center">
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Nuevo pedido
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
                            <th>Fecha</th>
                            <th>Proveedor</th>
                            <th>Total</th>
                            <th>Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map(pedido => (
                            <tr key={pedido.id}>
                                <td>{pedido.id}</td>
                                <td>{pedido.date}</td>
                                <td>{pedido.supplier?.firstName}</td>
                                <td>
                                    ${pedido.details.reduce((total, detalle) =>
                                        total + (detalle.quantity * detalle.unitPrice), 0
                                    ).toFixed(2)}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => mostrarDetalles(pedido)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#detallePedidoModal"
                                    >
                                        Ver Detalles
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <div
                className="modal fade"
                id="detallePedidoModal"
                tabIndex="-1"
                aria-labelledby="modalLabel"
                aria-hidden="true"
                data-bs-backdrop="static"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalLabel">
                                Detalles del pedido {pedidoSeleccionado?.id}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={limpiarModal}
                            ></button>
                        </div>
                        <div className="modal-body">
                            {pedidoSeleccionado && (
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Cantidad</th>
                                            <th>Precio</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedidoSeleccionado.details.map((detalle, index) => (
                                            <tr key={index}>
                                                <td>{detalle.product.name}</td>
                                                <td>{detalle.quantity}</td>
                                                <td>${detalle.unitPrice}</td>
                                                <td>${(detalle.quantity * detalle.unitPrice).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                                            <td>
                                                ${pedidoSeleccionado.details.reduce((total, detalle) =>
                                                    total + (detalle.quantity * detalle.unitPrice), 0
                                                ).toFixed(2)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={limpiarModal}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListaPedidos;
