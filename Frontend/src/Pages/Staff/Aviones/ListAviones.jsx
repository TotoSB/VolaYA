import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../../styles/Staff/List.css';

const ListAviones = () => {
  const [aviones, setAviones] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access');

    fetch('http://127.0.0.1:8000/conseguir_aviones/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar aviones');
        return res.json();
      })
      .then(data => setAviones(data))
      .catch(err => {
        console.error('Error:', err);
        alert('No se pudieron cargar los aviones');
      });
  }, []);

  return (
    <div className="container mt-4">
      <div
        className="d-flex align-items-center mb-3 fw-bold gap-2"
        style={{ color: "#0d6efd", fontSize: "25px" }}
      >
        <i className="bx bx-paper-plane" style={{ fontSize: "2rem", color: "#0d6efd" }}></i>
        Lista de Aviones
      </div>

      <div className="table-responsive" style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {aviones.length > 0 ? (
          <table className="table table-striped table-bordered align-middle text-center">
            <thead className="table-primary text-center">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Capacidad Total</th>
                <th>VIP</th>
                <th>General</th>
                <th>Costo x km (VIP)</th>
                <th>Costo x km (General)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {aviones.map((avion) => (
                <tr key={avion.id}>
                  <td>{avion.id}</td>
                  <td>{avion.nombre}</td>
                  <td>{avion.capacidad_avion}</td>
                  <td>{avion.capacidad_vip}</td>
                  <td>{avion.capacidad_general}</td>
                  <td>${avion.costo_km_vip}</td>
                  <td>${avion.costo_km_general}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-3">
                      <Link
                        to={`/staff/avion/editar/${avion.id}`}
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
                          console.log("Eliminar avión:", avion.id);
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
            No hay aviones disponibles.
          </p>
        )}
      </div>
    </div>
  );
};

export default ListAviones;
