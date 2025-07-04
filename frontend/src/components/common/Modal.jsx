import React from 'react';
import { Modal as BsModal, Button } from 'react-bootstrap';

const Modal = ({ show, onClose, title, children, onConfirm }) => (
  <BsModal show={show} onHide={onClose}>
    <BsModal.Header closeButton>
      <BsModal.Title>{title}</BsModal.Title>
    </BsModal.Header>
    <BsModal.Body>{children}</BsModal.Body>
    <BsModal.Footer>
      <Button variant="secondary" onClick={onClose}>Cancelar</Button>
      {onConfirm && <Button variant="primary" onClick={onConfirm}>Confirmar</Button>}
    </BsModal.Footer>
  </BsModal>
);

export default Modal;
