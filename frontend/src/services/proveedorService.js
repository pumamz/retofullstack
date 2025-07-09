import api from '../api/axios';

export const ProveedorService = {
  obtenerProveedores: () => api.get(`suppliers`),

  obtenerProveedorPorId: (id) => api.get(`suppliers/${id}`),

  crearProveedor: (supplier) => api.post(`suppliers`, supplier),

  actualizarProveedor: (id, supplier) => api.put(`suppliers/${id}`, supplier),

  eliminarProveedor: (id) => api.delete(`suppliers/${id}`),

  buscarProveedores: (params) => api.get(`suppliers/search`, { params }),

  cambiarEstado: (id, enabled) =>
    api.patch(`suppliers/${id}/enable`, null, { params: { enabled } }),

  obtenerProveedoresPorEstado: (enabled) =>
    api.get(`suppliers`, { params: { enabled } }),
};