import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clasePersonalizadaService } from '../../services/clasePersonalizadaService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

const ListaClasesPersonalizadas = () => {
    const navigate = useNavigate();
    const [clasesPersonalizadas, setClasesPersonalizadas] = useState([]);
    const [claseSeleccionada, setClaseSeleccionada] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarClasesPersonalizadas();
        const modalElement = document.getElementById('detalleClaseModal');
        if (modalElement) {
            modalElement.addEventListener('hidden.bs.modal', limpiarModal);
        }

        return () => {
            const modalElement = document.getElementById('detalleClaseModal');
            if (modalElement) {
                modalElement.removeEventListener('hidden.bs.modal', limpiarModal);
            }
            limpiarModal();
        };
    }, []);

    const limpiarModal = () => {
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
        document.body.classList.remove('modal-open');
        document.body.style.paddingRight = '';
        document.body.style.overflow = '';
    };

    const cargarClasesPersonalizadas = async () => {
        try {
            setCargando(true);
            const response = await clasePersonalizadaService.listarClasesPersonalizadas();
            setClasesPersonalizadas(response.data);
        } catch (error) {
            console.error('Error al cargar clases personalizadas:', error);
            setError('Error al cargar las clases personalizadas');
        } finally {
            setCargando(false);
        }
    };

    const mostrarDetalles = (clase) => {
        setClaseSeleccionada(clase);
    };

    const eliminarClasePersonalizada = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta clase personalizada?')) {
            try {
                await clasePersonalizadaService.eliminarClasePersonalizada(id);
                await cargarClasesPersonalizadas(); // Recargar la lista
            } catch (error) {
                console.error('Error al eliminar clase personalizada:', error);
                setError('Error al eliminar la clase personalizada');
            }
        }
    };

    if (cargando) {
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
            <h1>Lista de Clases Personalizadas</h1>
            <div className="d-flex justify-content-between mb-3">
                <h2>Lista de Clases Personalizadas</h2>
                <Link to="/membresias/clases/crear" className="btn btn-success d-flex align-items-center justify-content-center">
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Nueva Clase Personalizada
                </Link>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre Clase</th>
                            <th>Descripción</th>
                            <th>Cliente</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Precio</th>
                            <th>Método de Pago</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clasesPersonalizadas.map(clase => (
                            <tr key={clase.id}>
                                <td>{clase.id}</td>
                                <td>{clase.nombreClase}</td>
                                <td>
                                    <span title={clase.descripcion || 'Sin descripción'}>
                                        {clase.descripcion ? 
                                            (clase.descripcion.length > 50 ? 
                                                clase.descripcion.substring(0, 50) + '...' : 
                                                clase.descripcion
                                            ) : 
                                            'Sin descripción'
                                        }
                                    </span>
                                </td>
                                <td>{clase.cliente?.firstName} {clase.cliente?.lastName}</td>
                                <td>{new Date(clase.fecha).toLocaleDateString()}</td>
                                <td>{clase.hora}</td>
                                <td>${clase.precio?.toFixed(2)}</td>
                                <td>{clase.metodoPago}</td>
                                <td>
                                    <div className="btn-group" role="group">
                                        <button
                                            className="btn btn-info btn-sm"
                                            onClick={() => mostrarDetalles(clase)}
                                            data-bs-toggle="modal"
                                            data-bs-target="#detalleClaseModal"
                                            title="Ver detalles"
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => navigate(`membresias/clases/editar/${clase.id}`)}
                                            title="Editar clase"
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => eliminarClasePersonalizada(clase.id)}
                                            title="Eliminar clase"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <div
                className="modal fade"
                id="detalleClaseModal"
                tabIndex="-1"
                aria-labelledby="modalLabel"
                aria-hidden="true"
                data-bs-backdrop="static"
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalLabel">
                                Detalles de la clase: {claseSeleccionada?.nombreClase}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={limpiarModal}
                            ></button>
                        </div>
                        <div className="modal-body">
                            {claseSeleccionada && (
                                <div className="row">
                                    <div className="col-md-6">
                                        <p><strong>ID:</strong> {claseSeleccionada.id}</p>
                                        <p><strong>Nombre de la Clase:</strong> {claseSeleccionada.nombreClase}</p>
                                        <p><strong>Cliente:</strong> {claseSeleccionada.cliente?.firstName} {claseSeleccionada.cliente?.lastName}</p>
                                        <p><strong>Fecha:</strong> {new Date(claseSeleccionada.fecha).toLocaleDateString()}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p><strong>Hora:</strong> {claseSeleccionada.hora}</p>
                                        <p><strong>Precio:</strong> ${claseSeleccionada.precio?.toFixed(2)}</p>
                                        <p><strong>Método de Pago:</strong> {claseSeleccionada.metodoPago}</p>
                                    </div>
                                    <div className="col-12">
                                        <p><strong>Descripción:</strong></p>
                                        <p className="border p-2 bg-light">{claseSeleccionada.descripcion}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                                onClick={limpiarModal}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListaClasesPersonalizadas;
