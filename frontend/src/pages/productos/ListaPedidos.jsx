
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PedidoService } from '../../services/pedidoService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';

const ListaPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [cantidadesRecibidas, setCantidadesRecibidas] = useState({});
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarPedidos();
    }, []);

    const cargarPedidos = async () => {
        try {
            setCargando(true);
            const response = await PedidoService.listarPedidos();
            setPedidos(response.data);
        } catch (error) {
            console.error('Error al cargar pedidos:', error);
            setError('Error al cargar los pedidos');
            toast.error('Error al cargar los pedidos');
        } finally {
            setCargando(false);
        }
    };

    const actualizarEstado = async (id, nuevoEstado) => {
        try {
            await PedidoService.actualizarEstadoPedido(id, nuevoEstado);
            toast.success('Estado actualizado exitosamente');
            cargarPedidos();
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            toast.error('Error al actualizar el estado');
        }
    };

    const registrarRecepcion = async (orderId) => {
        try {
            // Validar que haya al menos una cantidad registrada
            if (Object.keys(cantidadesRecibidas).length === 0) {
                toast.error('Debe ingresar al menos una cantidad');
                return;
            }

            // Validar que las cantidades sean válidas
            const cantidadesValidas = Object.values(cantidadesRecibidas)
                .every(cantidad => cantidad > 0);

            if (!cantidadesValidas) {
                toast.error('Las cantidades recibidas deben ser mayores a 0');
                return;
            }

            // Las cantidades ya están en el formato correcto para el backend
            await PedidoService.recibirPedido(orderId, cantidadesRecibidas);
            toast.success('Recepción registrada exitosamente');
            setPedidoSeleccionado(null);
            setCantidadesRecibidas({});
            cargarPedidos();
        } catch (error) {
            console.error('Error al registrar recepción:', error);
            toast.error('Error al registrar la recepción');
        }
    };

    const handleCantidadRecibidaChange = (detalleId, cantidad) => {
        const cantidadNumerica = parseInt(cantidad) || 0;
        setCantidadesRecibidas(prev => ({
            ...prev,
            [detalleId]: cantidadNumerica
        }));
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
                <Link to="/productos/pedidos/pedir" className="btn btn-success">
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Nuevo Pedido
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
                            <th>Nº Pedido</th>
                            <th>Fecha</th>
                            <th>Proveedor</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map(pedido => (
                            <tr key={pedido.id}>
                                <td>{pedido.orderNumber}</td>
                                <td>{pedido.dateTime}</td>
                                <td>{pedido.supplier.firstName}</td>
                                <td>${pedido.totalAmount.toFixed(2)}</td>
                                <td>
                                    <select
                                        className="form-select form-select-sm"
                                        value={pedido.status}
                                        onChange={(e) => actualizarEstado(pedido.id, e.target.value)}
                                    >
                                        <option value="PENDING">Pendiente</option>
                                        <option value="RECEIVED">Recibido</option>
                                        <option value="CANCELED">Cancelado</option>
                                    </select>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-info btn-sm me-2"
                                        onClick={() => setPedidoSeleccionado(pedido)}
                                    >
                                        <FontAwesomeIcon icon={faBoxOpen} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para registrar recepción */}
            {pedidoSeleccionado && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Recepción de Pedido #{pedidoSeleccionado.orderNumber}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setPedidoSeleccionado(null);
                                        setCantidadesRecibidas({});
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="alert alert-info">
                                    <i className="fas fa-info-circle me-2"></i>
                                    Las cantidades ingresadas actualizarán automáticamente el stock de los productos.
                                </div>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Cantidad Pedida</th>
                                                <th>Cantidad Ya Recibida</th>
                                                <th>Cantidad a Recibir</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pedidoSeleccionado.details.map((detalle) => (
                                                <tr key={detalle.id}>
                                                    <td>{detalle.product.name}</td>
                                                    <td>{detalle.quantity}</td>
                                                    <td>{detalle.receivedQuantity}</td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm"
                                                            min="0"
                                                            max={detalle.quantity - detalle.receivedQuantity}

                                                            value={cantidadesRecibidas[detalle.id] || ''}
                                                            onChange={(e) => handleCantidadRecibidaChange(
                                                                detalle.id,
                                                                e.target.value
                                                            )}
                                                        />
                                                    </td>
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
                                    onClick={() => {
                                        setPedidoSeleccionado(null);
                                        setCantidadesRecibidas({});
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => registrarRecepcion(pedidoSeleccionado.id)}
                                >
                                    Registrar Recepción
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListaPedidos;