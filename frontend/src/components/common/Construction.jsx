import React from 'react';
import { FaTools } from 'react-icons/fa';

const Construction = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <FaTools size={64} className="text-yellow-500 mb-4 animate-pulse" />
      <h1 className="text-3xl font-semibold text-gray-700 mb-2">¡Estamos trabajando en esta página!</h1>
      <p className="text-gray-500 text-lg">Vuelve pronto para ver las novedades.</p>
    </div>
  );
};

export default Construction;
