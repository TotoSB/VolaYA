import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ListHotels = () => {
  const [hoteles, setHoteles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access');

    fetch('http://127.0.0.1:8000/conseguir_hoteles/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al obtener hoteles');
        }
        return res.json();
      })
      .then((data) => {
        setHoteles(data);
      })
      .catch((err) => {
        console.error(err);
        setHoteles([]);
      });
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-3 fw-bold gap-2" style={{ color: "#0d6efd", fontSize:"25px" }}>
        <i className="bx bx-hotel" style={{ fontSize: "2rem", color: "#0d6efd" }}></i>
          Lista De Hoteles
      </div>      
      <div
        className="table-responsive"
        style={{ maxHeight: '70vh', overflowY: 'auto' }}
      >
        {hoteles.length > 0 ? (
        <table className="table table-striped table-bordered align-middle text-center">
          <thead className="table-primary text-center">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Dirección</th>
              <th>Precio</th>
              <th>Personas</th>
              <th>Ciudad</th>
              <th>País</th>
              {/* <th>Acciones</th> */}
            </tr>
          </thead>
          <tbody>
            {hoteles.map((hotel) => (
              <tr key={hotel.id}>
                <td>{hotel.id}</td>
                <td>{hotel.nombre}</td>
                <td>{hotel.descripcion}</td>
                <td>{hotel.direccion}</td>
                <td>${hotel.precio_noche}</td>
                <td>{hotel.personas}</td>
                <td>{hotel.ciudad_nombre}</td>
                <td>{hotel.pais_nombre}</td>
                {/* <td>
                  <div className="d-flex justify-content-center gap-3">
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ backgroundColor: "transparent", borderColor: "#0d6efd" }}
                      title="Modificar"
                    >
                      <i className="bx bx-edit" style={{ fontSize: "1.2rem", color:"#0d6efd" }}></i>
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      style={{ background:"transparent", borderColor:"#dc3545"}}
                      title="Eliminar"
                    >
                      <i className="bx bx-trash" style={{ fontSize: "1.2rem", color: "#dc3545" }}></i>
                    </button>
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
        ) : (
          <p className="text-center fw-bold" style={{ color: '#0d6efd' }}>
            No se encontraron hoteles para mostrar.
          </p>
        )}
      </div>
    </div>
  );
};

export default ListHotels;
