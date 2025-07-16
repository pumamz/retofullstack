import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { VentaService } from "../../services/ventaService";
import { mostrarError } from "../../api/toast";

const FormularioVenta = () => {
    const navigate = useNavigate();
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [venta, setVenta] = useState({
        client: { id: '' },
        details: [],
        paymentMethod: '',
        notes: '',
    });

    const [productoSeleccionado, setProductoSeleccionado] = useState({
        product: { id: '' },
        quantity: 1,
        unitPrice: 0,
    });

    useEffect(() => {
        cargarDatosIniciales();
    }, []);

    const cargarDatosIniciales = async () => {
        try {
            const response = await VentaService.obtenerDatosVenta();
            setClientes(response.data.clients || []);
            setProductos(response.data.products || []);
        } catch (error) {
            mostrarError(error, "Error al cargar los datos iniciales");
        }
    };

    const handleClienteChange = (e) => {
        setVenta((prev) => ({
            ...prev,
            client: { id: e.target.value },
        }));
    };

    const handleProductoChange = (e) => {
        const producto = productos.find((p) => p.id === Number(e.target.value));
        setProductoSeleccionado({
            product: { id: producto.id },
            quantity: 1,
            unitPrice: producto.priceSale,
        });
    };

    const handleCantidadChange = (e) => {
        setProductoSeleccionado((prev) => ({
            ...prev,
            quantity: Number(e.target.value),
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
            setVenta((prev) => ({
                ...prev,
                details: [...prev.details, productoSeleccionado],
            }));
            setProductoSeleccionado({
                product: { id: '' },
                quantity: 1,
                unitPrice: 0,
            });
        }
    };

    const eliminarProducto = (index) => {
        setVenta((prev) => ({
            ...prev,
            details: prev.details.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await VentaService.crearVenta(venta);
            navigate("/productos/ventas");
        } catch (error) {
            mostrarError(error, "Error al registrar la venta");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVenta(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="container mt-4">
            <h2>Nueva Venta</h2>

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Cliente</label>
                        <select
                            className="form-select"
                            value={venta.client.id}
                            onChange={handleClienteChange}
                            required
                        >
                            <option value="">Seleccione un cliente</option>
                            {clientes.map((cliente) => (
                                <option key={cliente.id} value={cliente.id}>
                                    {cliente.firstName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">Método de Pago</label>
                        <select
                            className="form-select"
                            name="paymentMethod"
                            value={venta.paymentMethod}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Seleccione método de pago</option>
                            <option value="EFECTIVO">Efectivo</option>
                            <option value="TARJETA">Tarjeta</option>
                            <option value="TRANSFERENCIA">Transferencia</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Notas</label>
                        <textarea
                            className="form-control"
                            name="notes"
                            value={venta.notes}
                            onChange={handleInputChange}
                            placeholder="Notas adicionales"
                            rows="2"
                        ></textarea>
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

                <div className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">Resumen de la Venta</h5>
                        <div className="row">
                            <div className="col-md-6">
                                <p><strong>Cliente:</strong> {clientes.find(c => c.id === Number(venta.client.id))?.firstName || 'No seleccionado'}</p>
                                <p><strong>Método de Pago:</strong> {venta.paymentMethod || 'No seleccionado'}</p>
                            </div>
                            <div className="col-md-6">
                                <p><strong>Total Items:</strong> {venta.details.length}</p>
                                <p><strong>Total a Pagar:</strong> ${venta.details.reduce((total, detalle) =>
                                    total + (detalle.quantity * detalle.unitPrice), 0
                                ).toFixed(2)}</p>
                            </div>
                        </div>
                        {venta.notes && (
                            <div className="row mt-2">
                                <div className="col-12">
                                    <p><strong>Notas:</strong> {venta.notes}</p>
                                </div>
                            </div>
                        )}
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
                            {venta.details.map((detalle, index) => {
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
                                    ${venta.details.reduce((total, detalle) =>
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
                        onClick={() => navigate("/productos/ventas")}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-success"
                        disabled={venta.details.length === 0 || !venta.client.id || !venta.paymentMethod}
                    >
                        Registrar Venta
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioVenta;