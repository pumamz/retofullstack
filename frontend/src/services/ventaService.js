import api from '../api/axios';

export const VentaService = {
    obtenerDatosVenta: async () => {
        return await api.get(`/ventas/data`);
    },

    crearVenta: async (venta) => {
        return await api.post(`/ventas`, venta);
    },

    listarVentas: async () => {
        return await api.get(`/ventas`);
    },

    obtenerVentaPorNumero: async (numeroVenta) => {
        return await api.get(`/ventas/${numeroVenta}`);
    },

    cancelarVenta: async (ventaId) => {
        return await api.post(`/ventas/${ventaId}/cancel`);
    },
    obtenerVentasPorFecha: async (fechaInicio, fechaFin) => {
        return await api.get('/ventas/date-range', {
    params: {
      start: fechaInicio,
      end: fechaFin
    }
        });
    }

};