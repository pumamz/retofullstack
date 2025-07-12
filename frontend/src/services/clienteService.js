import api from '../api/axios';

export const clienteService = {
  obtenerClientes: async () => {
    const response = await api.get('/clients');
    return response.data;
  },

  obtenerClientePorId: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  crearCliente: async (client) => {
    const response = await api.post('/clients', client);
    return response.data;
  },

  actualizarCliente: async (id, client) => {
    const response = await api.put(`/clients/${id}`, client);
    return response.data;
  },

  eliminarCliente: async (id) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },

  buscarClientes: async (searchTerm) => {
    const response = await api.get('/clients/search', {
      params: { searchTerm },
    });
    return response.data;
  },

  cambiarEstado: async (id, enabled) => {
    const response = await api.patch(`/clients/${id}/enable`, null, {
      params: { enabled },
    });
    return response.data;
  },

  obtenerClientesPorEstado: async (enabled) => {
    const response = await api.get('/clients', {
      params: { enabled },
    });
    return response.data;
  },
};
