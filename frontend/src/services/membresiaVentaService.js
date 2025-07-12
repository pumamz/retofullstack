import api from '../api/axios';

export const membresiaVentaService = {
  obtenerVentasMembresias: async () => {
    try {
      const response = await api.get('/membership-sales');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch membership sales: ${error.message}`);
    }
  },

  obtenerVentaMembresiaPorId: async (id) => {
    try {
      const response = await api.get(`/membership-sales/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch membership sale: ${error.message}`);
    }
  },

  obtenerVentasMembresiasPorCliente: async (clientId) => {
    try {
      const response = await api.get(`/membership-sales/client/${clientId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch client membership sales: ${error.message}`);
    }
  },

  obtenerVentasMembresiasPorRangoDeFechas: async (startDate, endDate) => {
    try {
      const response = await api.get(`/membership-sales/date-range?startDate=${startDate}&endDate=${endDate}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch membership sales by date range: ${error.message}`);
    }
  },

  obtenerMembresiasExpirandoPronto: async (days = 7) => {
    try {
      const response = await api.get(`/membership-sales/expiring-soon?days=${days}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch expiring memberships: ${error.message}`);
    }
  },

  obtenerMembresiasExpiradas: async () => {
    try {
      const response = await api.get('/membership-sales/expired');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch expired memberships: ${error.message}`);
    }
  },

  obtenerClientesConMembresiasExpirandoPronto: async (days = 7) => {
    try {
      const response = await api.get(`/membership-sales/clients-expiring-soon?days=${days}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch clients with expiring memberships: ${error.message}`);
    }
  },

  crearVentaMembresia: async (membershipSaleData) => {
    try {
      const response = await api.post('/membership-sales', membershipSaleData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create membership sale: ${error.message}`);
    }
  },

  cancelarVentaMembresia: async (id) => {
    try {
      await api.patch(`/membership-sales/${id}/cancel`);
    } catch (error) {
      throw new Error(`Failed to cancel membership sale: ${error.message}`);
    }
  },

  actualizarMembresiasExpiradas: async () => {
    try {
      await api.post('/membership-sales/update-expired');
    } catch (error) {
      throw new Error(`Failed to update expired memberships: ${error.message}`);
    }
  },
};