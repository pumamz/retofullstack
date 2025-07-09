import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { VentaService } from '../../services/ventaService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faTimes, faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';

const ListaVentas = () => {
    const [ventas, setVentas] = useState([]);
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [fechaInicio, setFechaInicio] = useState(new Date());
    const [fechaFin, setFechaFin] = useState(new Date());

    useEffect(() => {
        cargarVentas();
    }, []);

    const cargarVentas = async () => {
        try {
            setCargando(true);
            const response = await VentaService.listarVentas();
            setVentas(response.data);
        } catch (error) {
            console.error('Error al cargar ventas:', error);
            setError('Error al cargar las ventas');
            toast.error('Error al cargar las ventas');
        } finally {
            setCargando(false);
        }
    };

    const buscarPorRangoFecha = async () => {
        try {
            setCargando(true);
            const fechaInicioStr = fechaInicio.toISOString().split('T')[0];
            const fechaFinStr = fechaFin.toISOString().split('T')[0];

            const response = await VentaService.obtenerVentasPorFecha(fechaInicioStr, fechaFinStr);
            setVentas(response.data);
            toast.success('Búsqueda completada');
        } catch (error) {
            console.error('Error en la búsqueda:', error);
            toast.error('Error al buscar ventas');
        } finally {
            setCargando(false);
        }
    };

    const cancelarVenta = async (id) => {
        if (window.confirm('¿Está seguro de cancelar esta venta?')) {
            try {
                await VentaService.cancelarVenta(id);
                toast.success('Venta cancelada exitosamente');
                cargarVentas();
            } catch (error) {
                console.error('Error al cancelar la venta:', error);
                toast.error('Error al cancelar la venta');
            }
        }
    };

    const mostrarDetalles = async (invoiceNumber) => {
        try {
            const response = await VentaService.obtenerVentaPorNumero(invoiceNumber);
            setVentaSeleccionada(response.data);
            // Aquí podrías mostrar un modal con los detalles
        } catch (error) {
            console.error('Error al obtener detalles:', error);
            toast.error('Error al cargar los detalles');
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
                <h2>Lista de Ventas</h2>
                <Link to="/productos/ventas/vender" className="btn btn-success">
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Nueva Venta
                </Link>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Filtrar por Fecha</h5>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <input
                                type="date"
                                className="form-control"
                                value={fechaInicio.toISOString().split('T')[0]}
                                onChange={(e) => setFechaInicio(new Date(e.target.value))}
                            />

                        </div>
                        <div className="col-md-4">
                            <input
                                type="date"
                                className="form-control"
                                value={fechaFin.toISOString().split('T')[0]}
                                onChange={(e) => setFechaFin(new Date(e.target.value))}
                            />
                        </div>
                        <div className="col-md-4">
                            <button
                                className="btn btn-primary"
                                onClick={buscarPorRangoFecha}
                            >
                                <FontAwesomeIcon icon={faSearch} className="me-2" />
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>
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
                            <th>Nº Factura</th>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventas.map(venta => (
                            <tr key={venta.id} className={venta.cancelled ? 'table-danger' : ''}>
                                <td>{venta.invoiceNumber}</td>
                                <td>{venta.dateTime}</td>
                                <td>{venta.client.firstName}</td>
                                <td>${venta.totalAmount.toFixed(2)}</td>
                                <td>
                                    <span className={`badge ${venta.cancelled ? 'bg-danger' : 'bg-success'}`}>
                                        {venta.cancelled ? 'Cancelada' : 'Activa'}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-info btn-sm me-2"
                                        onClick={() => mostrarDetalles(venta.invoiceNumber)}
                                    >
                                        <FontAwesomeIcon icon={faFileInvoice} />
                                    </button>
                                    {!venta.cancelled && (
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => cancelarVenta(venta.id)}
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para mostrar detalles */}
            {ventaSeleccionada && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Detalles de Venta - Factura #{ventaSeleccionada.invoiceNumber}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setVentaSeleccionada(null)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Cantidad</th>
                                                <th>Precio Unitario</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ventaSeleccionada.details.map((detalle, index) => (
                                                <tr key={index}>
                                                    <td>{detalle.product.name}</td>
                                                    <td>{detalle.quantity}</td>
                                                    <td>${detalle.unitPrice.toFixed(2)}</td>
                                                    <td>${detalle.subtotal.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setVentaSeleccionada(null)}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListaVentas;