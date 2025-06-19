import React, { useEffect, useState } from 'react';
import '../../../styles/Staff/Create.css';
import { Link } from 'react-router-dom';

const ListVuelo = () => {
  const [vuelos, setVuelos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access');

    fetch('http://127.0.0.1:8000/conseguir_vuelos/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .then(data => setVuelos(data))
      .catch(err => {
        console.error('Error:', err);
        alert('No se pudieron cargar los vuelos');
      });
  }, []);

  const handleAsientos = (vueloId) => {
    // Aquí puedes implementar la lógica para manejar los asientos del vuelo
    console.log(`Manejando asientos para el vuelo con ID: ${vueloId}`);
  }

  return (
    <div className="container mt-4">
      <div
        className="d-flex align-items-center mb-3 fw-bold gap-2"
        style={{ color: "#0d6efd", fontSize: "25px" }}
      >
        <i className="bx bx-calendar-week" style={{ fontSize: "2rem", color: "#0d6efd" }}></i>
        Lista de Vuelos
      </div>

      <div className="table-responsive" style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {vuelos.length > 0 ? (
          <table className="table table-striped table-bordered align-middle text-center">
            <thead className="table-primary">
              <tr>
                <th>ID</th>
                <th>Avión (ID)</th>
                <th>Origen (ID)</th>
                <th>Destino (ID)</th>
                <th>Fecha</th>
                <th>Asientos</th>
              </tr>
            </thead>
            <tbody>
              {vuelos.map((vuelo) => (
                <tr key={vuelo.id}>
                  <td>{vuelo.id}</td>
                  <td>{vuelo.avion}</td>
                  <td>{vuelo.origen}</td>
                  <td>{vuelo.destino}</td>
                  <td>{new Date(vuelo.fecha).toLocaleString()}</td>
                  <td><button className="btn btn-primary" onClick={() => handleAsientos(vuelo.id)}>< i className='bx  bx-chair'></i> </button></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center fw-bold" style={{ color: "#0d6efd" }}>
            No hay vuelos disponibles.
          </p>
        )}
      </div>
    </div>
  );
};

export default ListVuelo;
