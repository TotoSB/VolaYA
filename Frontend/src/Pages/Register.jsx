import React from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Register() {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "80vh" }}
    >
      <Form style={{ width: "500px" }}>
        <h2 className="mb-3">Registrarse</h2>

        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" placeholder="Ingresa tu nombre" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Ingresa tu email" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" placeholder="Crea una contraseña" />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mb-3">
          Registrarse
        </Button>

        <div className="text-center">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login">Inicia sesión</Link>
        </div>
      </Form>
    </Container>
  );
}

export default Register;
