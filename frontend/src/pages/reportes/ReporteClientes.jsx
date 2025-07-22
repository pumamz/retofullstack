import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { reporteService } from '../../services/reporteService';
import { PDFGenerator } from '../../utils/pdfGenerator';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';

const ReporteClientes = () => {
  const [loading, setLoading] = useState(false);
  const [datos, setDatos] = useState([]);
  const [filtros, setFiltros] = useState({ estado: '' });

  const columnas = [
    { key: 'dni', label: 'DNI', sortable: true },
    { key: 'firstName', label: 'Nombre', sortable: true },
    { key: 'lastName', label: 'Apellido', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Teléfono', sortable: true },
    { key: 'age', label: 'Edad', sortable: true },
    { key: 'height', label: 'Altura', sortable: true },
    { key: 'weight', label: 'Peso', sortable: true },
    { key: 'enabled', label: 'Estado', render: c => c.enabled ? 'Activo' : 'Inactivo', sortable: true },
    { key: 'membershipType', label: 'Membresía', sortable: true },
    { key: 'membershipStatus', label: 'Estado Membresía', sortable: true },
    { key: 'remainingDays', label: 'Días restantes', sortable: true },
  ];

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      let data;
      if (filtros.estado !== '') {
        data = await reporteService.obtenerClientesPorEstado(filtros.estado === 'true');
      } else {
        data = await reporteService.obtenerReporteClientes();
      }
      setDatos(data);
    } catch (error) {
      toast.error('Error al cargar datos de clientes');
    } finally {
      setLoading(false);
    }
  }, [filtros.estado]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const aplicarFiltros = () => {
    cargarDatos();
  };

  const limpiarFiltros = () => {
    setFiltros({ estado: '' });
    setTimeout(cargarDatos, 100);
  };

  const exportarPDF = () => {
    const doc = PDFGenerator.generarReporteClientes(datos, filtros);
    PDFGenerator.descargar(doc, 'reporte_clientes');
    toast.success('Reporte PDF generado exitosamente');
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const activos = datos.filter(c => c.enabled);
  const conMembresia = datos.filter(c => c.membershipType && c.membershipStatus === 'Active');

  const estadisticas = {
    total: datos.length,
    activos: activos.length,
    conMembresia: conMembresia.length
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12">
          <h3>Reporte de Clientes</h3>
        </div>
      </div>
      <Card className="mb-4">
        <h5 className="mb-3">Filtros</h5>
        <div className="row g-3">
          <div className="col-md-3">
            <select className="form-select" name="estado" value={filtros.estado} onChange={handleFiltroChange}>
              <option value="">Todos</option>
              <option value="true">Activos</option>
              <option value="false">Inactivos</option>
            </select>
          </div>
          <div className="col-md-9 d-flex align-items-end">
            <Button variant="primary" onClick={aplicarFiltros} className="me-2">Aplicar Filtros</Button>
            <Button variant="secondary" onClick={limpiarFiltros}>Limpiar</Button>
          </div>
        </div>
      </Card>
      <div className="row mb-4">
        <div className="col-md-4">
          <Card>
            <div className="text-center">
              <h6 className="text-primary">Total Clientes</h6>
              <h4>{estadisticas.total}</h4>
            </div>
          </Card>
        </div>
        <div className="col-md-4">
          <Card>
            <div className="text-center">
              <h6 className="text-success">Activos</h6>
              <h4>{estadisticas.activos}</h4>
            </div>
          </Card>
        </div>
        <div className="col-md-4">
          <Card>
            <div className="text-center">
              <h6 className="text-info">Con Membresía Activa</h6>
              <h4>{estadisticas.conMembresia}</h4>
            </div>
          </Card>
        </div>
      </div>
      <DataTable
        data={datos}
        columns={columnas}
        title="Lista de Clientes"
        onExportPDF={exportarPDF}
        itemsPerPage={15}
      />
    </div>
  );
};

export default ReporteClientes;
