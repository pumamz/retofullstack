import axios from 'axios';

const API_URL = 'http://localhost:8080/api/ventas';

export const VentaService = {
    obtenerDatosVenta: async () => {
        return await axios.get(`${API_URL}/data`);
    },

    registrarVenta: async (venta) => {
        return await axios.post(API_URL, venta);
    },

    listarVentas: async () => {
        return await axios.get(API_URL);
    }
};