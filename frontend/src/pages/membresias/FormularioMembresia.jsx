import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { membresiaService } from '../../services/membresiaService';
import { toast } from 'react-toastify';
import InputText from '../../components/common/InputText';
import InputNumber from '../../components/common/InputNumber';
import FormButtons from '../../components/common/FormButtons';
import FormTitle from '../../components/common/FormTitle';
import { mostrarError } from '../../api/toast';

const FormularioMembresia = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [membresia, setMembresia] = useState({
    name: '',
    price: '',
    durationDays: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setMembresia((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...membresia,
        price: parseFloat(membresia.price),
        durationDays: parseInt(membresia.durationDays)
      };

      if (id) {
        await membresiaService.actualizarMembresia(id, payload);
        toast.success('Membresía actualizada exitosamente');
      } else {
        await membresiaService.crearMembresia(payload);
        toast.success('Membresía creada exitosamente');
      }
      navigate('/membresias');
    } catch (error) {
      mostrarError(error, 'Error al guardar la membresía');
    }
  };

  const cargarMembresia = useCallback(async () => {
    try {
      const response = await membresiaService.obtenerMembresiaPorId(id);
      setMembresia(response);
    } catch (error) {
      mostrarError(error, 'Error al cargar la membresía');
      navigate('/membresias');
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) cargarMembresia();
  }, [id, cargarMembresia]);

  return (
    <div className="container mt-4">
      <FormTitle id={id} title="Membresía" />
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <InputText
            label="Nombre"
            name="name"
            value={membresia.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <InputNumber
            label="Precio ($)"
            name="price"
            value={membresia.price}
            step={0.01}
            min={0}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <InputNumber
            label="Duración (días)"
            name="durationDays"
            value={membresia.durationDays}
            step={1}
            min={1}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-12">
          <InputText
            label="Descripción"
            name="description"
            value={membresia.description}
            onChange={handleChange}
            required
            as="textarea"
          />
        </div>

        <div className="alert alert-info">
          <strong>Nota:</strong> La fecha de creación se genera automáticamente.
        </div>

        <FormButtons onCancel={() => navigate('/membresias')} />
      </form>
    </div>
  );
};

export default FormularioMembresia;
