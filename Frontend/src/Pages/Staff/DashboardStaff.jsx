import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarStaff from '../../components/Staff/SidebarStaff';
import HeaderStaff from '../../components/Staff/HeaderStaff';
import '../../styles/Staff/Home.css';
import 'boxicons/css/boxicons.min.css';



const DashBoardStaff = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState(null);
  const [buscando, setBuscando] = useState(false);



  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('http://localhost:8000/admin_dashboard/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access')}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener los datos del dashboard');
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

    useEffect(() => {
      const delayDebounce = setTimeout(() => {
        if (query.trim()) {
          buscar();
        } else {
          setResultados(null);
        }
      }, 500);

      return () => clearTimeout(delayDebounce);
    }, [query]);


  const buscar = async () => {
    if (!query.trim()) return;

    setBuscando(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/busqueda/?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('Error al buscar');
      const data = await res.json();
      setResultados(data);
    } catch (err) {
      console.error('Error al buscar:', err);
    } finally {
      setBuscando(false);
    }
  };


return (
  <div className="staff-layout">
    <div className="staff-content">

      <div className="busqueda-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar: ciudad, país, hotel..."
          className="busqueda-input"
        />
      </div>


            {/* Resultados de búsqueda */}
      {resultados && (
        <div className="busqueda-resultados">
          <h3>Resultados de búsqueda:</h3>

          {resultados.ciudades.length > 0 && (
            <>
              <h4>Ciudades (relacionadas con <b>"{query}"</b>)</h4>
              <ul>
                {resultados.ciudades.map(ciudad => (
                  <li key={`ciudad-${ciudad.id}`}>
                    {ciudad.nombre} ({ciudad.pais_nombre})
                  </li>
                ))}
              </ul>
            </>
          )}

          {resultados.paises.length > 0 && (
            <>
              <h4>Países (relacionados con <b>"{query}"</b>)</h4>
              <ul>
                {resultados.paises.map(pais => (
                  <li key={`pais-${pais.id}`}>{pais.nombre}</li>
                ))}
              </ul>
            </>
          )}

          {resultados.hoteles.length > 0 && (
            <>
              <h4>Hoteles (relacionadas con <b>"{query}"</b>)</h4>
              <ul>
                {resultados.hoteles.map(hotel => (
                  <li key={`hotel-${hotel.id}`}>
                    {hotel.nombre} – {hotel.ciudad_nombre}, {hotel.pais_nombre} (${hotel.precio_noche})
                  </li>
                ))}
              </ul>
            </>
          )}

          {resultados.vuelos.length > 0 && (
            <>
              <h4>Vuelos (relacionados con <b>"{query}"</b>)</h4>
              <ul>
                {resultados.vuelos.map(vuelo => (
                  <li key={`vuelo-${vuelo.id}`}>
                    {vuelo.avion}: {vuelo.origen} → {vuelo.destino} ({new Date(vuelo.fecha).toLocaleDateString()})
                  </li>
                ))}
              </ul>
            </>
          )}

          {resultados.aviones.length > 0 && (
            <>
              <h4>Aviones (relacionados con <b>"{query}"</b>)</h4>
              <ul>
                {resultados.aviones.map(avion => (
                  <li key={`avion-${avion.id}`}>
                    {avion.nombre} - Capacidad: {avion.capacidad_avion}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {/* Dashboard */}
      <h2 className="dashboard-title">Resumen del sistema</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : data ? (
        <div className="dashboard-grid">
          <div className="card card-usuarios">
            <i className='bx bxs-user-detail icon'></i>
            <h3>Usuarios registrados</h3>
            <p>{data.total_usuarios}</p>
          </div>
          <div className="card card-paquetes">
            <i className='bx bxs-package icon'></i>
            <h3>Total de paquetes</h3>
            <p>{data.total_paquetes}</p>
          </div>
          <div className="card card-pagados">
            <i className='bx bxs-check-circle icon'></i>
            <h3>Paquetes pagados</h3>
            <p>{data.paquetes_pagados}</p>
          </div>
          <div className="card card-ingresos">
            <i className='bx bxs-dollar-circle icon'></i>
            <h3>Ingresos totales</h3>
            <p>${data.ingresos_totales.toLocaleString('es-AR')}</p>
          </div>
          <div className="card card-hoteles">
            <i className='bx bxs-building-house icon'></i>
            <h3>Total de hoteles</h3>
            <p>{data.total_hoteles}</p>
          </div>
          <div className="card card-autos">
            <i className='bx bxs-car icon'></i>
            <h3>Total de autos</h3>
            <p>{data.total_autos}</p>
          </div>
          <div className="card card-aviones">
            <i className='bx bxs-plane-alt icon'></i>
            <h3>Total de aviones</h3>
            <p>{data.total_aviones}</p>
          </div>
        </div>

      ) : (
        <p>No se pudieron cargar los datos.</p>
      )}
    </div>

  </div>
);

};

export default DashBoardStaff;
