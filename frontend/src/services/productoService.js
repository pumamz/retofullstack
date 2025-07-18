import api from '../api/axios';

export const productoService = {

    listarProductos: async () => {
        const response = await api.get('/productos');
        return response.data;
    },

    obtenerProductoPorId: async (id) => {
        const response = await api.get(`/productos/${id}`);
        return response.data;
    },

    obtenerProductosPorCodigoBarra: async (barcode) => {
        const response = await api.get(`/productos/barcode/${barcode}`);
        return response.data;
    },

    crearProducto: async (producto) => {
        const response = await api.post('/productos', producto);
        return response.data;
    },

    actualizarProducto: async (id, producto) => {
        const response = await api.put(`/productos/${id}`, producto);
        return response.data;
    },

    cambiarEstado: async (id, enabled) => {
        const response = await api.patch(`/productos/${id}/enable`, null, {
            params: { enabled },
        });
        return response.data;
    },

    buscarProductos: async (searchTerm) => {
        if (!searchTerm || searchTerm.trim() === '') {
            const response = await productoService.listarProductos();
            return response;
        }
        const response = await api.get('/productos/search', {
            params: { searchTerm: searchTerm.trim() },
        });
        return response.data;
    },

    listarProductosActivos: async () => {
    const response = await api.get('/productos/enabled');
    return response.data;
  },
};
