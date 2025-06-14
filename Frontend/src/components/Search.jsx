import React, { useState } from 'react';
import '../styles/search.css';

function Search() {
  const [fechaSalida, setFechaSalida] = useState('');
  const [fechaVuelta, setFechaVuelta] = useState('');
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd

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
        <div className="form-group">
          <label>Origen:</label>
          {/* A partir de los 3 caracteres que ejecute la query buscar_hoteles */}
          <input type="text" placeholder="Ciudad de origen" /> 

        </div>

        <div className="form-group">
          <label>Destino:</label>
        {/* A partir de los 3 caracteres que ejecute la query buscar_hoteles*/}
          <input type="text" placeholder="Ciudad de destino" />
        </div>

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

        <div className="form-group">
          <label>Personas:</label>
          {/* Que busque hoteles con maximo, esta capacidad */}
          <input type="number" min="1" max="10" defaultValue="1" />
        </div>


        {/* Aca cuando carga la pagina extraer los autos y cargarlos en los options */}
        <div className="form-group">
        <label htmlFor="auto">
            <i
            className="bx bx-car"
            style={{ color: "#0d6efd", fontSize: "20px", marginRight: "8px" }}
            ></i>
        </label>
        <select id="auto" className="form-select">
            <option value="ninguno">Ninguno</option>
            <option value="auto2">Auto 2</option>
            <option value="auto3">Auto 3</option>
            <option value="auto4">Auto 4</option>
        </select>
        </div>


        {/* Aca que ejecute la query obtener_paquetes_search, enviando todos los datos del formulario */}
        <button type="submit" className="search-btn">            
            <i
              className="bx bx-search"
              style={{ color: "#fff", fontSize: "20px", textAlign: "center" }}
            ></i>Buscar</button>
      </form>

      {error && <p className="error-msg">{error}</p>}
    </>
  );
}

export default Search;
