import React, { useEffect, useState } from 'react';
import '../../../styles/Staff/Create.css';

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
    <div className="container mt-5" style={{ maxWidth: '700px' }}>
      <h2 className="mb-4 text-center create-title">Lista de Ciudades</h2>
      {ciudades.length === 0 ? (
        <p className="text-center">No hay ciudades disponibles.</p>
      ) : (
        <ul className="list-group">
          {ciudades.map((ciudad) => (
            <li key={ciudad.id} className="list-group-item d-flex justify-content-between align-items-center">
              {ciudad.nombre}
              {/* <span className="badge bg-secondary">
                {ciudad.pais_nombre || 'Sin país'}
              </span> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListCiudad;
