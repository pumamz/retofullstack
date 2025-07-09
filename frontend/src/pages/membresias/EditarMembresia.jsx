import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MembresiaService } from '../../services/MembresiaService';
import { Helmet } from 'react-helmet';

const EditarMembresia = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [membresia, setMembresia] = useState({
        nombre: '',
        precio: '',
        duracionDias: ''
    });
    const [error, setError] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [cargandoDatos, setCargandoDatos] = useState(true);

    useEffect(() => {
        const cargarMembresia = async () => {
            try {
                setCargandoDatos(true);
                const response = await MembresiaService.obtenerMembresiaPorId(id);
                const membresiaData = response.data;
                setMembresia({
                    nombre: membresiaData.nombre,
                    precio: membresiaData.precio.toString(),
                    duracionDias: membresiaData.duracionDias.toString()
                });
            } catch (error) {
                console.error('Error al cargar membresía:', error);
                setError('Error al cargar la membresía');
            } finally {
                setCargandoDatos(false);
            }
        };

        cargarMembresia();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMembresia(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setCargando(true);
            setError(null);
            
            // Convertir precio y duracionDias a números
            const membresiaData = {
                ...membresia,
                precio: parseFloat(membresia.precio),
                duracionDias: parseInt(membresia.duracionDias)
            };
            
            await MembresiaService.actualizarMembresia(id, membresiaData);
            navigate('/membresias/lista');
        } catch (error) {
            console.error('Error al actualizar membresía:', error);
            setError('Error al actualizar la membresía');
        } finally {
            setCargando(false);
        }
    };

    if (cargandoDatos) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <Helmet>
                <title>Editar Membresía</title>
            </Helmet>
            
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h2 className="mb-0">Editar Membresía</h2>
                        </div>
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="nombre" className="form-label">
                                        Nombre de la Membresía *
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombre"
                                        name="nombre"
                                        value={membresia.nombre}
                                        onChange={handleInputChange}
                                        placeholder="Ej: Membresía Mensual, Membresía Anual, etc."
                                        required
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="precio" className="form-label">
                                                Precio ($) *
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="precio"
                                                name="precio"
                                                value={membresia.precio}
                                                onChange={handleInputChange}
                                                placeholder="0.00"
                                                step="0.01"
                                                min="0"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="duracionDias" className="form-label">
                                                Duración (días) *
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="duracionDias"
                                                name="duracionDias"
                                                value={membresia.duracionDias}
                                                onChange={handleInputChange}
                                                placeholder="30"
                                                min="1"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="alert alert-info">
                                    <strong>Nota:</strong> La fecha de creación no se puede modificar.
                                </div>

                                <div className="d-flex justify-content-end gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => navigate('/membresias/lista')}
                                        disabled={cargando}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={cargando}
                                    >
                                        {cargando ? 'Actualizando...' : 'Actualizar Membresía'}
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

export default EditarMembresia;
