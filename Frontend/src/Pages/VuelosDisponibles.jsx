
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Header from '../components/Public/Header';
import '../styles/Vuelos_disponibles.css';

function VuelosDisponibles() {
  const location = useLocation();
  const navigate = useNavigate();

  const [vueloIdaSeleccionado, setVueloIdaSeleccionado] = useState(null);
  const [vueloVueltaSeleccionado, setVueloVueltaSeleccionado] = useState(null);

  const {
    vuelosIda = [],
    vuelosVuelta = [],
    origen,
    destino,
    fechaSalida,
    fechaVuelta,
    personas,
    destinoId,
    autoSeleccionadoId,
    auto
  } = location.state || {};

  const handleSeleccionVuelo = (vuelo) => {
    navigate(`/reservar_asientos/${vuelo.id}`, { state: { vuelo, personas } });
  };




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
          {auto && (
              <p><strong>Auto:</strong> {auto.marca} - {auto.modelo}</p>
          )}
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
                  <button onClick={() => setVueloIdaSeleccionado(vuelo)}>Seleccionar vuelo de ida</button>

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
                  <p><strong>Avión:</strong> {vuelo.avion}</p>
                  <p><strong>Origen:</strong> {vuelo.origen}</p>
                  <p><strong>Destino:</strong> {vuelo.destino}</p>
                  <p><strong>Fecha:</strong> {new Date(vuelo.fecha).toLocaleString()}</p>
                  <button onClick={() => setVueloVueltaSeleccionado(vuelo)}>Seleccionar vuelo de vuelta</button>

                </li>
              ))}
            </ul>
          )}
        </section>

        {vueloIdaSeleccionado && vueloVueltaSeleccionado && (
        <button
          className="btn btn-primary"
          onClick={() =>
              navigate(`/reservar_asientos`, {
                state: {
                  vueloIda: vueloIdaSeleccionado,
                  vueloVuelta: vueloVueltaSeleccionado,
                  personas,
                  destinoId,
                  autoSeleccionadoId,
                  auto
                }
              })
          }
        >
          Continuar a selección de asientos
        </button>
      )}

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
