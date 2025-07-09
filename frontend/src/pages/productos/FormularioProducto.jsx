import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductoService } from '../../services/productoService';
import { toast } from 'react-toastify';
import InputText from '../../components/common/InputText';
import InputNumber from '../../components/common/InputNumber';
import TextareaField from '../../components/common/TextareaField';
import FormButtons from '../../components/common/FormButtons';
import FormTitle from '../../components/common/FormTitle';

const FormularioProducto = () => {
  const navigate = useNavigate();
  const { id } = useParams();
console.log("ID en FormularioClientes:", id);
  const [loading, setLoading] = useState(false);
  const [producto, setProducto] = useState({
    name: '',
    description: '',
    priceBuy: '',
    priceSale: '',
    stock: '',
    minimumStock: '',
    barcode: '',
    active: true
  });

  const cargarProducto = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ProductoService.obtenerProducto(id);
      setProducto(response.data);
    } catch (error) {
      toast.error('Error al cargar el producto');
      navigate('/productos');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) cargarProducto();
  }, [id, cargarProducto]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setProducto(prev => ({
      ...prev,
      [name]: type === 'number' || name.includes('price') ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await ProductoService.actualizarProducto(id, producto);
        toast.success('Producto actualizado exitosamente');
      } else {
        await ProductoService.crearProducto(producto);
        toast.success('Producto creado exitosamente');
      }
      navigate('/productos');
    } catch (error) {
      toast.error('Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <FormTitle text={id ? 'Editar Producto' : 'Nuevo Producto'} />
      <form onSubmit={handleSubmit} className="row g-3">
        {[
          { label: 'Nombre', name: 'name' },
          { label: 'Código de Barras', name: 'barcode' }
        ].map(({ label, name }) => (
          <div className="col-md-6" key={name}>
            <InputText
              label={label}
              name={name}
              value={producto[name]}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        ))}

        <div className="col-12">
          <TextareaField
            label="Descripción"
            name="description"
            value={producto.description}
            onChange={handleChange}
            disabled={loading}
            rows={3}
          />
        </div>

        {[
          { label: 'Precio de Compra', name: 'priceBuy' },
          { label: 'Precio de Venta', name: 'priceSale' },
          { label: 'Stock', name: 'stock' },
          { label: 'Stock Mínimo', name: 'minimumStock' }
        ].map(({ label, name }) => (
          <div className="col-md-3" key={name}>
            <InputNumber
              label={label}
              name={name}
              value={producto[name]}
              onChange={handleChange}
              step={0.01}
              required
              disabled={loading}
            />
          </div>
        ))}

        <FormButtons
          loading={loading}
          onCancel={() => navigate('/productos')}
        />
      </form>
    </div>
  );
};

export default FormularioProducto;
