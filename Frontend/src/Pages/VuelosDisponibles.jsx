import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Public/Header';
import '../styles/Vuelos_disponibles.css';

function VuelosDisponibles() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    vuelosIda = [],
    vuelosVuelta = [],
    origen,
    destino,
    fechaSalida,
    fechaVuelta,
    personas,
  } = location.state || {};

  const formatoPesos = (num) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(num);

  return (
    <>
      <Header />
      <main className="main-container">
        <section className="datos-busqueda">
          <h2>Datos de tu búsqueda</h2>
          <p><strong>Origen:</strong> {origen}</p>
          <p><strong>Destino:</strong> {destino}</p>
          <p><strong>Fecha de salida:</strong> {fechaSalida}</p>
          <p><strong>Fecha de regreso:</strong> {fechaVuelta}</p>
          <p><strong>Personas:</strong> {personas}</p>
        </section>

        <section className="vuelos-section">
          <h2>Vuelos de ida</h2>
          {vuelosIda.length === 0 ? (
            <p>No hay vuelos de ida disponibles.</p>
          ) : (
            <ul className="vuelos-list">
              {vuelosIda.map((vuelo) => (
                <li key={vuelo.id} className="vuelo-card">
                  <p><strong>Avión:</strong> {vuelo.avion}</p>
                  <p><strong>Origen:</strong> {vuelo.origen}</p>
                  <p><strong>Destino:</strong> {vuelo.destino}</p>
                  <p><strong>Fecha:</strong> {new Date(vuelo.fecha).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="vuelos-section">
          <h2>Vuelos de regreso</h2>
          {vuelosVuelta.length === 0 ? (
            <p>No hay vuelos de regreso disponibles.</p>
          ) : (
            <ul className="vuelos-list">
              {vuelosVuelta.map((vuelo) => (
                <li key={vuelo.id} className="vuelo-card">
                  <p><strong>Vuelo:</strong> {vuelo.codigo}</p>
                  <p><strong>Salida:</strong> {vuelo.ciudad_origen} - {vuelo.hora_salida}</p>
                  <p><strong>Llegada:</strong> {vuelo.ciudad_destino} - {vuelo.hora_llegada}</p>
                  <p><strong>Precio por persona:</strong> {formatoPesos(vuelo.precio)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="text-center mt-4">
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            Volver al inicio
          </button>
        </div>
      </main>
    </>
  );
}

export default VuelosDisponibles;
