import React from 'react';

const Card = ({ children, title }) => (
  <div className="card shadow-sm mb-4">
    {title && <div className="card-header pastel-bg fw-bold">{title}</div>}
    <div className="card-body">{children}</div>
  </div>
);

export default Card;
