import axios from 'axios';

const API_URL = 'http://localhost:8080/api/productos';

export const ProductoService = {
    listarProductos: async () => {
        return await axios.get(API_URL);
    },

    obtenerProducto: async (id) => {
        return await axios.get(`${API_URL}/${id}`);
    },

    guardarProducto: async (producto) => {
        if (producto.id) {
            return await axios.put(`${API_URL}/${producto.id}`, producto);
        }
        return await axios.post(API_URL, producto);
    },

    eliminarProducto: async (id) => {
        return await axios.delete(`${API_URL}/${id}`);
    }
};