import React, { useState } from 'react';
import '../../styles/Search.css';

function Search() {
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [sugerenciasOrigen, setSugerenciasOrigen] = useState([]);
  const [sugerenciasDestino, setSugerenciasDestino] = useState([]);
  const [mostrarSugerenciasOrigen, setMostrarSugerenciasOrigen] = useState(false);
  const [mostrarSugerenciasDestino, setMostrarSugerenciasDestino] = useState(false);

  const [fechaSalida, setFechaSalida] = useState('');
  const [fechaVuelta, setFechaVuelta] = useState('');
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const buscarSugerencias = async (valor, setSugerencias, setMostrar) => {
    if (valor.length >= 3) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/buscar_hoteles/?search=${valor}`);
        const data = await res.json();
        setSugerencias(data);
        setMostrar(true);
      } catch (err) {
        console.error("Error al buscar hoteles:", err);
      }
    } else {
      setSugerencias([]);
      setMostrar(false);
    }
  };

  const handleChangeOrigen = (e) => {
    const valor = e.target.value;
    setOrigen(valor);
    buscarSugerencias(valor, setSugerenciasOrigen, setMostrarSugerenciasOrigen);
  };

  const handleChangeDestino = (e) => {
    const valor = e.target.value;
    setDestino(valor);
    buscarSugerencias(valor, setSugerenciasDestino, setMostrarSugerenciasDestino);
  };

  const seleccionarSugerenciaOrigen = (ciudad, pais) => {
    setOrigen(`${ciudad}, ${pais}`);
    setMostrarSugerenciasOrigen(false);
  };

  const seleccionarSugerenciaDestino = (ciudad, pais) => {
    setDestino(`${ciudad}, ${pais}`);
    setMostrarSugerenciasDestino(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const salida = new Date(fechaSalida);
    const vuelta = new Date(fechaVuelta);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaSalida && salida < hoy) {
      setError('La fecha de salida no puede ser anterior a hoy.');
      return;
    }

    if (fechaVuelta && vuelta < hoy) {
      setError('La fecha de vuelta no puede ser anterior a hoy.');
      return;
    }

    if (fechaSalida && fechaVuelta && vuelta < salida) {
      setError('La fecha de vuelta no puede ser anterior a la de salida.');
      return;
    }

    setError('');
    console.log('Formulario válido');
  };

  return (
    <>
      <form className="search-form" onSubmit={handleSubmit}>
        {/* Origen */}
        <div className="form-group">
          <label>Origen:</label>
          <input
            type="text"
            placeholder="Ciudad de origen"
            value={origen}
            onChange={handleChangeOrigen}
            onFocus={() => setMostrarSugerenciasOrigen(true)}
            onBlur={() => setTimeout(() => setMostrarSugerenciasOrigen(false), 200)}
          />
          {mostrarSugerenciasOrigen && sugerenciasOrigen.length > 0 && (
            <ul className="sugerencias-lista">
              {sugerenciasOrigen.map((item, index) => (
                <li
                  key={index}
                  onClick={() => seleccionarSugerenciaOrigen(item.ciudad_nombre, item.pais_nombre)}
                >
                  {item.ciudad_nombre}, {item.pais_nombre}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Destino */}
        <div className="form-group">
          <label>Destino:</label>
          <input
            type="text"
            placeholder="Ciudad de destino"
            value={destino}
            onChange={handleChangeDestino}
            onFocus={() => setMostrarSugerenciasDestino(true)}
            onBlur={() => setTimeout(() => setMostrarSugerenciasDestino(false), 200)}
          />
          {mostrarSugerenciasDestino && sugerenciasDestino.length > 0 && (
            <ul className="sugerencias-lista">
              {sugerenciasDestino.map((item, index) => (
                <li
                  key={index}
                  onClick={() => seleccionarSugerenciaDestino(item.ciudad_nombre, item.pais_nombre)}
                >
                  {item.ciudad_nombre}, {item.pais_nombre}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Fechas */}
        <div className="form-group">
          <label>Fecha de ida:</label>
          <input
            type="date"
            value={fechaSalida}
            min={today}
            onChange={(e) => setFechaSalida(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Fecha vuelta:</label>
          <input
            type="date"
            value={fechaVuelta}
            min={today}
            onChange={(e) => setFechaVuelta(e.target.value)}
          />
        </div>

        {/* Personas */}
        <div className="form-group">
          <label>Personas:</label>
          <input type="number" min="1" max="10" defaultValue="1" />
        </div>

        <button type="submit" className="search-btn">
          <i className="bx bx-search" style={{ color: "#fff", fontSize: "20px" }}></i> Buscar
        </button>
      </form>

      {error && <p className="error-msg">{error}</p>}
    </>
  );
}

export default Search;
