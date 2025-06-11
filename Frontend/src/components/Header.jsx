import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function Header() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar expand="lg" bg="light" variant="light" expanded={expanded}>
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={() => setExpanded(false)}>
          VolaYA
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(prev => !prev)}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {[
              { to: "/", label: "Inicio" },
              { to: "/paquetes", label: "Paquetes" },
              { to: "/vuelos", label: "Vuelos" },
              { to: "/login", label: "Iniciar sesión" },
              { to: "/register", label: "Registrarse" },
            ].map(({ to, label }) => (
              <Nav.Link
                as={Link}
                to={to}
                key={to}
                onClick={() => setExpanded(false)}
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
