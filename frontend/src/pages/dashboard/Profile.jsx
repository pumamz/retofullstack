import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const Profile = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="container mt-4">
      <Card title="Mi Perfil">
        <p>ID: {user.id}</p>
        <p>Nombre: {user.firstName}</p>
        <p>Usuario: {user.username}</p>
        <p>Correo: {user.email}</p>
        <p>Rol: {user.role}</p>

        <Button className="btn btn-danger mt-3" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </Card>
    </div>
  );
};

export default Profile;
