import api from '../api/axios';

export const pedidoService = {
    crearPedido: async (pedido) => {
        const response = await api.post('/pedidos', {
            ...pedido,
            status: 'Pending',
            totalAmount: pedido.details.reduce(
                (total, detail) => total + (detail.quantity * detail.unitPrice),
                0
            ),
        });
        return response.data;
    },

    listarPedidos: async () => {
        const response = await api.get('/pedidos');
        return response.data;
    },

    actualizarEstadoPedido: async (pedidoId, estado) => {
        const response = await api.put(`/pedidos/${pedidoId}/status`, null, {
            params: { status: estado },
        });
        return response.data;
    },

    recibirPedido: async (orderId, cantidades) => {
        const response = await api.put(`/pedidos/${orderId}/receive`, cantidades);
        return response.data;
    },
};