import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { FaUsers, FaDumbbell, FaBox, FaDollarSign, FaTruck, FaUserPlus, FaPlusCircle, FaClipboardList } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/Pastel.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <h2 className="mb-4 pastel-title">Panel de Control - GymSystem</h2>

      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="pastel-card pastel-blue text-center">
            <Card.Body>
              <FaUsers size={30} className="mb-2" />
              <Card.Title>Clientes activos</Card.Title>
              <Card.Text>-</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="pastel-card pastel-green text-center">
            <Card.Body>
              <FaDumbbell size={30} className="mb-2" />
              <Card.Title>Membresías vendidas</Card.Title>
              <Card.Text>-</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="pastel-card pastel-yellow text-center">
            <Card.Body>
              <FaBox size={30} className="mb-2" />
              <Card.Title>Productos en stock</Card.Title>
              <Card.Text>-</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="pastel-card pastel-pink text-center">
            <Card.Body>
              <FaDollarSign size={30} className="mb-2" />
              <Card.Title>Ventas del mes</Card.Title>
              <Card.Text>-</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={2} className="mb-2">
          <Button className="pastel-btn pastel-blue w-100" onClick={() => navigate('clientes/nuevo')}>
            <FaUserPlus className="me-2" /> Nuevo Cliente
          </Button>
        </Col>
        <Col md={2} className="mb-2">
          <Button className="pastel-btn pastel-green w-100" onClick={() => navigate('/productos/crear')}>
            <FaPlusCircle className="me-2" /> Crear Producto
          </Button>
        </Col>
        <Col md={2} className="mb-2">
          <Button className="pastel-btn pastel-yellow w-100" onClick={() => navigate('/productos/ventas/vender')}>
            <FaDollarSign className="me-2" /> Vender Producto
          </Button>
        </Col>
        <Col md={2} className="mb-2">
          <Button className="pastel-btn pastel-pink w-100" onClick={() => navigate('/productos/pedidos/pedir')}>
            <FaTruck className="me-2" /> Pedir Producto
          </Button>
        </Col>
        <Col md={2} className="mb-2">
          <Button className="pastel-btn pastel-gray w-100" onClick={() => navigate('/membresias/ventas/vender')}>
            <FaDumbbell className="me-2" /> Vender Membresía
          </Button>
        </Col>
        <Col md={2} className="mb-2">
          <Button className="pastel-btn pastel-cyan w-100" onClick={() => navigate('/membresias/clases/crear')}>
            <FaClipboardList className="me-2" /> Crear Clase
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
