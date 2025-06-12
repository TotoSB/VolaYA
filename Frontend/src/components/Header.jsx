import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/Header.css"; // Asegurate que esta ruta sea correcta

function Header() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      className="navbar-custom"
      collapseOnSelect
    >
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={() => setExpanded(false)}>
          <i className="bx bx-paper-plane" style={{ color: "#0d6efd", fontSize:"30px" }}></i>
          VolaYA
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded((prev) => !prev)}
        />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {[
              { to: "/", label: "Inicio" },
              { to: "/paquetes", label: "Paquetes" },
              { to: "/login", label: "Iniciar sesión" },
              { to: "/register", label: "Registrarse" },
              { to: "/carrito", label: "Carrito" },
            ].map(({ to, label }) => (
              <Nav.Link
                as={Link}
                to={to}
                key={to}
                onClick={() => setExpanded(false)}
                className="nav-link"
              >
                {label}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
