import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    FaDumbbell, FaUser, FaBox, FaShoppingCart,
    FaClipboardList, FaCalendar, FaCalendarDay, FaHome
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const navItems = [
    { path: '/', label: 'Dashboard', icon: <FaHome /> },
    { path: '/membresias', label: 'Membresías', icon: <FaCalendar /> },
    { path: '/membresias/clases', label: 'Clases', icon: <FaCalendarDay /> },
    { path: '/productos', label: 'Productos', icon: <FaBox /> },
    { path: '/productos/ventas', label: 'Ventas', icon: <FaShoppingCart /> },
    { path: '/productos/pedidos', label: 'Pedidos', icon: <FaClipboardList /> },
    { path: '/clientes', label: 'Clientes', icon: <FaUser /> },
    { path: '/proveedores', label: 'Proveedores', icon: <FaUser /> },
    { path: '/reportes', label: 'Reportes', icon: <FaClipboardList /> },
];

const Navbar = () => {
    const { user } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <aside
            className="position-fixed top-0 start-0 bg-dark text-white d-flex flex-column justify-content-between"
            style={{
                width: '250px',
                height: '100vh',
                boxShadow: '2px 0 8px rgba(0,0,0,0.2)',
                zIndex: 1000,
            }}
        >
            <div className="px-4 py-3 border-bottom border-secondary d-flex align-items-center">
        <FaDumbbell size={24} className="me-2" />
        <h5 className="fw-bold text-white mb-0 ps-3">GymSystem</h5>
      </div>
            <div className="flex-grow-1 overflow-auto">
                {navItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.path}
                        className={`d-flex align-items-center text-decoration-none px-4 py-2 mb-1 ${isActive(item.path)
                                ? 'bg-white text-dark fw-semibold shadow-sm'
                                : 'text-white'
                            }`}
                        style={{
                            transition: 'all 0.3s ease',
                            borderLeft: isActive(item.path) ? '4px solid #0d6efd' : '4px solid transparent',
                            borderRadius: '0px',
                        }}
                    >
                        <span
                            style={{
                                color: isActive(item.path) ? '#0d6efd' : 'inherit',
                                width: 24,
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                            className="me-3"
                        >
                            {item.icon}
                        </span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </div>

            <div className="border-top border-secondary px-4 py-3 d-flex align-items-center">
                <Link
                    to="/user/perfil"
                    className="text-decoration-none d-flex align-items-center text-white w-100"
                >
                    <FaUser style={{ width: 24 }} className="me-3" />
                    <div>
                        <div className="fw-semibold">{user?.firstName || 'Usuario'}</div>
                    </div>
                </Link>
            </div>
        </aside>
    );
};

export default Navbar;
