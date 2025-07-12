import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { membresiaVentaService } from '../../services/membresiaVentaService';
import { Helmet } from 'react-helmet';

const FormularioClasePersonalizada = () => {
    const navigate = useNavigate();
    const [clasePersonalizada, setClasePersonalizada] = useState({
        nombreClase: '',
        descripcion: '',
        fecha: '',
        hora: '',
        precio: '',
        metodoPago: 'EFECTIVO',
        cliente: { id: '' }
    });
    const [clientes, setClientes] = useState([]);
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [cargandoClientes, setCargandoClientes] = useState(true);

    const metodosPago = ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'OTRO'];

    useEffect(() => {
        cargarClientes();
    }, []);

    const cargarClientes = async () => {
        try {
            setCargandoClientes(true);
            const response = await membresiaVentaService.obtenerClientes();
            setClientes(response.data);
        } catch (error) {
            console.error('Error al cargar clientes:', error);
            setError('Error al cargar la lista de clientes');
        } finally {
            setCargandoClientes(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'clienteId') {
            setClasePersonalizada(prev => ({
                ...prev,
                cliente: { id: value }
            }));
        } else {
            setClasePersonalizada(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setCargando(true);
            setError(null);
            
            const claseData = {
                ...clasePersonalizada,
                precio: parseFloat(clasePersonalizada.precio)
            };

            await membresiaVentaService.crearClasePersonalizada(claseData);
            navigate('membresias/clases');
        } catch (error) {
            console.error('Error al crear clase personalizada:', error);
            setError('Error al crear la clase personalizada');
        } finally {
            setCargando(false);
        }
    };

    if (cargandoClientes) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando clientes...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <Helmet>
                <title>Nueva Clase Personalizada</title>
            </Helmet>
            
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="mb-0">Nueva Clase Personalizada</h2>
                        </div>
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="nombreClase" className="form-label">
                                                Nombre de la Clase *
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="nombreClase"
                                                name="nombreClase"
                                                value={clasePersonalizada.nombreClase}
                                                onChange={handleInputChange}
                                                placeholder="Ej: Entrenamiento Personal, Yoga, CrossFit"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="clienteId" className="form-label">
                                                Cliente *
                                            </label>
                                            <select
                                                className="form-select"
                                                id="clienteId"
                                                name="clienteId"
                                                value={clasePersonalizada.cliente.id}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Seleccione un cliente</option>
                                                {clientes.map(cliente => (
                                                    <option key={cliente.id} value={cliente.id}>
                                                        {cliente.firstName} {cliente.lastName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="descripcion" className="form-label">
                                        Descripción
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="descripcion"
                                        name="descripcion"
                                        value={clasePersonalizada.descripcion}
                                        onChange={handleInputChange}
                                        placeholder="Describe los objetivos y detalles de la clase personalizada"
                                        rows="3"
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label htmlFor="fecha" className="form-label">
                                                Fecha *
                                            </label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="fecha"
                                                name="fecha"
                                                value={clasePersonalizada.fecha}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label htmlFor="hora" className="form-label">
                                                Hora *
                                            </label>
                                            <input
                                                type="time"
                                                className="form-control"
                                                id="hora"
                                                name="hora"
                                                value={clasePersonalizada.hora}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="mb-3">
                                            <label htmlFor="precio" className="form-label">
                                                Precio ($) *
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="precio"
                                                name="precio"
                                                value={clasePersonalizada.precio}
                                                onChange={handleInputChange}
                                                placeholder="0.00"
                                                step="0.01"
                                                min="0"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="metodoPago" className="form-label">
                                        Método de Pago *
                                    </label>
                                    <select
                                        className="form-select"
                                        id="metodoPago"
                                        name="metodoPago"
                                        value={clasePersonalizada.metodoPago}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {metodosPago.map(metodo => (
                                            <option key={metodo} value={metodo}>
                                                {metodo}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="d-flex justify-content-end gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => navigate('/membresias/clases')}
                                        disabled={cargando}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={cargando}
                                    >
                                        {cargando ? 'Guardando...' : 'Crear Clase Personalizada'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormularioClasePersonalizada;
