import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MembresiaService } from '../../services/MembresiaService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';

const ListaMembresia = () => {
    const navigate = useNavigate();
    const [membresias, setMembresias] = useState([]);
    const [membresiaSeleccionada, setMembresiaSeleccionada] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarMembresias();
        const modalElement = document.getElementById('detalleMembresiaModal');
        if (modalElement) {
            modalElement.addEventListener('hidden.bs.modal', limpiarModal);
        }

        return () => {
            const modalElement = document.getElementById('detalleMembresiaModal');
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

    const cargarMembresias = async () => {
        try {
            setCargando(true);
            const response = await MembresiaService.listarMembresias();
            setMembresias(response.data);
        } catch (error) {
            console.error('Error al cargar membresías:', error);
            setError('Error al cargar las membresías');
        } finally {
            setCargando(false);
        }
    };

    const mostrarDetalles = (membresia) => {
        setMembresiaSeleccionada(membresia);
    };

    const eliminarMembresia = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta membresía?')) {
            try {
                await MembresiaService.eliminarMembresia(id);
                await cargarMembresias(); // Recargar la lista
            } catch (error) {
                console.error('Error al eliminar membresía:', error);
                setError('Error al eliminar la membresía');
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
            <Helmet>
                <title>Lista de Membresías</title>
            </Helmet>
            <div className="d-flex justify-content-between mb-3">
                <h2>Lista de Membresías</h2>
                <Link to="/membresias/nueva" className="btn btn-success d-flex align-items-center justify-content-center">
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Nueva membresía
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
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Duración (días)</th>
                            <th>Fecha de Creación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {membresias.map(membresia => (
                            <tr key={membresia.id}>
                                <td>{membresia.id}</td>
                                <td>{membresia.nombre}</td>
                                <td>${membresia.precio?.toFixed(2)}</td>
                                <td>{membresia.duracionDias} días</td>
                                <td>{new Date(membresia.fechaCreacion).toLocaleDateString()}</td>
                                <td>
                                    <div className="btn-group" role="group">
                                        <button
                                            className="btn btn-info btn-sm"
                                            onClick={() => mostrarDetalles(membresia)}
                                            data-bs-toggle="modal"
                                            data-bs-target="#detalleMembresiaModal"
                                            title="Ver detalles"
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
                                        <button
                                            className="btn btn-warning btn-sm"
                                            onClick={() => navigate(`/membresias/editar/${membresia.id}`)}
                                            title="Editar membresía"
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => eliminarMembresia(membresia.id)}
                                            title="Eliminar membresía"
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
                id="detalleMembresiaModal"
                tabIndex="-1"
                aria-labelledby="modalLabel"
                aria-hidden="true"
                data-bs-backdrop="static"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalLabel">
                                Detalles de la membresía {membresiaSeleccionada?.nombre}
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
                            {membresiaSeleccionada && (
                                <div className="row">
                                    <div className="col-md-6">
                                        <p><strong>ID:</strong> {membresiaSeleccionada.id}</p>
                                        <p><strong>Nombre:</strong> {membresiaSeleccionada.nombre}</p>
                                        <p><strong>Precio:</strong> ${membresiaSeleccionada.precio?.toFixed(2)}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p><strong>Duración:</strong> {membresiaSeleccionada.duracionDias} días</p>
                                        <p><strong>Fecha de Creación:</strong> {new Date(membresiaSeleccionada.fechaCreacion).toLocaleDateString()}</p>
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

export default ListaMembresia;