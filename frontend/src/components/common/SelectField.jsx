const SelectField = ({ label, name, value, onChange, disabled, options, required }) => (
  <div>
    <label className="form-label">{label}</label>
    <select
      className="form-select"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
    >
      <option value="">Seleccione...</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
export default SelectField;