const FormTitle = ({ id, title }) => (
  <h2>{id ? `Editar ${title}` : `Nuevo ${title}`}</h2>
);

export default FormTitle;