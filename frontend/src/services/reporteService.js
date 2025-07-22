import api from '../api/axios';

export const reporteService = {
  // Reportes de membresías
  obtenerReporteMembresias: async (fechaInicio, fechaFin) => {
    if (fechaInicio && fechaFin) {
      const response = await api.get('/membership-sales/date-range', {
        params: { startDate: fechaInicio, endDate: fechaFin }
      });
      return response.data;
    } else {
      // Sin filtro de fechas, obtener todas las membresías
      const response = await api.get('/membership-sales');
      return response.data;
    }
  },

  obtenerMembresiasExpirando: async (dias = 30) => {
    const response = await api.get('/membership-sales/expiring-soon', {
      params: { days: dias }
    });
    return response.data;
  },

  obtenerMembresiasExpiradas: async () => {
    const response = await api.get('/membership-sales/expired');
    return response.data;
  },

  // Reportes de clases personalizadas
  obtenerReporteClasesPersonalizadas: async (fechaInicio, fechaFin) => {
    if (fechaInicio && fechaFin) {
      const response = await api.get('/personalized-classes/date-range', {
        params: { startDate: fechaInicio, endDate: fechaFin }
      });
      return response.data;
    } else {
      // Sin filtro de fechas, obtener todas las clases
      const response = await api.get('/personalized-classes');
      return response.data;
    }
  },

  obtenerClasesPorEstado: async (estado) => {
    const response = await api.get(`/personalized-classes/status/${estado}`);
    return response.data;
  },

  // Reportes de ventas de productos
  obtenerReporteVentasProductos: async (fechaInicio, fechaFin) => {
    if (fechaInicio && fechaFin) {
      const response = await api.get('/ventas/date-range', {
        params: { start: fechaInicio, end: fechaFin }
      });
      return response.data;
    } else {
      // Sin filtro de fechas, obtener todas las ventas
      const response = await api.get('/ventas');
      return response.data;
    }
  },

  obtenerTodasLasVentas: async () => {
    const response = await api.get('/ventas');
    return response.data;
  },

  // Reportes de pedidos
  obtenerReportePedidos: async () => {
    const response = await api.get('/pedidos');
    return response.data;
  },

  // Reportes de clientes
  obtenerReporteClientes: async () => {
    const response = await api.get('/clients');
    return response.data;
  },

  obtenerClientesPorEstado: async (enabled) => {
    // Como no hay endpoint específico, obtenemos todos y filtramos
    const response = await api.get('/clients');
    if (enabled !== '') {
      return response.data.filter(client => client.enabled === (enabled === 'true'));
    }
    return response.data;
  },

  // Reportes de productos
  obtenerReporteProductos: async () => {
    const response = await api.get('/productos');
    return response.data;
  },

  obtenerProductosStockBajo: async () => {
    const response = await api.get('/productos/low-stock');
    return response.data;
  },

  // Reportes de proveedores
  obtenerReporteProveedores: async () => {
    const response = await api.get('/suppliers');
    return response.data;
  },

  obtenerProveedoresPorEstado: async (enabled) => {
    const response = await api.get('/suppliers', {
      params: { enabled }
    });
    return response.data;
  },

  // Resumen general del dashboard
  obtenerResumenGeneral: async () => {
    try {
      const [
        ventasHoy,
        membresiasSemana,
        clasesHoy,
        clientesActivos
      ] = await Promise.all([
        api.get('/ventas/date-range', {
          params: {
            start: new Date().toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0]
          }
        }),
        api.get('/membership-sales/date-range', {
          params: {
            startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0]
          }
        }),
        api.get(`/personalized-classes/scheduled/${new Date().toISOString().split('T')[0]}`),
        api.get('/clients', { params: { enabled: true } })
      ]);

      return {
        ventasHoy: ventasHoy.data,
        membresiasSemana: membresiasSemana.data,
        clasesHoy: clasesHoy.data,
        clientesActivos: clientesActivos.data
      };
    } catch (error) {
      console.error('Error obteniendo resumen general:', error);
      throw error;
    }
  }
};
