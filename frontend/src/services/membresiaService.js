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

  eliminarMembresia: async (id) => {
    const response = await api.delete(`/memberships/${id}`);
    return response.data;
  },

  activarMembresia: async (id) => {
    const response = await api.patch(`/memberships/${id}/activate`);
    return response.data;
  },

  desactivarMembresia: async (id) => {
    const response = await api.patch(`/memberships/${id}/deactivate`);
    return response.data;
  },

  actualizarMembresiaEstado: async () => {
    const response = await api.get(`/memberships/update-status`);
    return response.data;
  }
};
