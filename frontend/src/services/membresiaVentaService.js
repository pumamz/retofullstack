import api from '../api/axios';

export const membresiaVentaService = {
  obtenerVentasMembresias: async () => {
    const response = await api.get('/membership-sales');
    return response.data;
  },

  obtenerVentaMembresiaPorId: async (id) => {
    const response = await api.get(`/membership-sales/${id}`);
    return response.data;
  },

  obtenerVentasPorCliente: async (dni) => {
    const response = await api.get(`/membership-sales/client/${dni}`);
    return response.data;
  },

  obtenerVentasPorRangoFechas: async (startDate, endDate) => {
    const response = await api.get('/membership-sales/date-range', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  obtenerMembresiasExpirando: async (days = 7) => {
    const response = await api.get('/membership-sales/expiring-soon', {
      params: { days }
    });
    return response.data;
  },

  obtenerMembresiasExpiradas: async () => {
    const response = await api.get('/membership-sales/expired');
    return response.data;
  },

  obtenerClientesConMembresiasExpirando: async (days = 7) => {
    const response = await api.get('/membership-sales/clients-expiring-soon', {
      params: { days }
    });
    return response.data;
  },

  crearVentaMembresia: async (data) => {
    const response = await api.post('/membership-sales', data);
    return response.data;
  },

  cancelarVentaMembresia: async (id) => {
    const response = await api.patch(`/membership-sales/${id}/cancel`);
    return response.data;
  },

  actualizarMembresiasExpiradas: async () => {
    const response = await api.post('/membership-sales/update-expired');
    return response.data;
  }
};
