import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/Staff/List.css';

const ListCiudad = () => {
  const [ciudades, setCiudades] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access');

    fetch('http://127.0.0.1:8000/conseguir_ciudades/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar ciudades');
        return res.json();
      })
      .then(data => setCiudades(data))
      .catch(err => {
        console.error('Error:', err);
        alert('No se pudieron cargar las ciudades');
      });
  }, []);

  return (
    <div className="container mt-4">
      <div
        className="d-flex align-items-center mb-3 fw-bold gap-2"
        style={{ color: "#0d6efd", fontSize: "25px" }}
      >
        <i className="bx bx-buildings" style={{ fontSize: "2rem", color: "#0d6efd" }}></i>
        Lista de Ciudades
      </div>

      <div className="table-responsive" style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {ciudades.length > 0 ? (
          <table className="table table-striped table-bordered align-middle text-center">
            <thead className="table-primary text-center">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>País</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ciudades.map((ciudad) => (
                <tr key={ciudad.id}>
                  <td>{ciudad.id}</td>
                  <td>{ciudad.nombre}</td>
                  <td>{ciudad.pais_nombre || '—'}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-3">
                      <Link
                        to={`/staff/ciudades/editar/${ciudad.id}`}
                        className="btn btn-primary btn-sm"
                        style={{
                          backgroundColor: "transparent",
                          borderColor: "#0d6efd",
                        }}
                        title="Modificar"
                      >
                        <i className="bx bx-edit" style={{ fontSize: "1.2rem", color: "#0d6efd" }}></i>
                      </Link>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        style={{
                          background: "transparent",
                          borderColor: "#dc3545",
                        }}
                        title="Eliminar"
                        onClick={() => {
                          console.log("Eliminar ciudad:", ciudad.id);
                        }}
                      >
                        <i className="bx bx-trash" style={{ fontSize: "1.2rem", color: "#dc3545" }}></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center fw-bold" style={{ color: "#0d6efd" }}>
            No hay ciudades disponibles.
          </p>
        )}
      </div>
    </div>
  );
};

export default ListCiudad;
