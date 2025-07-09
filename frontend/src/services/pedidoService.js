
import axios from '../api/axios';

export const PedidoService = {
    obtenerDatosPedido: () => {
        return axios.get('/pedidos/data');
    },

    crearPedido: (pedido) => {
        return axios.post('/pedidos', {
            ...pedido,
            status: 'PENDIENTE',
            totalAmount: pedido.details.reduce(
                (total, detail) => total + (detail.quantity * detail.unitPrice), 0
            )
        });
    },

    listarPedidos: () => {
        return axios.get('/pedidos');
    },

    obtenerPedidoPorNumero: (numeroPedido) => {
        return axios.get(`/pedidos/${numeroPedido}`);
    },

    actualizarEstadoPedido: (pedidoId, estado) => {
        return axios.put(`/pedidos/${pedidoId}/status?status=${estado}`);
    },

    recibirPedido: (orderId, cantidades) => {
        return axios.put(`/pedidos/${orderId}/receive`, cantidades);
    }
};