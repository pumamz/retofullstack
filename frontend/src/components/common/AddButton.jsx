import { Link } from 'react-router-dom';

const AddButton = ({ to, label = 'Nuevo' }) => (
  <Link to={to} className="btn btn-success mb-3">
    {label}
  </Link>
);

export default AddButton;
