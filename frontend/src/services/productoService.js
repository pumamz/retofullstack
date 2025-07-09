import api from '../api/axios';

export const ProductoService = {
    listarProductos: () => api.get('/productos'),
    obtenerProducto: (id) => api.get(`/productos/${id}`),
    obtenerProductosBarraCodigo: (barcode) => api.get(`/productos/barcode/${barcode}`),
    obtenerProductosStockBajo: () => api.get(`/productos/low-stock`),
    crearProducto: (producto) => api.post(`/productos`, producto),
    actualizarProducto: (id, producto) => api.put(`/productos/${id}`, producto),
    eliminarProducto: (id) => api.delete(`/productos/${id}`)
};
