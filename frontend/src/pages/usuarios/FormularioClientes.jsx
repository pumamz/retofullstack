import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clienteService } from '../../services/clienteService';
import { toast } from 'react-toastify';
import InputText from '../../components/common/InputText';
import InputNumber from '../../components/common/InputNumber';
import SelectField from '../../components/common/SelectField';
import FormButtons from '../../components/common/FormButtons';
import FormTitle from '../../components/common/FormTitle';
import { mostrarError } from '../../api/toast';

const FormularioClientes = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [cliente, setCliente] = useState({
    firstName: '',
    lastName: '',
    dni: '',
    email: '',
    phone: '',
    sex: '',
    age: '',
    height: '',
    weight: ''
  });

  const cargarCliente = useCallback(async () => {
    try {
      const response = await clienteService.obtenerClientePorId(id);
      setCliente(response);
    } catch (error) {
      mostrarError(error, 'Error al cargar el cliente');
      navigate('/clientes');
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) cargarCliente();
  }, [id, cargarCliente]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setCliente(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await clienteService.actualizarCliente(id, cliente);
        toast.success('Cliente actualizado exitosamente');
      } else {
        await clienteService.crearCliente(cliente);
        toast.success('Cliente creado exitosamente');
      }
      navigate('/clientes');
    } catch (error) {
      mostrarError(error, 'Error al guardar el cliente');
    }
  };

  return (
    <div className="container mt-4">
      <FormTitle id={id} title="Cliente" />
      <form onSubmit={handleSubmit} className="row g-3">
        {[
          { label: 'DNI', name: 'dni' },
          { label: 'Nombre', name: 'firstName' },
          { label: 'Apellido', name: 'lastName' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Teléfono', name: 'phone' }
        ].map(({ label, name, type = 'text' }) => (
          <div className="col-md-6" key={name}>
            <InputText
              label={label}
              name={name}
              value={cliente[name]}
              type={type}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <div className="col-md-6">
          <SelectField
            label="Sexo"
            name="sex"
            value={cliente.sex}
            onChange={handleChange}
            required
            options={[
              { label: 'Masculino', value: 'M' },
              { label: 'Femenino', value: 'F' }
            ]}
          />
        </div>

        {[
          { label: 'Edad', name: 'age', step: 1 },
          { label: 'Altura (m)', name: 'height', step: 0.01 },
          { label: 'Peso (kg)', name: 'weight', step: 0.01 }
        ].map(({ label, name, step }) => (
          <div className="col-md-4" key={name}>
            <InputNumber
              label={label}
              name={name}
              value={cliente[name]}
              onChange={handleChange}
              step={step}
              required
            />
          </div>
        ))}

        <FormButtons
          onCancel={() => navigate('/clientes')}
        />
      </form>
    </div>
  );
};

export default FormularioClientes;
