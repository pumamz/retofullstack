import React from 'react';

const Input = ({ label, type = 'text', name, value, onChange, placeholder, required }) => (
  <div className="mb-3">
    <label htmlFor={name} className="form-label">{label}</label>
    <input
      type={type}
      className="form-control"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
    />
  </div>
);

export default Input;
