import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css"

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://127.0.0.1:8000/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correo, password }),
    });

    const data = await response.json();
    console.log("Respuesta del login:", data);

    // ✅ Verificamos si es el mensaje de código, incluso si la respuesta fue 403
    if (
      data.message?.includes("código de verificación") &&
      data.usuario_id
    ) {
      localStorage.setItem("usuario_id", data.usuario_id);
      navigate("/codigo");
      return;
    }

    // ❌ Si no fue el mensaje esperado y la respuesta no fue exitosa
    if (!response.ok) {
      setError(data.message || "Credenciales inválidas");
      return;
    }

    // ✅ Si es login normal con token
    if (data.access) {
      localStorage.setItem("access", data.access);
      window.location.href = "/";
    }

  } catch (err) {
    console.error(err);
    setError("Error al conectar con el servidor");
  }
};



  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
      <Form style={{ width: "500px" }} onSubmit={handleLogin}>
        <h2 className="mb-3 login-title">Iniciar Sesión</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label className="login-label">Correo Electronico</Form.Label>
          <Form.Control
            type="email"
            placeholder="Ingresa tu correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label className="login-label">Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mb-3">
          <div className="login-button">
            Entrar
          </div>
        </Button>

        <div className="text-center login-cuenta">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </div>
      </Form>
    </Container>
  );
}

export default Login;
