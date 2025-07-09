const Textarea = ({ label, name, value, onChange, rows = 3, required = false, disabled = false }) => (
  <div className="col-12">
    <label className="form-label">{label}</label>
    <textarea
      name={name}
      className="form-control"
      rows={rows}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
    />
  </div>
);

export default Textarea;
