import api from '../api/axios';

export const ClasePersonalizadaService = {
  listarClasesPersonalizadas: () => {
    return api.get("/clases");
  },

  obtenerClasePersonalizadaPorId: (id) => {
    return api.get(`/clases/${id}`);
  },

  crearClasePersonalizada: (clasePersonalizada) => {
    return api.post("/clases", clasePersonalizada);
  },

  actualizarClasePersonalizada: (id, clasePersonalizada) => {
    return api.put(`/clases/${id}`, clasePersonalizada);
  },

  eliminarClasePersonalizada: (id) => {
    return api.delete(`/clases/${id}`);
  },

  obtenerClientes: () => {
    return api.get("/clients");
  },
};
