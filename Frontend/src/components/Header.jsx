import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import VerifyToken from "./VerifyToken";
import { useAuth } from "../context/AuthContext";

function Header() {
  const [expanded, setExpanded] = useState(false);
  const { isAuthenticated, setIsAuthenticated, setUserData, userData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    setIsAuthenticated(false);
    setUserData(null);
    navigate("/");
  };

  return (
    <>
      <VerifyToken />
      <Navbar
        expand="lg"
        expanded={expanded}
        className="navbar-custom"
        collapseOnSelect
      >
        <Container>
          <Navbar.Brand as={Link} to="/" onClick={() => setExpanded(false)}>
            <i
              className="bx bx-paper-plane"
              style={{ color: "#0d6efd", fontSize: "30px" }}
            ></i>
            VolaYA
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded((prev) => !prev)}
          />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
                Inicio
              </Nav.Link>
              <Nav.Link as={Link} to="/paquetes" onClick={() => setExpanded(false)}>
                Paquetes
              </Nav.Link>

              {!isAuthenticated ? (
                <>
                  <Nav.Link
                    as={Link}
                    to="/login"
                    onClick={() => setExpanded(false)}
                  >
                    Iniciar sesión
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/register"
                    onClick={() => setExpanded(false)}
                  >
                    Registrarse
                  </Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link
                    as={Link}
                    to="/perfil"
                    onClick={() => setExpanded(false)}
                  >
                    {userData?.username || "Usuario"}
                  </Nav.Link>
                  <Nav.Link
                    className="logout-link"
                    onClick={() => {
                      handleLogout();
                      setExpanded(false);
                    }}
                  >
                    Cerrar sesión
                  </Nav.Link>
                </>
              )}

              <Nav.Link as={Link} to="/carrito" onClick={() => setExpanded(false)}>
                Carrito
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
