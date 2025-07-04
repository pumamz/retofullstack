import axios from 'axios';

const API_URL = 'http://localhost:8080/api/pedidos';

export const PedidoService = {
    obtenerDatosPedido: async () => {
        return await axios.get(`${API_URL}/data`);
    },

    registrarPedido: async (pedido) => {
        return await axios.post(API_URL, pedido);
    },

    listarPedidos: async () => {
        return await axios.get(API_URL);
    }
};