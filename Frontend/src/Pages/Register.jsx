import React, { useState, useEffect } from "react";
import { Container, Form, Button, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errorMensaje, setErrorMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado para loading

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMensaje("");
    setIsLoading(true);

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
        alert("Cuenta creada con éxito. Inicia sesión para continuar");
        navigate("/login");
      } else {
        const errores = Object.values(data).flat().join(" ");
        setErrorMensaje(errores || "Error en el registro. Verifica los datos.");
      }
    } catch (error) {
      console.log(error)
      setErrorMensaje("Error del servidor. Intenta más tarde.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
  const token = localStorage.getItem("access");
  if (token) {
    navigate("/"); // Redirecciona al home si ya está logueado
  }
}, [navigate]);

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
      <Form className="register-form shadow-lg" style={{ width: "500px" }} onSubmit={handleSubmit}>
        <div className="register-volaya mb-3 text-center">
          <i className="bx bx-paper-plane" style={{ color: "#0d6efd", fontSize: "47px" }}></i>
          <span className="ms-2">VolaYA</span>
        </div>
        <p className="mb-3 register-p text-center">Crea tu cuenta para comenzar la aventura</p>

        <Form.Group className="mb-3" controlId="formName">
          <Form.Label className="register-label">Nombre</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="bx bx-user"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Ingresa tu nombre"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label className="register-label">Correo Electrónico</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="bx bx-envelope"></i>
            </InputGroup.Text>
            <Form.Control
              type="email"
              placeholder="Ingresa tu correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label className="register-label">Contraseña</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="bx bx-lock-alt"></i>
            </InputGroup.Text>
            <Form.Control
              type="password"
              placeholder="Crea una contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword2">
          <Form.Label className="register-label">Confirmar Contraseña</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="bx bx-lock"></i>
            </InputGroup.Text>
            <Form.Control
              type="password"
              placeholder="Confirma tu contraseña"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </InputGroup>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mt-4" disabled={isLoading}>
          <div className="register-button">
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Creando...
              </>
            ) : (
              "Crear Cuenta"
            )}
          </div>
        </Button>

        <div className="text-center register-cuenta mt-3">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </div>

        {errorMensaje && (
          <div className="mt-4 alert alert-danger text-center">{errorMensaje}</div>
        )}
      </Form>
    </Container>
  );
}

export default Register;
