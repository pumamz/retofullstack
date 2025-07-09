const TextareaField = ({ label, name, value, onChange, disabled, rows = 3, required }) => (
  <div>
    <label className="form-label">{label}</label>
    <textarea
      className="form-control"
      name={name}
      rows={rows}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
    />
  </div>
);
export default TextareaField;