import React, { useEffect, useState } from 'react';
import '../../../styles/Staff/Create.css';

const ListPais = () => {
  const [paises, setPaises] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access');

    fetch('http://127.0.0.1:8000/conseguir_paises/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar países");
        return res.json();
      })
      .then(data => setPaises(data))
      .catch(err => {
        console.error("Error:", err);
        alert("No se pudieron cargar los países");
      });
  }, []);

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 text-center create-title">Lista de Países</h2>
      {paises.length === 0 ? (
        <p className="text-center">No hay países disponibles.</p>
      ) : (
        <ul className="list-group">
          {paises.map((pais) => (
            <li key={pais.id} className="list-group-item">
              {pais.nombre}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListPais;
