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

  obtenerVentasPorRangoFechas: async (startDate, endDate) => {
    const response = await api.get('/membership-sales/date-range', {
      params: { startDate, endDate }
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
