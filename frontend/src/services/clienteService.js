import api from '../api/axios';

export const ClienteService = {
  obtenerClientes: () => api.get(`clients`),

  obtenerClientePorId: (id) => api.get(`clients/${id}`),

  crearCliente: (client) => api.post(`clients`, client),

  actualizarCliente: (id, client) => api.put(`clients/${id}`, client),

  eliminarCliente: (id) => api.delete(`clients/${id}`),

  buscarClientes: (params) => api.get(`clients/search`, { params }),

  cambiarEstado: (id, enabled) => 
    api.patch(`clients/${id}/enable`, null, { params: { enabled } }),

  obtenerClientesPorEstado: (enabled) =>
    api.get(`clients`, { params: { enabled } }),
};