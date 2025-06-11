import React from "react";
import Header from "../components/Header";
import Login from "./Login";
import Register from "./Register";
import { Container } from "react-bootstrap";
import { Routes, Route, useNavigate } from "react-router-dom";

function Home() {
  return (
    <>
      <Header />

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/paquetes" element={<Paquetes />} />
          <Route path="/vuelos" element={<Vuelos />} />
        </Routes>
      </Container>
    </>
  );
}

function Welcome() {
  return (
    <div>
      <h2>Bienvenido a VolaYA</h2>
      <p>Tu plataforma para viajar fácil.</p>
    </div>
  );
}

function Paquetes() {
  return <h2>Explora nuestros paquetes</h2>;
}

function Vuelos() {
  return <h2>Busca y reserva vuelos</h2>;
}

export default Home;
