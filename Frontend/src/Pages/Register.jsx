import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css"

function Register() {
  const navigate = useNavigate();

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      correo,
      nombre_usuario: nombreUsuario,
      password,
      password2,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Registro exitoso:", data);
        // Redirige a la página para insertar el código
        alert("Cuenta creada con exito. Inicia Sesion para continuar")
        navigate("/login");
      } else {
        console.error("❌ Error en el registro:", data);
        alert("Error en el registro. Verifica los datos.");
      }
    } catch (error) {
      console.error("❌ Error en la petición:", error);
      alert("Error del servidor.");
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "80vh" }}
    >
      <Form style={{ width: "500px" }} onSubmit={handleSubmit}>
        <h2 className="mb-3 register-title">Registrarse</h2>

        <Form.Group className="mb-3" controlId="formName">
          <Form.Label className="register-label">Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingresa tu nombre"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label className="register-label">Correo Electronico</Form.Label>
          <Form.Control
            type="email"
            placeholder="Ingresa tu email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label className="register-label">Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Crea una contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword2">
          <Form.Label className="register-label">Confirmar Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirmar contraseña"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mb-3">
          <div className="register-button">
            Registrarse
          </div>
        </Button>

        <div className="text-center register-cuenta">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </div>
      </Form>
    </Container>
  );
}

export default Register;
