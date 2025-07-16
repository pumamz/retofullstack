import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { PedidoService } from '../../services/pedidoService';
import { mostrarError } from '../../api/toast';

const FormularioPedido = () => {
    const navigate = useNavigate();
    const [proveedores, setProveedores] = useState([]);
    const [productos, setProductos] = useState([]);
    const [pedido, setPedido] = useState({
        supplier: { id: '' },
        details: [],
        notes: '',
        expectedDeliveryDate: new Date(),
        status: 'PENDIENTE'
    });

    const [productoSeleccionado, setProductoSeleccionado] = useState({
        product: { id: '' },
        quantity: 1,
        unitPrice: 0
    });

    useEffect(() => {
        cargarDatosIniciales();
    }, []);

    const cargarDatosIniciales = async () => {
        try {
            const response = await PedidoService.obtenerDatosPedido();
            console.log("Datos cargados:", response.data);
            setProveedores(response.data.suppliers || []);
            setProductos(response.data.products || []);
        } catch (error) {
            console.error('Error al cargar datos:', error);
        }
    };

    const handleNotesChange = (e) => {
        setPedido(prev => ({
            ...prev,
            notes: e.target.value
        }));
    };

    const handleProveedorChange = (e) => {
        setPedido(prev => ({
            ...prev,
            supplier: { id: e.target.value }
        }));
    };

    const handleProductoChange = (e) => {
        const producto = productos.find(p => p.id === Number(e.target.value));
        setProductoSeleccionado({
            product: { id: producto.id },
            quantity: 1,
            unitPrice: producto.priceBuy
        });
    };

    const handleCantidadChange = (e) => {
        setProductoSeleccionado(prev => ({
            ...prev,
            quantity: Number(e.target.value)
        }));
    };

    const handlePrecioChange = (e) => {
        setProductoSeleccionado(prev => ({
            ...prev,
            unitPrice: Number(e.target.value)
        }));
    };

    const agregarProducto = () => {
        if (productoSeleccionado.product.id && productoSeleccionado.quantity > 0) {
            setPedido(prev => ({
                ...prev,
                details: [...prev.details, productoSeleccionado]
            }));
            setProductoSeleccionado({
                product: { id: '' },
                quantity: 1,
                unitPrice: 0
            });
        }
    };

    const eliminarProducto = (index) => {
        setPedido((prev) => ({
            ...prev,
            details: prev.details.filter((_, i) => i !== index)
        }));
    };

    const handleDeliveryDateChange = (e) => {
        setPedido(prev => ({
            ...prev,
            expectedDeliveryDate: e.target.value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pedido.details.length === 0) {
            mostrarError('Debe agregar al menos un producto al pedido');
            return;
        }

        try {
            const pedidoData = {
                ...pedido,
                totalAmount: pedido.details.reduce(
                    (total, detail) => total + (detail.quantity * detail.unitPrice), 0
                )
            };
            await PedidoService.crearPedido(pedidoData);
            toast.success('Pedido creado exitosamente');
            navigate('/productos/pedidos');
        } catch (error) {
            mostrarError(error, 'Error al registrar el pedido');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Nuevo Pedido</h2>

            <div className="row mb-3">
                <div className="col-md-6">
                    <label className="form-label">Fecha de Entrega Esperada</label>
                    <input
                        type="date"
                        className="form-control"
                        value={pedido.expectedDeliveryDate}
                        onChange={handleDeliveryDateChange}
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Notas</label>
                    <textarea
                        className="form-control"
                        value={pedido.notes}
                        onChange={handleNotesChange}
                        rows="3"
                        placeholder="Notas adicionales para el pedido..."
                    />
                </div>
            </div>


            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Proveedor</label>
                        <select
                            className="form-select"
                            value={pedido.supplier.id}
                            onChange={handleProveedorChange}
                            required
                        >
                            <option value="">Seleccione un proveedor</option>
                            {proveedores.map(proveedor => (
                                <option key={proveedor.id} value={proveedor.id}>
                                    {proveedor.firstName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">Agregar Productos</h5>
                        <div className="row">
                            <div className="col-md-4">
                                <select
                                    className="form-select mb-2"
                                    value={productoSeleccionado.product.id}
                                    onChange={handleProductoChange}
                                >
                                    <option value="">Seleccione un producto</option>
                                    {productos.map((producto) => (
                                        <option key={producto.id} value={producto.id}>
                                            {producto.name} - Stock: {producto.stock}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <input
                                    type="number"
                                    className="form-control mb-2"
                                    placeholder="Cantidad"
                                    min="1"
                                    value={productoSeleccionado.quantity}
                                    onChange={handleCantidadChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Precio unitario"
                                    step="0.01"
                                    min="0"
                                    value={productoSeleccionado.unitPrice}
                                    onChange={handlePrecioChange}
                                    readOnly
                                />
                            </div>
                            <div className="col-md-2">
                                <button
                                    type="button"
                                    className="btn btn-success w-100"
                                    onClick={agregarProducto}
                                >
                                    Agregar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio Unitario</th>
                                <th>Subtotal</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedido.details.map((detalle, index) => {
                                const producto = productos.find(
                                    (p) => p.id === detalle.product.id
                                );
                                return (
                                    <tr key={index}>
                                        <td>{producto?.name}</td>
                                        <td>{detalle.quantity}</td>
                                        <td>${detalle.unitPrice}</td>
                                        <td>${(detalle.quantity * detalle.unitPrice).toFixed(2)}</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() => eliminarProducto(index)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" className="text-end">
                                    <strong>Total:</strong>
                                </td>
                                <td>
                                    ${pedido.details.reduce((total, detalle) =>
                                        total + (detalle.quantity * detalle.unitPrice), 0
                                    ).toFixed(2)}
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="d-flex justify-content-end gap-2">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/productos/pedidos')}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-success"
                        disabled={pedido.details.length === 0}
                    >
                        Registrar Pedido
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioPedido;