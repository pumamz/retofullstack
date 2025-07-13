import api from '../api/axios';

export const clasePersonalizadaService = {
  obtenerClases: async () => {
    const response = await api.get('/personalized-classes');
    return response.data;
  },

  obtenerClasePorId: async (id) => {
    const response = await api.get(`/personalized-classes/${id}`);
    return response.data;
  },

  obtenerPorClienteDni: async (dni) => {
    const response = await api.get(`/personalized-classes/client-dni/${dni}`);
    return response.data;
  },

  obtenerPorRangoFechas: async (startDate, endDate) => {
    const response = await api.get('/personalized-classes/date-range', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  obtenerPorEstado: async (estado) => {
    const response = await api.get(`/personalized-classes/status/${estado}`);
    return response.data;
  },

  obtenerProgramadasPorFecha: async (fecha) => {
    const response = await api.get(`/personalized-classes/scheduled/${fecha}`);
    return response.data;
  },

  obtenerPorClienteYEstado: async (clientId, estado) => {
    const response = await api.get(`/personalized-classes/client/${clientId}/status/${estado}`);
    return response.data;
  },

  crearClase: async (data) => {
    const response = await api.post('/personalized-classes', data);
    return response.data;
  },

  actualizarClase: async (id, data) => {
    const response = await api.put(`/personalized-classes/${id}`, data);
    return response.data;
  },

  eliminarClase: async (id) => {
    const response = await api.delete(`/personalized-classes/${id}`);
    return response.data;
  },

  completarClase: async (id) => {
    const response = await api.patch(`/personalized-classes/${id}/complete`);
    return response.data;
  },

  cancelarClase: async (id) => {
    const response = await api.patch(`/personalized-classes/${id}/cancel`);
    return response.data;
  },

  reprogramarClase: async (id, nuevaFecha, nuevoHora) => {
    const response = await api.patch(`/personalized-classes/${id}/reschedule`, null, {
      params: { newDate: nuevaFecha, newTime: nuevoHora },
    });
    return response.data;
  },
};
