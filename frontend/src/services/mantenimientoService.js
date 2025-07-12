import api from '../api/axios';

export const mantenimientoService = {
  actualizarMembresias: () => api.post('/membership-maintenance/update-statuses'),
};
