import api from '../api/axios';

export const clienteService = {
  listarClientes: async () => {
    const response = await api.get('/clients');
    return response.data;
  },

  obtenerClientePorId: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  crearCliente: async (client) => {
    const response = await api.post('/clients', client);
    return response.data;
  },

  actualizarCliente: async (id, client) => {
    const response = await api.put(`/clients/${id}`, client);
    return response.data;
  },

  buscarClientes: async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      return await clienteService.listarClientes();
    }
    const response = await api.get('/clients/search', {
      params: { searchTerm: searchTerm.trim() },
    });
    return response.data;
  },

  cambiarEstado: async (id, enabled) => {
    const response = await api.patch(`/clients/${id}/enable`, null, {
      params: { enabled },
    });
    return response.data;
  },

  filtrarClientes: async (filtros = {}) => {
    const { searchTerm, enabled, membershipType, membershipStatus } = filtros;
    
    if (searchTerm && searchTerm.trim() !== '') {
      return await clienteService.buscarClientes(searchTerm);
    }
    
    if (enabled === undefined && !membershipType && !membershipStatus) {
      return await clienteService.listarClientes();
    }
    
    const todosClientes = await clienteService.listarClientes();
    
    return todosClientes.filter(client => {
      let cumpleFiltros = true;
      
      if (enabled !== undefined) {
        cumpleFiltros = cumpleFiltros && client.enabled === enabled;
      }
      
      if (membershipType && membershipType !== '') {
        cumpleFiltros = cumpleFiltros && client.membershipType === membershipType;
      }
      
      if (membershipStatus && membershipStatus !== '') {
        cumpleFiltros = cumpleFiltros && client.membershipStatus === membershipStatus;
      }
      
      return cumpleFiltros;
    });
  },

    listarClientesActivos: async () => {
    const response = await api.get('/clients/enabled');
    return response.data;
  },
};