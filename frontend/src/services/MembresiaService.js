import api from '../api/axios';

export const MembresiaService = {
  listarMembresias: () => {
    return api.get("/membresias");
  },

  obtenerMembresiaPorId: (id) => {
    return api.get(`/membresias/${id}`);
  },

  crearMembresia: (membresia) => {
    return api.post("/membresias", membresia);
  },

  actualizarMembresia: (id, membresia) => {
    return api.put(`/membresias/${id}`, membresia);
  },

  eliminarMembresia: (id) => {
    return api.delete(`/membresias/${id}`);
  },
};
