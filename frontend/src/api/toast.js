import { toast } from "react-toastify";

// Conjunto para rastrear errores ya mostrados
const erroresMostrados = new Set();

export const mostrarError = (error, mensajeAlternativo = "Ocurrió un error") => {
  const mensaje =
    error?.response?.data && typeof error.response.data === "string"
      ? error.response.data
      : error?.response?.data?.message || mensajeAlternativo;

  if (!erroresMostrados.has(mensaje)) {
    toast.error(mensaje);
    erroresMostrados.add(mensaje);
    setTimeout(() => erroresMostrados.delete(mensaje), 5000); // evita duplicados por 5 segundos
  }
};
