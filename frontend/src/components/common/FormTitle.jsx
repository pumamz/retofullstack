const FormTitle = ({ id, title }) => (
  <h2>{id ? `Editar ${title}` : `Crear ${title}`}</h2>
);

export default FormTitle;