import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clasePersonalizadaService } from '../../services/clasePersonalizadaService';
import { clienteService } from '../../services/clienteService';
import { toast } from 'react-toastify';
import InputText from '../../components/common/InputText';
import InputNumber from '../../components/common/InputNumber';
import SelectField from '../../components/common/SelectField';
import FormButtons from '../../components/common/FormButtons';
import FormTitle from '../../components/common/FormTitle';

const FormularioClasePersonalizada = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [clientes, setClientes] = useState([]);
  const [clase, setClase] = useState({
    className: '',
    description: '',
    date: '',
    time: '',
    price: '',
    paymentMethod: 'Efectivo',
    client: { id: '' }
  });

  const metodosPago = [
    { value: 'Efectivo', label: 'Efectivo' },
    { value: 'Tarjeta', label: 'Tarjeta' },
    { value: 'Transferencia', label: 'Transferencia' },
    { value: 'Otro', label: 'Otro' }
  ];

  const cargarClientes = useCallback(async () => {
  try {
    const res = await clienteService.obtenerClientes();
    setClientes(res.map(c => ({
      value: c.id,
      label: `${c.firstName} ${c.lastName}`
    })));
  } catch (error) {
    toast.error('Error al cargar clientes');
    navigate('/membresias/clases');
  }
}, [navigate]);

  const cargarClase = useCallback(async () => {
    try {
      const data = await clasePersonalizadaService.obtenerClasePorId(id);
      setClase({
        ...data,
        client: { id: data.client?.id || '' }
      });
    } catch (error) {
      toast.error('Error al cargar la clase');
      navigate('/membresias/clases');
    } finally {
    }
  }, [id, navigate]);

  useEffect(() => {
  cargarClientes();
  if (id) cargarClase();
}, [id, cargarClase, cargarClientes]);


  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (name === 'clientId') {
      setClase(prev => ({
        ...prev,
        client: { id: value }
      }));
    } else {
      setClase(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const claseData = {
        ...clase,
        price: parseFloat(clase.price),
        client: { id: clase.client.id }
      };

      if (id) {
        await clasePersonalizadaService.actualizarClase(id, claseData);
        toast.success('Clase personalizada actualizada');
      } else {
        await clasePersonalizadaService.crearClase(claseData);
        toast.success('Clase personalizada creada');
      }

      navigate('/membresias/clases');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar la clase');
      console.error(error, 'Error al guardar la clase personalizada', error.response?.data);
    }
  };

  return (
    <div className="container mt-4">
      <FormTitle id={id} title="Clase Personalizada" />
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <InputText
            label="Nombre de la clase"
            name="className"
            value={clase.className}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <SelectField
            label="Cliente"
            name="clientId"
            value={clase.client.id}
            options={clientes}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-12">
          <InputText
            label="Descripción"
            name="description"
            value={clase.description}
            onChange={handleChange}
            as="textarea"
          />
        </div>

        <div className="col-md-4">
          <InputText
            label="Fecha"
            type="date"
            name="date"
            value={clase.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4">
          <InputText
            label="Hora"
            type="time"
            name="time"
            value={clase.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4">
          <InputNumber
            label="Precio ($)"
            name="price"
            value={clase.price}
            step={0.01}
            min={0}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <SelectField
            label="Método de pago"
            name="paymentMethod"
            value={clase.paymentMethod}
            options={metodosPago}
            onChange={handleChange}
            required
          />
        </div>

        <FormButtons
          onCancel={() => navigate('/membresias/clases')}
        />
      </form>
    </div>
  );
};

export default FormularioClasePersonalizada;
