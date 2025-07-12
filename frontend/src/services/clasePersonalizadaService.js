import api from '../api/axios';


export const clasePersonalizadaService = {
  obtenerClasesPersonalizadas: async () => {
    try {
      const response = await api.get('/personalized-classes');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch personalized classes: ${error.message}`);
    }
  },

  obtenerClasePersonalizadaPorId: async (id) => {
    try {
      const response = await api.get(`/personalized-classes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch personalized class: ${error.message}`);
    }
  },

  obtenerClasesPersonalizadasPorCliente: async (clientId) => {
    try {
      const response = await api.get(`/personalized-classes/client/${clientId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch client personalized classes: ${error.message}`);
    }
  },

  obtenerClasesPersonalizadasPorRangoDeFechas: async (startDate, endDate) => {
    try {
      const response = await api.get(`/personalized-classes/date-range?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch personalized classes by date range: ${error.message}`);
    }
  },

  obtenerClasesPersonalizadasPorEstado: async (estado) => {
    try {
      const response = await api.get(`/personalized-classes/status/${estado}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch personalized classes by status: ${error.message}`);
    }
  },

  obtenerClasesPersonalizadasProgramadasPorFecha: async (fecha) => {
    try {
      const response = await api.get(`/personalized-classes/scheduled/${fecha}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch scheduled classes: ${error.message}`);
    }
  },

  obtenerClasesPersonalizadasPorClienteYEstado: async (clientId, estado) => {
    try {
      const response = await api.get(`/personalized-classes/client/${clientId}/status/${estado}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch personalized classes by client and status: ${error.message}`);
    }
  },

  crearClasePersonalizada: async (classData) => {
    try {
      const response = await api.post('/personalized-classes', classData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create personalized class: ${error.message}`);
    }
  },

  actualizarClasePersonalizada: async (id, classData) => {
    try {
      const response = await api.put(`/personalized-classes/${id}`, classData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update personalized class: ${error.message}`);
    }
  },

  eliminarClasePersonalizada: async (id) => {
    try {
      await api.delete(`/personalized-classes/${id}`);
    } catch (error) {
      throw new Error(`Failed to delete personalized class: ${error.message}`);
    }
  },

  completarClasePersonalizada: async (id) => {
    try {
      await api.patch(`/personalized-classes/${id}/complete`);
    } catch (error) {
      throw new Error(`Failed to complete personalized class: ${error.message}`);
    }
  },

  cancelarClasePersonalizada: async (id) => {
    try {
      await api.patch(`/personalized-classes/${id}/cancel`);
    } catch (error) {
      throw new Error(`Failed to cancel personalized class: ${error.message}`);
    }
  },

  reprogramarClasePersonalizada: async (id, nuevaFecha, nuevoHora) => {
    try {
      const response = await api.patch(`/personalized-classes/${id}/reschedule?nuevaFecha=${nuevaFecha}&nuevoHora=${nuevoHora}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to reschedule personalized class: ${error.message}`);
    }
  },
};