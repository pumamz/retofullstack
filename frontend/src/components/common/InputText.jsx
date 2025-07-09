const InputText = ({ label, name, value, onChange, disabled, type = "text", required }) => (
  <div>
    <label className="form-label">{label}</label>
    <input
      type={type}
      className="form-control"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
    />
  </div>
);
export default InputText;