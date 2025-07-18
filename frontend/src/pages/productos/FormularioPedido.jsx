import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { proveedorService } from '../../services/proveedorService';
import { productoService } from '../../services/productoService';
import { PedidoService } from '../../services/pedidoService';
import { mostrarError } from '../../api/toast';
import SelectField from '../../components/common/SelectField';
import FormButtons from '../../components/common/FormButtons';
import FormTitle from '../../components/common/FormTitle';

const FormularioPedido = () => {
  const navigate = useNavigate();

  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);

  const [pedido, setPedido] = useState({
    supplier: { id: '' },
    expectedDeliveryDate: '',
    notes: '',
    status: 'PENDIENTE',
    details: []
  });

  const [item, setItem] = useState({
    product: { id: '' },
    quantity: 1,
    unitPrice: 0
  });

  const cargarProveedores = useCallback(async () => {
    try {
      const res = await proveedorService.listarProveedoresActivos();
      setProveedores(res.map(p => ({ value: p.id, label: `${p.firstName} ${p.lastName}` })));
    } catch (error) {
      mostrarError(error, 'Error al cargar proveedores');
      navigate('/productos/pedidos');
    }
  }, [navigate]);

  const cargarProductos = useCallback(async () => {
    try {
      const res = await productoService.listarProductosActivos();
      setProductos(res);
    } catch (error) {
      mostrarError(error, 'Error al cargar productos');
      navigate('/productos/pedidos');
    }
  }, [navigate]);

  useEffect(() => {
    cargarProveedores();
    cargarProductos();
  }, [cargarProveedores, cargarProductos]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'supplierId') {
      setPedido(prev => ({ ...prev, supplier: { id: value } }));
    } else {
      setPedido(prev => ({ ...prev, [name]: value }));
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
        unitPrice: selected.priceBuy
      });
    }
  };

  const agregarProducto = () => {
    if (!item.product.id || item.quantity <= 0) return;

    setPedido(prev => ({
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
    setPedido(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index)
    }));
  };

  const calcularTotal = () =>
    pedido.details.reduce((acc, d) => acc + d.quantity * d.unitPrice, 0).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pedido.details.length === 0) {
      mostrarError('Debe agregar al menos un producto');
      return;
    }

    try {
      const payload = {
        ...pedido,
        supplier: { id: parseInt(pedido.supplier.id) },
        details: pedido.details.map(d => ({
          product: { id: d.product.id },
          quantity: d.quantity,
          unitPrice: d.unitPrice
        }))
      };
      await PedidoService.crearPedido(payload);
      toast.success('Pedido registrado exitosamente');
      navigate('/productos/pedidos');
    } catch (error) {
      mostrarError(error, 'Error al registrar el pedido');
    }
  };

  return (
    <div className="container mt-4">
      <FormTitle title="Nuevo Pedido" />

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <SelectField
            label="Proveedor"
            name="supplierId"
            value={pedido.supplier.id}
            options={proveedores}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Fecha de Entrega Esperada</label>
          <input
            type="date"
            name="expectedDeliveryDate"
            className="form-control"
            value={pedido.expectedDeliveryDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-12">
          <label className="form-label">Notas</label>
          <textarea
            className="form-control"
            name="notes"
            value={pedido.notes}
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
                    {p.name} - ${p.priceBuy?.toFixed(2)} (Stock: {p.stock})
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

        {pedido.details.length > 0 && (
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
                {pedido.details.map((d, idx) => {
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
          onCancel={() => navigate('/productos/pedidos')}
          disabled={!pedido.supplier.id || !pedido.expectedDeliveryDate || pedido.details.length === 0}
        />
      </form>
    </div>
  );
};

export default FormularioPedido;