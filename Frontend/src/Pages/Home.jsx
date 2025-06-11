import React from "react";
import Header from "../components/Header";
import Login from "./Login";
import Register from "./Register";
import { Container } from "react-bootstrap";
import { Routes, Route, useNavigate } from "react-router-dom";
import Package from "./Package";
import InsertarCodigo from "./InsertCode";

function Home() {
  return (
    <>
      <Header />

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/paquetes" element={<Package />} />
          <Route path="/codigo" element={<InsertarCodigo />} />
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





export default Home;
