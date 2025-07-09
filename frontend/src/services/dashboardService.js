import { ProductoService } from './productoService';
import { VentaService } from './ventaService';
import { PedidoService } from './pedidoService';

export const DashboardService = {
    getProductosStock: async () => {
        const res = await ProductoService.listarProductos();
        return res.data.reduce((total, prod) => total + (prod.stock || 0), 0);
    },

    getVentasMes: async () => {
        const res = await VentaService.listarVentas();
        const now = new Date();
        const mesActual = now.getMonth() + 1;
        const anioActual = now.getFullYear();

        const ventasMes = res.data.filter(venta => {
            if (!venta.date) return false;
            const [anio, mes] = venta.date.split('-').map(Number);
            return mes === mesActual && anio === anioActual;
        });

        const totalMes = ventasMes.reduce((total, venta) => {
            if (!venta.details || !Array.isArray(venta.details)) return total;
            const totalVenta = venta.details.reduce(
                (subtotal, detalle) =>
                    subtotal + (Number(detalle.quantity) * Number(detalle.unitPrice)),
                0
            );
            return total + totalVenta;
        }, 0);

        return totalMes.toFixed(2);
    },

    getPedidosMes: async () => {
        const res = await PedidoService.listarPedidos();
        const now = new Date();
        return res.data.filter(p => {
            const fecha = new Date(p.date);
            return fecha.getMonth() === now.getMonth() && fecha.getFullYear() === now.getFullYear();
        }).length;
    },
};