import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function InsertarCodigo() {
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usuarioId = localStorage.getItem("usuario_id");

    if (!usuarioId) {
      setError("No se encontró el ID de usuario. Intenta iniciar sesión nuevamente.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/log_code/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_usuario: parseInt(usuarioId),
          codigo_activacion: codigo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Código inválido o expirado.");
        return;
      }

      // ✅ Guardar token y eliminar usuario_id
      if (data.access) {
        localStorage.setItem("access", data.access);
        localStorage.removeItem("usuario_id");
        navigate("/"); // Redirigir a inicio o dashboard
      } else {
        setError("No se recibió el token de acceso.");
      }

    } catch (err) {
      console.error("Error al verificar el código:", err);
      setError("Error al conectar con el servidor.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
      <Form onSubmit={handleSubmit} style={{ width: "400px" }}>
        <h2 className="mb-4">Verificar Código</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form.Group controlId="codigo">
          <Form.Label>Ingresa el código enviado a tu correo</Form.Label>
          <Form.Control
            type="text"
            placeholder="Código"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3 w-100">
          Verificar
        </Button>
      </Form>
    </Container>
  );
}

export default InsertarCodigo;
