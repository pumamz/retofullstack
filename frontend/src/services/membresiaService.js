import api from '../api/axios';

export const membresiaService = {
  obtenerMembresias: async () => {
    const response = await api.get('/memberships');
    return response.data;
  },

  obtenerMembresiasActivas: async () => {
    const response = await api.get('/memberships/active');
    return response.data;
  },

  obtenerMembresiaPorId: async (id) => {
    const response = await api.get(`/memberships/${id}`);
    return response.data;
  },

  buscarMembresias: async (searchTerm) => {
    const response = await api.get('/memberships/search', {
      params: { searchTerm },
    });
    return response.data;
  },

  crearMembresia: async (data) => {
    const response = await api.post('/memberships', data);
    return response.data;
  },

  actualizarMembresia: async (id, data) => {
    const response = await api.put(`/memberships/${id}`, data);
    return response.data;
  },

  cambiarEstado: async (id, enabled) => {
    const response = await api.patch(`/memberships/${id}/enable`, null, {
      params: { enabled },
    });
    return response.data;
  }
};
