import React, { useEffect, useState } from 'react';

function Perfil() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access');

    if (token) {
      fetch('http://127.0.0.1:8000/perfil/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario');
          }
          return response.json(); // ✅ esto solo una vez
        })
        .then(data => {
          setUserData(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }, []);

  return (
    <div className="perfil-container">
      <h2>Mi Perfil</h2>
      {userData ? (
        <div className="perfil-info">
          <p><strong>Nombre:</strong> {userData.nombre}</p>
          <p><strong>Correo:</strong> {userData.correo}</p>
        </div>
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
}

export default Perfil;
