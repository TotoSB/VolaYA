import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Public/Header';
import Search from '../components/Public/Search';
import '../styles/Search.css';

function HotelesDisponibles() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const responseData = location.state?.hoteles || {};
  const hoteles = responseData.hoteles_disponibles || [];

  // Función para verificar el token
  const verifyToken = async () => {
    const token = localStorage.getItem('access');
    
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/conseguir_mi_usuario/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('access');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error verificando token:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
    if (location.state?.hoteles) {
      console.log(location.state.hoteles.costo_vuelo_y_servicios);
    }
  }, [location.state]);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return null; // Redirección ya manejada en el useEffect
  }

  if (!hoteles.length) {
    return (
      <div>
        <p>No se encontraron hoteles disponibles.</p>
        <button onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }
  return (
    <>
      <Header/>
      <Search />
      <h2>Presupuesto de tu vuelo</h2>
      <p>Costo total vuelo + servicios: ${location.state?.hoteles.costo_vuelo_y_servicios}ARS</p>
      <h2>Hoteles Disponibles</h2>
      <ul>
        {hoteles.map((hotel) => (
          <li key={hotel.id}>
            <strong>{hotel.nombre}</strong> - {hotel.ciudad_nombre} - {hotel.país_nombre}
            <br />
            Dirección: {hotel.direccion}
            <br />
            Precio/noche: ${hotel.precio_noche}
            <button>+</button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default HotelesDisponibles;