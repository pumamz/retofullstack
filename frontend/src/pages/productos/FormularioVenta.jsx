import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clienteService } from '../../services/clienteService';
import { productoService } from '../../services/productoService';
import { VentaService } from '../../services/ventaService';
import { mostrarError } from '../../api/toast';
import SelectField from '../../components/common/SelectField';
import FormButtons from '../../components/common/FormButtons';
import FormTitle from '../../components/common/FormTitle';

const FormularioVentaProducto = () => {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);

  const [venta, setVenta] = useState({
    client: { id: '' },
    paymentMethod: '',
    notes: '',
    details: []
  });

  const [item, setItem] = useState({
    product: { id: '' },
    quantity: 1,
    unitPrice: 0
  });

  const metodosPago = [
    { value: 'Efectivo', label: 'Efectivo' },
    { value: 'Tarjeta', label: 'Tarjeta' },
    { value: 'Transferencia', label: 'Transferencia Bancaria' },
    { value: 'Paypal', label: 'PayPal' }
  ];

  const cargarClientes = useCallback(async () => {
    try {
      const res = await clienteService.listarClientesActivos();
      setClientes(res.map(c => ({ value: c.id, label: `${c.firstName} ${c.lastName}` })));
    } catch (error) {
      mostrarError(error, 'Error al cargar clientes');
      navigate('/productos/ventas');
    }
  }, [navigate]);

  const cargarProductos = useCallback(async () => {
    try {
      const res = await productoService.listarProductosActivos();
      setProductos(res);
    } catch (error) {
      mostrarError(error, 'Error al cargar productos');
      navigate('/productos/ventas');
    }
  }, [navigate]);

  useEffect(() => {
    cargarClientes();
    cargarProductos();
  }, [cargarClientes, cargarProductos]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'clienteId') {
      setVenta(prev => ({ ...prev, client: { id: value } }));
    } else {
      setVenta(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: name === 'quantity' ? Number(value) : value }));
  };

  const handleProductoSeleccionado = (e) => {
    const selected = productos.find(p => p.id === Number(e.target.value));
    if (selected) {
      setItem({
        product: { id: selected.id },
        quantity: 1,
        unitPrice: selected.priceSale
      });
    }
  };

  const agregarProducto = () => {
    if (!item.product.id || item.quantity <= 0) return;

    setVenta(prev => ({
      ...prev,
      details: [...prev.details, item]
    }));

    setItem({
      product: { id: '' },
      quantity: 1,
      unitPrice: 0
    });
  };

  const eliminarProducto = (index) => {
    setVenta(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index)
    }));
  };

  const calcularTotal = () =>
    venta.details.reduce((acc, d) => acc + d.quantity * d.unitPrice, 0).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...venta,
        client: { id: parseInt(venta.client.id) },
        details: venta.details.map(d => ({
          product: { id: d.product.id },
          quantity: d.quantity,
          unitPrice: d.unitPrice
        }))
      };
      await VentaService.crearVenta(payload);
      toast.success('Venta registrada exitosamente');
      navigate('/productos/ventas');
    } catch (error) {
      mostrarError(error, 'Error al registrar la venta');
    }
  };

  return (
    <div className="container mt-4">
      <FormTitle title="Venta de Productos" />

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <SelectField
            label="Cliente"
            name="clienteId"
            value={venta.client.id}
            options={clientes}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <SelectField
            label="Método de Pago"
            name="paymentMethod"
            value={venta.paymentMethod}
            options={metodosPago}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-12">
          <label className="form-label">Notas</label>
          <textarea
            className="form-control"
            name="notes"
            value={venta.notes}
            onChange={handleChange}
            rows="2"
            placeholder="Notas adicionales"
          />
        </div>

        <div className="col-md-12 border rounded p-3">
          <h5>Agregar Producto</h5>
          <div className="row g-2 align-items-end">
            <div className="col-md-5">
              <label className="form-label">Producto</label>
              <select
                className="form-select"
                value={item.product.id}
                onChange={handleProductoSeleccionado}
              >
                <option value="">Seleccione un producto</option>
                {productos.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} - ${p.priceSale?.toFixed(2)} (Stock: {p.stock})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Cantidad</label>
              <input
                type="number"
                name="quantity"
                className="form-control"
                min="1"
                value={item.quantity}
                onChange={handleItemChange}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Precio</label>
              <input
                type="number"
                className="form-control"
                value={item.unitPrice}
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

        {venta.details.length > 0 && (
          <div className="col-md-12">
            <table className="table table-bordered mt-3">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {venta.details.map((d, idx) => {
                  const p = productos.find(p => p.id === d.product.id);
                  return (
                    <tr key={idx}>
                      <td>{p?.name}</td>
                      <td>{d.quantity}</td>
                      <td>${d.unitPrice}</td>
                      <td>${(d.quantity * d.unitPrice).toFixed(2)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => eliminarProducto(idx)}
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
                  <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                  <td colSpan="2"><strong>${calcularTotal()}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        <FormButtons
          onCancel={() => navigate('/productos/ventas')}
          disabled={!venta.client.id || !venta.paymentMethod || venta.details.length === 0}
        />
      </form>
    </div>
  );
};

export default FormularioVentaProducto;
