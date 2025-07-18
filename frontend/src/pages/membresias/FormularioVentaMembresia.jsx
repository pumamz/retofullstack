import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { membresiaVentaService } from '../../services/membresiaVentaService';
import { clienteService } from '../../services/clienteService';
import { membresiaService } from '../../services/membresiaService';
import SelectField from '../../components/common/SelectField';
import FormButtons from '../../components/common/FormButtons';
import FormTitle from '../../components/common/FormTitle';
import { mostrarError } from '../../api/toast';

const FormularioVentaMembresia = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [clientes, setClientes] = useState([]);
  const [membresias, setMembresias] = useState([]);
  const [venta, setVenta] = useState({
    client: { id: '' },
    membership: { id: '' },
    paymentMethod: ''
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
      setClientes(res.map(c => ({
        value: c.id,
        label: `${c.firstName} ${c.lastName}`
      })));
    } catch (error) {
      mostrarError(error, 'Error al cargar clientes');
      navigate('/membresias/ventas');
    }
  }, [navigate]);

  const cargarMembresias = useCallback(async () => {
    try {
      const res = await membresiaService.obtenerMembresiasActivas();
      setMembresias(res.map(m => ({
        value: m.id,
        label: `${m.name} - $${m.price?.toFixed(2)}`
      })));
    } catch (error) {
      mostrarError(error, 'Error al cargar membresías');
      navigate('/membresias/ventas');
    }
  }, [navigate]);

  useEffect(() => {
    cargarClientes();
    cargarMembresias();
  }, [cargarClientes, cargarMembresias]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'clienteId') {
      setVenta(prev => ({
        ...prev,
        client: { id: value }
      }));
    } else if (name === 'membresiaId') {
      setVenta(prev => ({
        ...prev,
        membership: { id: value }
      }));
    } else {
      setVenta(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const datos = {
        client: { id: parseInt(venta.client.id) },
        membership: { id: parseInt(venta.membership.id) },
        paymentMethod: venta.paymentMethod
      };

      await membresiaVentaService.crearVentaMembresia(datos);
      toast.success('Venta de membresía creada');
      navigate('/membresias/ventas');
    } catch (error) {
      mostrarError(error, 'Error al crear la venta');
    }
  };

  return (
    <div className="container mt-4">
      <FormTitle id={id} title="Venta de Membresía" />
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
            label="Membresía"
            name="membresiaId"
            value={venta.membership.id}
            options={membresias}
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
          <div className="alert alert-warning">
            La fecha de venta se generará automáticamente. La fecha de vencimiento se calculará según la duración de la membresía.
          </div>
        </div>

        <FormButtons
          onCancel={() => navigate('/membresias/ventas')}
        />
      </form>
    </div>
  );
};

export default FormularioVentaMembresia;
