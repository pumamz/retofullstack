import api from '../api/axios';

export const proveedorService = {

  listarProveedores: async () => {
    const response = await api.get('/suppliers');
    return response.data;
  },

  obtenerProveedorPorId: async (id) => {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  },

  crearProveedor: async (supplier) => {
    const response = await api.post('/suppliers', supplier);
    return response.data;
  },

  actualizarProveedor: async (id, supplier) => {
    const response = await api.put(`/suppliers/${id}`, supplier);
    return response.data;
  },

  eliminarProveedor: async (id) => {
    const response = await api.delete(`/suppliers/${id}`);
    return response.data;
  },

  cambiarEstado: async (id, enabled) => {
    const response = await api.patch(`/suppliers/${id}/enable`, null, {
      params: { enabled },
    });
    return response.data;
  },

  buscarProveedores: async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      const response = await proveedorService.listarProveedores();
      return response;
    }
    const response = await api.get('/suppliers/search', {
      params: { searchTerm: searchTerm.trim() },
    });
    return response.data;
  },

  listarProveedoresActivos: async () => {
    const response = await api.get('/suppliers/enabled');
    return response.data;
  },
};
