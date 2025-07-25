import api from '../api/axios';

export const VentaService = {

    crearVenta: async (venta) => {
        return await api.post(`/ventas`, venta);
    },

    listarVentas: async () => {
        return await api.get(`/ventas`);
    },

    obtenerVentaPorNumero: async (numeroVenta) => {
        return await api.get(`/ventas/${numeroVenta}`);
    },
};