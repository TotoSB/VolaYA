import React, { useState } from "react";
import { Container, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado de carga
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

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

      if (
        data.message?.includes("código de verificación") &&
        data.usuario_id
      ) {
        localStorage.setItem("usuario_id", data.usuario_id);
        navigate("/codigo");
        return;
      }

      if (!response.ok) {
        setError(data.message || "Credenciales inválidas");
        return;
      }

      if (data.access) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("usuario_id", data.usuario_id);

        const userRes = await fetch("http://127.0.0.1:8000/conseguir_mi_usuario/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.access}`,
          },
        });

        const userData = await userRes.json();
        console.log("Datos del usuario:", userData);

        if (userData.is_staff) {
          navigate("/Staff");
        } else {
          navigate("/");
        }
      }

    } catch (err) {
      console.error(err);
      setError("Error al conectar con el servidor");
    } finally {
      setIsLoading(false); // Siempre desactivar el loading
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
      <Form className="login-form shadow-lg" style={{ width: "500px" }} onSubmit={handleLogin}>
        <div className="login-volaya mb-3 text-center">
          <i className="bx bx-paper-plane" style={{ color: "#0d6efd", fontSize: "47px" }}></i>
          <span className="ms-2">VolaYA</span>
        </div>
        <p className="mb-3 login-p">Inicia sesión para continuar tu aventura</p>

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label className="login-label">Correo Electrónico</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="bx bx-envelope"></i>
            </InputGroup.Text>
            <Form.Control
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label className="login-label">Contraseña</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="bx bx-lock-alt"></i>
            </InputGroup.Text>
            <Form.Control
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mt-4" disabled={isLoading}>
          <div className="login-button">
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Ingresando...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </div>
        </Button>

        <div className="text-center login-cuenta mt-3">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </div>

        {error && <Alert className="mt-4" variant="danger">{error}</Alert>}
      </Form>
    </Container>
  );
}

export default Login;
