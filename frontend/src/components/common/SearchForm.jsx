import { Form, Button, InputGroup } from 'react-bootstrap';

const SearchForm = ({ fields, values, onChange, onSubmit, onClear, loading }) => (
  <Form onSubmit={onSubmit} className="mb-4">
    <div className="row">
      {fields.map(({ name, placeholder }) => (
        <div className="col-md-4" key={name}>
          <InputGroup>
            <Form.Control
              name={name}
              placeholder={placeholder}
              value={values[name]}
              onChange={(e) => onChange(e)}
              disabled={loading}
            />
          </InputGroup>
        </div>
      ))}
      <div className="col-md-4">
        <Button type="submit" variant="primary" className="me-2" disabled={loading}>
          Buscar
        </Button>
        <Button variant="secondary" onClick={onClear} disabled={loading}>
          Limpiar
        </Button>
      </div>
    </div>
  </Form>
);

export default SearchForm;
