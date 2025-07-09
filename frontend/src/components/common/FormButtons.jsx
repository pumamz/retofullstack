const FormButtons = ({ onCancel, loading, disabled }) => {
  return (
    <div className="col-12 d-flex justify-content-end gap-2">
      <button
        type="button"
        className="btn btn-secondary"
        onClick={onCancel}
        disabled={disabled}
      >
        Cancelar
      </button>
      <button
        type="submit"
        className="btn btn-success"
        disabled={disabled}
      >
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </div>
  );
};
export default FormButtons;
