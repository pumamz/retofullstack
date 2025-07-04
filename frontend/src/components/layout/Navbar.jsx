import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaDumbbell, FaUser, FaBox, FaShoppingCart, FaClipboardList, FaCalendar, FaCalendarDay, FaHome } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div
            className="d-flex flex-column bg-dark text-white position-fixed h-100"
            style={{ width: '250px', padding: '20px' }}
        >
            <div className="mb-4 d-flex align-items-center">
                <FaDumbbell className="me-2 fs-4" />
                <h4 className="mb-0">GymSystem</h4>
            </div>

            <Link to="/" className={`btn btn-dark text-start mb-2 ${isActive('/')}`}>
                <FaHome className="me-2" />
                Dashboard
            </Link>

            <Link to="/membresias" className={`btn btn-dark text-start mb-2 ${isActive('/membresias')}`}>
                <FaCalendar className="me-2" />
                Membresías
            </Link>

            <Link to="/membresias/clases" className={`btn btn-dark text-start mb-2 ${isActive('/membresias/clases')}`}>
                <FaCalendarDay className="me-2" />
                Clases
            </Link>

            <Link to="/productos" className={`btn btn-dark text-start mb-2 ${isActive('/productos')}`}>
                <FaBox className="me-2" />
                Productos
            </Link>

            <Link to="/productos/ventas" className={`btn btn-dark text-start mb-2 ${isActive('/productos/ventas')}`}>
                <FaShoppingCart className="me-2" />
                Ventas
            </Link>

            <Link to="/productos/pedidos" className={`btn btn-dark text-start mb-2 ${isActive('/productos/pedidos')}`}>
                <FaClipboardList className="me-2" />
                Pedidos
            </Link>

            <Link to="/clientes" className={`btn btn-dark text-start mb-2 ${isActive('/clientes')}`}>
                <FaUser className="me-2" />
                Clientes
            </Link>
            <Link to="/proveedores" className={`btn btn-dark text-start mb-2 ${isActive('/proveedores')}`}>
                <FaUser className="me-2" />
                Proveedores
            </Link>
            <Link to="/reportes" className={`btn btn-dark text-start mb-2 ${isActive('/reportes')}`}>
                <FaClipboardList className="me-2" />
                Reportes
            </Link>


            <div className="mt-auto h-100 d-flex flex-column justify-content-end">
                <Link to="/user/perfil" className={`btn btn-dark text-start mb-2 ${isActive('/usuario')}`}>
                    <FaUser className="me-2" />
                    {user?.username || 'Usuario'}
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
