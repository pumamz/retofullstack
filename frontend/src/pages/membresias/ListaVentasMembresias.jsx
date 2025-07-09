import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { VentaMembresiaService } from '../../services/VentaMembresiaService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';

const ListaVentasMembresias = () => {
    const [ventasMembresias, setVentasMembresias] = useState([]);
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarVentasMembresias();
        const modalElement = document.getElementById('detalleVentaModal');
        if (modalElement) {
            modalElement.addEventListener('hidden.bs.modal', limpiarModal);
        }

        return () => {
            const modalElement = document.getElementById('detalleVentaModal');
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

    const cargarVentasMembresias = async () => {
        try {
            setCargando(true);
            const response = await VentaMembresiaService.listarVentasMembresias();
            setVentasMembresias(response.data);
        } catch (error) {
            console.error('Error al cargar ventas de membresías:', error);
            setError('Error al cargar las ventas de membresías');
        } finally {
            setCargando(false);
        }
    };

    const mostrarDetalles = (venta) => {
        setVentaSeleccionada(venta);
    };

    const eliminarVentaMembresia = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta venta de membresía?')) {
            try {
                await VentaMembresiaService.eliminarVentaMembresia(id);
                await cargarVentasMembresias(); // Recargar la lista
            } catch (error) {
                console.error('Error al eliminar venta de membresía:', error);
                setError('Error al eliminar la venta de membresía');
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
            <Helmet>
                <title>Lista de Ventas de Membresías</title>
            </Helmet>
            <div className="d-flex justify-content-between mb-3">
                <h2>Lista de Ventas de Membresías</h2>
                <Link to="membresias/ventas-membresia/crear" className="btn btn-success d-flex align-items-center justify-content-center">
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Nueva Venta de Membresía
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
                            <th>Cliente</th>
                            <th>Membresía</th>
                            <th>Precio</th>
                            <th>Fecha de Venta</th>
                            <th>Método de Pago</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventasMembresias.map(venta => (
                            <tr key={venta.id}>
                                <td>{venta.id}</td>
                                <td>{venta.cliente?.firstName} {venta.cliente?.lastName}</td>
                                <td>{venta.membresia?.nombre}</td>
                                <td>${venta.membresia?.precio?.toFixed(2)}</td>
                                <td>{new Date(venta.fechaVenta).toLocaleDateString()}</td>
                                <td>{venta.metodoPago}</td>
                                <td>
                                    <div className="btn-group" role="group">
                                        <button
                                            className="btn btn-info btn-sm"
                                            onClick={() => mostrarDetalles(venta)}
                                            data-bs-toggle="modal"
                                            data-bs-target="#detalleVentaModal"
                                            title="Ver detalles"
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => eliminarVentaMembresia(venta.id)}
                                            title="Eliminar venta"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <div
                className="modal fade"
                id="detalleVentaModal"
                tabIndex="-1"
                aria-labelledby="modalLabel"
                aria-hidden="true"
                data-bs-backdrop="static"
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalLabel">
                                Detalles de la Venta #{ventaSeleccionada?.id}
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
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6>Información del Cliente:</h6>
                                        <p><strong>Nombre:</strong> {ventaSeleccionada.cliente?.firstName} {ventaSeleccionada.cliente?.lastName}</p>
                                        <p><strong>Email:</strong> {ventaSeleccionada.cliente?.email || 'No disponible'}</p>
                                        <p><strong>Teléfono:</strong> {ventaSeleccionada.cliente?.phone || 'No disponible'}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6>Información de la Membresía:</h6>
                                        <p><strong>Nombre:</strong> {ventaSeleccionada.membresia?.nombre}</p>
                                        <p><strong>Duración:</strong> {ventaSeleccionada.membresia?.duracionDias} días</p>
                                        <p><strong>Precio:</strong> ${ventaSeleccionada.membresia?.precio?.toFixed(2)}</p>
                                    </div>
                                    <div className="col-12">
                                        <hr />
                                        <h6>Información de la Venta:</h6>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <p><strong>Fecha de Venta:</strong> {new Date(ventaSeleccionada.fechaVenta).toLocaleDateString()}</p>
                                                <p><strong>Método de Pago:</strong> {ventaSeleccionada.metodoPago}</p>
                                            </div>
                                            <div className="col-md-6">
                                                <p><strong>Total Pagado:</strong> <span className="h5 text-success">${ventaSeleccionada.membresia?.precio?.toFixed(2)}</span></p>
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <div className="alert alert-info mb-0">
                                                <small><strong>Nota:</strong> Esta venta es un registro histórico y no puede ser modificada. Solo puede ser eliminada si es necesario.</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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

export default ListaVentasMembresias;
