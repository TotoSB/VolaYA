import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import '../../../styles/Staff/Cars/Create.css';

const CreateCars = () => {
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [color, setColor] = useState('');
  const [precioDia, setPrecioDia] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('access');

    const response = await fetch('http://127.0.0.1:8000/crear_auto/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        marca,
        modelo,
        color,
        precio_dia: precioDia,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Auto creado correctamente');
      setMarca('');
      setModelo('');
      setColor('');
      setPrecioDia('');
    } else {
      alert('Error: ' + JSON.stringify(data));
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: '80vh' }}
    >
      <Form style={{ width: '100%', maxWidth: '500px' }} onSubmit={handleSubmit}>
        <h2 className="mb-3 create-title">Crear Auto</h2>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="create-label">Marca</Form.Label>
              <Form.Control
                type="text"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="create-label">Modelo</Form.Label>
              <Form.Control
                type="text"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="create-label">Color</Form.Label>
              <Form.Control
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="create-label">Precio por día</Form.Label>
              <Form.Control
                type="number"
                value={precioDia}
                onChange={(e) => setPrecioDia(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit" className="w-100 mb-2">
          <div className="create-button">Crear Auto</div>
        </Button>
      </Form>
    </Container>
  );
};

export default CreateCars;
