import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const PDFGenerator = {
  // =========================
  // CONFIGURACIÓN GENERAL
  // =========================
  configurarDocumento: (doc, titulo) => {
    // Configurar fuente
    doc.setFont("helvetica");

    // Título del documento
    doc.setFontSize(18);
    doc.setTextColor(44, 62, 80);
    doc.text(titulo, 20, 30);

    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Información de la empresa
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Gimnasio - Sistema de Gestión", 20, 45);
    doc.text(
      `Fecha de generación: ${new Date().toLocaleDateString("es-ES")}`,
      20,
      50
    );

    return 60; // Retorna la posición Y donde empezar el contenido
  },

  // =========================
  // REPORTE DE MEMBRESÍAS
  // =========================
  generarReporteMembresias: (datos, filtros = {}) => {
    const doc = new jsPDF();

    // Configurar documento base
    const startY = PDFGenerator.configurarDocumento(
      doc,
      "Reporte de Membresías"
    );

    let yPosition = startY;

    // Agregar información del filtro de fechas si existe
    if (filtros.fechaInicio || filtros.fechaFin) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(90, 90, 90);
      doc.text(
        `Período: ${filtros.fechaInicio || "Desde el inicio"} - ${
          filtros.fechaFin || "Hasta la fecha"
        }`,
        20,
        yPosition
      );
      yPosition += 10;
    }

    // Columnas
    const columnas = [
      "ID",
      "Membresía",
      "Fecha Venta",
      "Precio",
      "Inicio",
      "Fin",
      "Cliente",
      "Método de Pago",
      "Estado",
    ];

    // Filas con datos formateados
    const filas = datos.map((m) => [
      m.id?.toString() || "",
      m.membership?.name || "N/A",
      m.saleDate || "",
      `$${(m.totalAmount || 0).toFixed(2)}`,
      m.startDate || "",
      m.endDate || "",
      `${m.client?.firstName || ""} ${m.client?.lastName || ""}`.trim(),
      m.paymentMethod || "N/A",
      m.status === "Active" ? "Activo" : m.status || "N/A",
    ]);

    // Calcular ingresos y membresías activas (por fecha)
    const totalIngresos = datos.reduce(
      (acc, m) => acc + (m.totalAmount || 0),
      0
    );

    const hoy = new Date();
    const membresiasActivas = datos.filter((m) => {
      const inicio = new Date(m.startDate);
      const fin = new Date(m.endDate);
      return inicio <= hoy && hoy <= fin;
    }).length;

    // Tabla de membresías
    autoTable(doc, {
      startY: yPosition + 5,
      head: [columnas],
      body: filas,
      theme: "striped",
      headStyles: {
        fillColor: [33, 47, 61], // azul oscuro
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      styles: {
        font: "helvetica",
        fontSize: 8,
        textColor: [50, 50, 50],
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    // Separación clara entre tabla y resumen
    const tableFinalY = doc.previousAutoTable?.finalY || yPosition + 30;
    const resumenStartY = tableFinalY + 20;

    // Título del resumen
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(33, 47, 61); // azul oscuro
    doc.text("Resumen general:", 20, resumenStartY);

    // Contenido del resumen
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(44, 62, 80); // gris oscuro
    doc.text(`Total de membresías: ${datos.length}`, 20, resumenStartY + 10);
    doc.text(
      `Membresías activas: ${membresiasActivas}`,
      20,
      resumenStartY + 20
    );
    doc.text(
      `Ingresos totales: $${totalIngresos.toFixed(2)}`,
      20,
      resumenStartY + 30
    );

    return doc;
  },

  // =========================
  // REPORTE DE CLASES PERSONALIZADAS
  // =========================
  generarReporteClasesPersonalizadas: (datos, filtros = {}) => {
    const doc = new jsPDF();
    const startY = PDFGenerator.configurarDocumento(
      doc,
      "Reporte de Clases Personalizadas"
    );

    let yPosition = startY;

    // Filtros
    if (filtros.fechaInicio || filtros.fechaFin) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(90, 90, 90);
      doc.text(
        `Período: ${filtros.fechaInicio || "Desde el inicio"} - ${
          filtros.fechaFin || "Hasta la fecha"
        }`,
        20,
        yPosition
      );
      yPosition += 10;
    }

    // Columnas
    const columnas = [
      "ID",
      "Clase",
      "Cliente",
      "Fecha",
      "Hora",
      "Precio",
      "Estado",
      "Método Pago",
    ];

    // Traducción de estados
    const traducirEstado = (estado) => {
      switch (estado) {
        case "Completed":
          return "Completada";
        case "Scheduled":
          return "Programada";
        case "Cancelled":
          return "Cancelada";
        default:
          return estado || "N/A";
      }
    };

    // Filas
    const filas = datos.map((clase) => [
      clase.id?.toString() || "",
      clase.className || "",
      `${clase.client?.firstName || ""} ${clase.client?.lastName || ""}`.trim(),
      clase.date || "",
      clase.time || "",
      `$${(clase.price || 0).toFixed(2)}`,
      traducirEstado(clase.status),
      clase.paymentMethod || "",
    ]);

    // Cálculos
    const totalIngresos = datos.reduce(
      (sum, item) => sum + (item.price || 0),
      0
    );
    const clasesCompletadas = datos.filter(
      (item) => item.status === "Completed"
    ).length;
    const clasesProgramadas = datos.filter(
      (item) => item.status === "Scheduled"
    ).length;

    // Tabla
    autoTable(doc, {
      startY: yPosition + 5,
      head: [columnas],
      body: filas,
      theme: "striped",
      headStyles: {
        fillColor: [33, 47, 61],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      styles: {
        font: "helvetica",
        fontSize: 8,
        textColor: [50, 50, 50],
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    // Resumen
    const resumenY = (doc.previousAutoTable?.finalY || yPosition) + 50;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(33, 47, 61);
    doc.text("Resumen general:", 20, resumenY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(44, 62, 80);
    doc.text(`Total de clases: ${datos.length}`, 20, resumenY + 10);
    doc.text(`Clases completadas: ${clasesCompletadas}`, 20, resumenY + 20);
    doc.text(`Clases programadas: ${clasesProgramadas}`, 20, resumenY + 30);
    doc.text(
      `Ingresos totales: $${totalIngresos.toFixed(2)}`,
      20,
      resumenY + 40
    );

    return doc;
  },

  // =========================
  // REPORTE DE VENTAS DE PRODUCTOS
  // =========================
  generarReporteVentasProductos: (datos, filtros = {}) => {
    const doc = new jsPDF();
    const startY = PDFGenerator.configurarDocumento(
      doc,
      "Reporte de Ventas de Productos"
    );

    let yPosition = startY;

    if (filtros.fechaInicio || filtros.fechaFin) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(90, 90, 90);
      doc.text(
        `Período: ${filtros.fechaInicio || "Desde el inicio"} - ${
          filtros.fechaFin || "Hasta la fecha"
        }`,
        20,
        yPosition
      );
      yPosition += 10;
    }

    const columnas = ["Factura", "Cliente", "Fecha", "Total", "Estado"];
    const filas = datos.map((venta) => [
      venta.invoiceNumber || "",
      `${venta.client?.firstName || ""} ${venta.client?.lastName || ""}`,
      venta.dateTime || "",
      `$${(venta.totalAmount || 0).toFixed(2)}`,
      venta.cancelled ? "Cancelada" : "Completada",
    ]);

    const totalVentas = datos
      .filter((v) => !v.cancelled)
      .reduce((sum, item) => sum + (item.totalAmount || 0), 0);
    const ventasCanceladas = datos.filter((v) => v.cancelled).length;

    autoTable(doc, {
      startY: yPosition + 5,
      head: [columnas],
      body: filas,
      theme: "striped",
      headStyles: {
        fillColor: [33, 47, 61],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      styles: {
        font: "helvetica",
        fontSize: 8,
        textColor: [50, 50, 50],
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    const resumenY = (doc.previousAutoTable?.finalY || yPosition) + 50;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(33, 47, 61);
    doc.text("Resumen general:", 20, resumenY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(44, 62, 80);
    doc.text(`Total de ventas: ${datos.length}`, 20, resumenY + 10);
    doc.text(`Ventas canceladas: ${ventasCanceladas}`, 20, resumenY + 20);
    doc.text(`Ingresos totales: $${totalVentas.toFixed(2)}`, 20, resumenY + 30);

    return doc;
  },

  // =========================
  // REPORTE DE CLIENTES
  // =========================
  generarReporteClientes: (datos, filtros = {}) => {
    const doc = new jsPDF();
    const startY = PDFGenerator.configurarDocumento(doc, "Reporte de Clientes");

    let yPosition = startY;
    if (filtros.estado) {
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(
        `Estado: ${filtros.estado === "true" ? "Activos" : "Inactivos"}`,
        20,
        yPosition
      );
      yPosition += 10;
    }

    const columnas = [
      "DNI",
      "Nombre",
      "Apellido",
      "Email",
      "Teléfono",
      "Edad",
      "Altura",
      "Peso",
      "Estado",
      "Membresía",
      "Estado Membresía",
      "Días restantes",
    ];

    const filas = datos.map((cliente) => [
      cliente.dni || "",
      cliente.firstName || "",
      cliente.lastName || "",
      cliente.email || "",
      cliente.phone || "",
      cliente.age || "",
      cliente.height || "",
      cliente.weight || "",
      cliente.enabled ? "Activo" : "Inactivo",
      cliente.membershipType || "Sin membresía",
      cliente.membershipStatus || "N/A",
      cliente.remainingDays || "",
    ]);

    const clientesActivos = datos.filter((c) => c.enabled).length;
    const clientesConMembresia = datos.filter(
      (c) => c.membershipType && c.membershipStatus === "Active"
    ).length;

    autoTable(doc, {
      startY: yPosition + 5,
      head: [columnas],
      body: filas,
      theme: "striped",
      headStyles: { fillColor: [52, 73, 94], textColor: [255, 255, 255] },
      styles: { fontSize: 8, cellPadding: 3 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Agregar resumen más abajo de la tabla
    const finalY = doc.previousAutoTable
      ? doc.previousAutoTable.finalY + 50 // más espacio
      : yPosition + 50;
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text("Resumen:", 20, finalY);

    doc.setFontSize(10);
    doc.text(`Total de clientes: ${datos.length}`, 20, finalY + 10);
    doc.text(`Clientes activos: ${clientesActivos}`, 20, finalY + 20);
    doc.text(
      `Clientes con membresía activa: ${clientesConMembresia}`,
      20,
      finalY + 30
    );

    return doc;
  },

  // =========================
  // REPORTE DE PRODUCTOS
  // =========================
  generarReporteProductos: (datos, filtros = {}) => {
    const doc = new jsPDF();
    const startY = PDFGenerator.configurarDocumento(
      doc,
      "Reporte de Productos"
    );

    let yPosition = startY;
    if (filtros.stockBajo) {
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text("Productos con stock bajo", 20, yPosition);
      yPosition += 10;
    }

    const columnas = [
      "ID",
      "Código",
      "Nombre",
      "Descripción",
      "Precio Compra",
      "Precio Venta",
      "Stock",
      "Stock Mínimo",
      "Estado",
    ];

    const filas = datos.map((producto) => [
      producto.id?.toString() || "",
      producto.barcode || "",
      producto.name || "",
      producto.description || "",
      `$${producto.priceBuy?.toFixed(2)}`,
      `$${producto.priceSale?.toFixed(2)}`,
      producto.stock?.toString() || "0",
      producto.minimumStock?.toString() || "0",
      producto.active ? "Activo" : "Inactivo",
    ]);

    const productosActivos = datos.filter((p) => p.active).length;
    const productosStockBajo = datos.filter((p) => (p.stock || 0) < 5).length;
    const valorTotalInventario = datos.reduce(
      (sum, p) => sum + (p.stock || 0) * (p.pricePurchase || 0),
      0
    );

    autoTable(doc, {
      startY: yPosition + 5,
      head: [columnas],
      body: filas,
      theme: "striped",
      headStyles: { fillColor: [52, 73, 94], textColor: [255, 255, 255] },
      styles: { fontSize: 8, cellPadding: 3 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Agregar resumen
    const finalY = doc.previousAutoTable
      ? doc.previousAutoTable.finalY + 60
      : yPosition + 60;
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text("Resumen:", 20, finalY);

    doc.setFontSize(10);
    doc.text(`Total de productos: ${datos.length}`, 20, finalY + 10);
    doc.text(`Productos activos: ${productosActivos}`, 20, finalY + 20);
    doc.text(
      `Productos con stock bajo: ${productosStockBajo}`,
      20,
      finalY + 30
    );
    doc.text(
      `Valor total del inventario: $${valorTotalInventario.toFixed(2)}`,
      20,
      finalY + 40
    );

    return doc;
  },

  // =========================
  // REPORTE DE PEDIDOS
  // =========================
  generarReportePedidos: (datos) => {
    const doc = new jsPDF();
    const startY = PDFGenerator.configurarDocumento(doc, "Reporte de Pedidos");
    let yPosition = startY;

    // Columnas igual que en ListaPedidos
    const columnas = [
      "Nº Pedido",
      "Fecha",
      "Proveedor",
      "Total",
      "Estado"
    ];

    // Filas igual que en ListaPedidos
    const filas = datos.map((pedido) => [
      pedido.orderNumber || "",
      pedido.dateTime || pedido.orderDate || "",
      (pedido.supplier?.firstName || pedido.supplier?.companyName || ""),
      `$${(pedido.totalAmount || 0).toFixed(2)}`,
      pedido.status === "PENDING" ? "Pendiente" : pedido.status === "RECEIVED" ? "Recibido" : pedido.status === "CANCELED" ? "Cancelado" : pedido.status || "",
    ]);

    const pedidosPendientes = datos.filter(
      (p) => p.status === "PENDING"
    ).length;
    const pedidosRecibidos = datos.filter(
      (p) => p.status === "RECEIVED"
    ).length;
    const pedidosCancelados = datos.filter(
      (p) => p.status === "CANCELED"
    ).length;
    const totalPedidos = datos.reduce(
      (sum, p) => sum + (p.totalAmount || 0),
      0
    );

    autoTable(doc, {
      startY: yPosition + 5,
      head: [columnas],
      body: filas,
      theme: "striped",
      headStyles: { fillColor: [52, 73, 94], textColor: [255, 255, 255] },
      styles: { fontSize: 8, cellPadding: 3 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Agregar resumen más abajo de la tabla
    const finalY = doc.previousAutoTable
      ? doc.previousAutoTable.finalY + 50
      : yPosition + 50;
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text("Resumen:", 20, finalY);

    doc.setFontSize(10);
    doc.text(`Total de pedidos: ${datos.length}`, 20, finalY + 10);
    doc.text(`Pedidos pendientes: ${pedidosPendientes}`, 20, finalY + 20);
    doc.text(`Pedidos recibidos: ${pedidosRecibidos}`, 20, finalY + 30);
    doc.text(`Pedidos cancelados: ${pedidosCancelados}`, 20, finalY + 40);
    doc.text(`Valor total: $${totalPedidos.toFixed(2)}`, 20, finalY + 50);

    return doc;
  },

  // =========================
  // DESCARGAR PDF
  // =========================
  descargar: (doc, nombreArchivo) => {
    const fecha = new Date().toISOString().split("T")[0];
    doc.save(`${nombreArchivo}_${fecha}.pdf`);
  },

  // =========================
  // REPORTE DE PROVEEDORES
  // =========================
  generarReporteProveedores: (datos, filtros = {}) => {
    const doc = new jsPDF();
    const startY = PDFGenerator.configurarDocumento(
      doc,
      "Reporte de Proveedores"
    );

    // Agregar filtros aplicados si existen
    let yPosition = startY;
    if (filtros.estado) {
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(
        `Estado: ${filtros.estado === "true" ? "Activos" : "Inactivos"}`,
        20,
        yPosition
      );
      yPosition += 10;
    }

    // Columnas igual que en ListaProveedores
    const columnas = [
      "DNI",
      "Nombre",
      "Apellido",
      "Empresa",
      "RUC",
      "Email",
      "Teléfono",
      "Estado"
    ];
    // Filas igual que en ListaProveedores
    const filas = datos.map((prov) => [
      prov.dni || "",
      prov.firstName || "",
      prov.lastName || "",
      prov.company || "",
      prov.ruc || "",
      prov.email || "",
      prov.phone || "",
      prov.enabled ? "Activo" : "Inactivo",
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [columnas],
      body: filas,
      theme: "striped",
      headStyles: { fillColor: [52, 73, 94], textColor: [255, 255, 255] },
      styles: { fontSize: 8, cellPadding: 3 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Estadísticas igual que en la lista
    const activos = datos.filter((p) => p.enabled).length;
    const inactivos = datos.filter((p) => !p.enabled).length;

    // Más espacio entre tabla y resumen
    const finalY = doc.previousAutoTable
      ? doc.previousAutoTable.finalY + 50
      : yPosition + 50;
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.text("Resumen:", 20, finalY);

    doc.setFontSize(10);
    doc.text(`Total de proveedores: ${datos.length}`, 20, finalY + 10);
    doc.text(`Activos: ${activos}`, 20, finalY + 20);
    doc.text(`Inactivos: ${inactivos}`, 20, finalY + 30);

    return doc;
  },
};
