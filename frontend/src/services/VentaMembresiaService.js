import api from '../api/axios';

export const VentaMembresiaService = {
  listarVentasMembresias: () => {
    return api.get("/ventas-membresia");
  },

  obtenerVentaMembresiaPorId: (id) => {
    return api.get(`/ventas-membresia/${id}`);
  },

  crearVentaMembresia: (ventaMembresia) => {
    return api.post("/ventas-membresia", ventaMembresia);
  },

  eliminarVentaMembresia: (id) => {
    return api.delete(`/ventas-membresia/${id}`);
  },
  
};
