import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProveedorService } from '../../services/proveedorService';
import { toast } from 'react-toastify';
import InputText from '../../components/common/InputText';
import FormTitle from '../../components/common/FormTitle';
import FormButtons from '../../components/common/FormButtons';

const FormularioProveedores = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [proveedor, setProveedor] = useState({
    firstName: '',
    lastName: '',
    dni: '',
    email: '',
    phone: '',
    company: '',
    ruc: ''
  });

  const cargarProveedor = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ProveedorService.obtenerProveedorPorId(id);
      setProveedor(response.data);
    } catch (error) {
      toast.error('Error al cargar el proveedor');
      navigate('/proveedores');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (id) cargarProveedor();
  }, [id, cargarProveedor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProveedor((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (id) {
        await ProveedorService.actualizarProveedor(id, proveedor);
        toast.success('Proveedor actualizado exitosamente');
      } else {
        await ProveedorService.crearProveedor(proveedor);
        toast.success('Proveedor creado exitosamente');
      }
      navigate('/proveedores');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al guardar el proveedor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <FormTitle id={id} title="Proveedor" />

      <form onSubmit={handleSubmit} className="row g-3">
        {[
          { label: 'DNI', name: 'dni' },
          { label: 'Nombre', name: 'firstName' },
          { label: 'Apellido', name: 'lastName' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Teléfono', name: 'phone' },
          { label: 'Empresa', name: 'company' },
          { label: 'RUC', name: 'ruc' }
        ].map(({ label, name, type = 'text' }) => (
          <div className="col-md-6" key={name}>
            <InputText
              label={label}
              name={name}
              type={type}
              value={proveedor[name]}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        ))}

        <FormButtons
          loading={loading}
          onCancel={() => navigate('/proveedores')}
        />
      </form>
    </div>
  );
};

export default FormularioProveedores;