const InputNumber = ({ label, name, value, onChange, disabled, step = "1", required }) => (
  <div>
    <label className="form-label">{label}</label>
    <input
      type="number"
      className="form-control"
      name={name}
      value={value}
      onChange={onChange}
      step={step}
      required={required}
      disabled={disabled}
    />
  </div>
);
export default InputNumber;