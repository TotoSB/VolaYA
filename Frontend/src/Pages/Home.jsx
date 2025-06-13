import React from "react";
import Header from "../components/Header";
import Login from "./Login";
import Register from "./Register";
import { Container } from "react-bootstrap";
import { Routes, Route, useNavigate } from "react-router-dom";
import Package from "./Package";
import InsertarCodigo from "./InsertCode";
import "../styles/Home.css";
import Perfil from "./Perfil";



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
          <Route path="/perfil" element={<Perfil />} /></Routes>
      </Container>
    </>
  );
}



function Welcome() {
  return (
    <div className="welcome">
      <h1 className="welcome__title">
        Bienvenido a VolaYA <i className="bx bx-paper-plane" style={{ color: "#0d6efd" }}></i>
      </h1>

      <p className="welcome__subtitle">
        Explorá el mundo con nuestras ofertas de viaje únicas y viví experiencias inolvidables.
      </p>

      <div className="welcome__buttons d-flex justify-content-center align-items-center gap-3 mb-5">
        <a href="/paquetes" className="btn btn-primary px-4">Ver Paquetes</a>
        <a href="/register" className="btn btn-outline-primary px-4">Registrarse</a>
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-4">
        <div className="col">
          <div className="card welcome__card h-100 text-center">
            <div className="mb-3">
              <i className="bx bx-map-alt welcome__icon"></i>
            </div>
            <div className="card-body">
              <h5 className="card-title">Aventuras</h5>
              <p className="card-text">Descubrí experiencias únicas en destinos exóticos y naturales.</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card welcome__card h-100 text-center">
            <div className="mb-3">
              <i className="bx bx-hotel welcome__icon"></i>
            </div>
            <div className="card-body">
              <h5 className="card-title">Alojamiento</h5>
              <p className="card-text">Hospedate en hoteles increíbles y al mejor precio garantizado.</p>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="card welcome__card h-100 text-center">
            <div className="mb-3">
              <i className="bx bx-gift welcome__icon"></i>
            </div>
            <div className="card-body">
              <h5 className="card-title">Ofertas</h5>
              <p className="card-text">Aprovechá nuestras promociones y descuentos limitados.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}








export default Home;
