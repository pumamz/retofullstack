import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VentaMembresiaService } from '../../services/VentaMembresiaService';
import { Helmet } from 'react-helmet';

const NuevaVentaMembresia = () => {
    const navigate = useNavigate();
    const [ventaMembresia, setVentaMembresia] = useState({
        clienteId: '',
        membresiaId: '',
        metodoPago: 'EFECTIVO'
    });
    const [clientes, setClientes] = useState([]);
    const [membresias, setMembresias] = useState([]);
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [cargandoDatos, setCargandoDatos] = useState(true);

    const metodoPagoOptions = [
        { value: 'EFECTIVO', label: 'Efectivo' },
        { value: 'TARJETA_CREDITO', label: 'Tarjeta de Crédito' },
        { value: 'TARJETA_DEBITO', label: 'Tarjeta de Débito' },
        { value: 'TRANSFERENCIA', label: 'Transferencia Bancaria' },
        { value: 'PAYPAL', label: 'PayPal' }
    ];

    useEffect(() => {
        cargarDatos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const cargarDatos = async () => {
        try {
            setCargandoDatos(true);
            setError(null);
            
            // Cargar clientes
            try {
                console.log('Cargando clientes...');
                const clientesResponse = await VentaMembresiaService.obtenerClientes();
                console.log('Clientes cargados:', clientesResponse.data);
                setClientes(clientesResponse.data);
            } catch (error) {
                console.error('Error específico al cargar clientes:', error);
                setClientes([]);
            }

            // Cargar membresías
            try {
                console.log('Cargando membresías...');
                const membresiasResponse = await VentaMembresiaService.obtenerMembresias();
                console.log('Membresías cargadas:', membresiasResponse.data);
                setMembresias(membresiasResponse.data);
            } catch (error) {
                console.error('Error específico al cargar membresías:', error);
                setMembresias([]);
            }
        } catch (error) {
            console.error('Error general al cargar datos:', error);
            setError('Error al cargar los datos necesarios del backend');
        } finally {
            setCargandoDatos(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVentaMembresia(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setCargando(true);
            setError(null);
            
            // Preparar datos para enviar - Formato con objetos anidados
            const ventaData = {
                metodoPago: ventaMembresia.metodoPago,
                cliente: { id: parseInt(ventaMembresia.clienteId) },
                membresia: { id: parseInt(ventaMembresia.membresiaId) }
            };
            
            // Formato anterior que no funcionó:
            // const ventaData = {
            //     metodoPago: ventaMembresia.metodoPago,
            //     clienteId: parseInt(ventaMembresia.clienteId),
            //     membresiaId: parseInt(ventaMembresia.membresiaId)
            // };
            
            console.log('Datos a enviar:', ventaData);
            
            const response = await VentaMembresiaService.crearVentaMembresia(ventaData);
            console.log('Respuesta exitosa:', response);
            navigate('/ventas-membresia/lista');
        } catch (error) {
            console.error('Error al crear venta de membresía:', error);
            console.error('Error details:', {
                message: error.message,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                config: error.config
            });
            
            // Log específico del mensaje del servidor
            if (error.response?.data) {
                console.error('Backend error message:', error.response.data);
                if (error.response.data.message) {
                    console.error('Backend error details:', error.response.data.message);
                }
            }
            
            // Mensaje de error más específico
            let errorMessage = 'Error al crear la venta de membresía';
            if (error.response?.status === 400) {
                errorMessage = 'Datos inválidos. Verifique la información ingresada.';
            } else if (error.response?.status === 404) {
                errorMessage = 'El endpoint no fue encontrado. Verifique la configuración del servidor.';
            } else if (error.response?.status === 500) {
                errorMessage = 'Error interno del servidor. Contacte al administrador.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            setError(errorMessage);
        } finally {
            setCargando(false);
        }
    };

    const obtenerMembresiaSeleccionada = () => {
        if (!ventaMembresia.membresiaId) return null;
        return membresias.find(m => m.id === parseInt(ventaMembresia.membresiaId));
    };

    if (cargandoDatos) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando datos...</span>
                </div>
            </div>
        );
    }

    if (cargando) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Guardando...</span>
                </div>
            </div>
        );
    }

    const membresiaSeleccionada = obtenerMembresiaSeleccionada();

    return (
        <div className="container mt-4">
            <Helmet>
                <title>Nueva Venta de Membresía</title>
            </Helmet>
            
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="mb-0">Nueva Venta de Membresía</h2>
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
                                            <label htmlFor="clienteId" className="form-label">
                                                Cliente *
                                            </label>
                                            <select
                                                className="form-select"
                                                id="clienteId"
                                                name="clienteId"
                                                value={ventaMembresia.clienteId}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Seleccionar cliente...</option>
                                                {clientes.map(cliente => (
                                                    <option key={cliente.id} value={cliente.id}>
                                                        {cliente.firstName} {cliente.lastName} - {cliente.email}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="membresiaId" className="form-label">
                                                Membresía *
                                            </label>
                                            <select
                                                className="form-select"
                                                id="membresiaId"
                                                name="membresiaId"
                                                value={ventaMembresia.membresiaId}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Seleccionar membresía...</option>
                                                {membresias.map(membresia => (
                                                    <option key={membresia.id} value={membresia.id}>
                                                        {membresia.nombre} - ${membresia.precio?.toFixed(2)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {membresiaSeleccionada && (
                                    <div className="alert alert-info mb-3">
                                        <h6>Detalles de la Membresía Seleccionada:</h6>
                                        <p className="mb-1"><strong>Nombre:</strong> {membresiaSeleccionada.nombre}</p>
                                        <p className="mb-1"><strong>Duración:</strong> {membresiaSeleccionada.duracionDias} días</p>
                                        <p className="mb-0"><strong>Precio:</strong> <span className="h6 text-success">${membresiaSeleccionada.precio?.toFixed(2)}</span></p>
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label htmlFor="metodoPago" className="form-label">
                                        Método de Pago *
                                    </label>
                                    <select
                                        className="form-select"
                                        id="metodoPago"
                                        name="metodoPago"
                                        value={ventaMembresia.metodoPago}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        {metodoPagoOptions.map(metodo => (
                                            <option key={metodo.value} value={metodo.value}>
                                                {metodo.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="alert alert-warning">
                                    <strong>Nota:</strong> La fecha de venta se generará automáticamente al momento de crear la venta. 
                                    La fecha de vencimiento se calculará basada en la duración de la membresía seleccionada.
                                </div>

                                <div className="d-flex justify-content-end gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => navigate('/ventas-membresia/lista')}
                                        disabled={cargando}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={cargando || !ventaMembresia.clienteId || !ventaMembresia.membresiaId}
                                    >
                                        {cargando ? 'Guardando...' : 'Crear Venta'}
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

export default NuevaVentaMembresia;
