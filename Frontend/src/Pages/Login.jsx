import React from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Login() {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "80vh" }}
    >
      <Form style={{ width: "500px" }}>
        <h2 className="mb-3">Iniciar Sesión</h2>
        
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Ingresa tu email" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" placeholder="Contraseña" />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mb-3">
          Entrar
        </Button>

        <div className="text-center">
          ¿No tienes cuenta?{" "}
          <Link to="/register">Regístrate</Link>
        </div>
      </Form>
    </Container>
  );
}

export default Login;
