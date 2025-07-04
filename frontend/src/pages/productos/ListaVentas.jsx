import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { VentaService } from '../../services/ventaService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const ListaVentas = () => {
    const [ventas, setVentas] = useState([]);
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarVentas();
        const modalElement = document.getElementById('detalleVentaModal');
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

    const cargarVentas = async () => {
        try {
            setCargando(true);
            const response = await VentaService.listarVentas();
            setVentas(response.data);
        } catch (error) {
            console.error('Error al cargar ventas:', error);
            setError('Error al cargar las ventas');
        } finally {
            setCargando(false);
        }
    };

    const mostrarDetalles = (venta) => {
        setVentaSeleccionada(venta);
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
                <h2>Lista de Ventas</h2>
                <Link to="/productos/ventas/vender" className="btn btn-success d-flex align-items-center justify-content-center">
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Nueva venta
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
                            <th>Cliente</th>
                            <th>Total</th>
                            <th>Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventas.map(venta => (
                            <tr key={venta.id}>
                                <td>{venta.id}</td>
                                <td>{venta.date}</td>
                                <td>{venta.client?.firstName}</td>
                                <td>
                                    ${venta.details.reduce((total, detalle) =>
                                        total + (detalle.quantity * detalle.unitPrice), 0
                                    ).toFixed(2)}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => mostrarDetalles(venta)}
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
            <div className="modal fade"
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
                                Detalles de la venta {ventaSeleccionada?.id}
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
                            {ventaSeleccionada && (
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
                                        {ventaSeleccionada.details.map((detalle, index) => (
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
                                                ${ventaSeleccionada.details.reduce((total, detalle) =>
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

export default ListaVentas;

