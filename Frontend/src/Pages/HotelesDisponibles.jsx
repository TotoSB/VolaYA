import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Public/Header';
import Search from '../components/Public/Search';
import '../styles/Hoteles_disponibles.css';

function HotelesDisponibles() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [idUsuario, setIdUsuario] = useState('');

  const {
    hoteles = [],
    costoTotal = 0,
    personas,
    fechaSalida,
    fechaVuelta,
    origenId,
    destinoId,
    origen,
    destino,
    autoSeleccionadoId,
    auto
  } = location.state || {};



  const formatoPesos = (num) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(num);

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
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setIdUsuario(data.id);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('access');
        }
      } catch (error) {
        console.error('Error verificando token:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };


    const handleAgregarAlCarrito = async (hotelId) => {
      const token = localStorage.getItem('access');

      if (!token) {
        alert('Debes iniciar sesión para agregar al carrito.');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/crear_paquete/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            personas: parseInt(personas),
            fecha_salida: `${fechaSalida}`,
            fecha_regreso: `${fechaVuelta}`,
            ciudad_destino: destinoId,
            ciudad_salida: origenId,
            hora_salida: "14:00:00",
            hotel: hotelId,
            auto: autoSeleccionadoId || null,
            total: costoTotal + hoteles.find(h => h.id === hotelId).precio_noche,
          })
        });

        if (!response.ok) throw new Error('Error al crear paquete');

        const data = await response.json();
        alert('Paquete agregado al carrito con éxito ✅');
        console.log('Paquete creado:', data);

      } catch (error) {
        console.error('Error al agregar al carrito:', error);
        alert('Hubo un error al agregar al carrito ❌');
      }
    };

  useEffect(() => {
    verifyToken();
  }, []);

  if (isLoading) return <div className="loading">Cargando...</div>;

  if (!hoteles.length) {
    return (
      <>
        <Header />
        <div className="welcome__buttons d-flex justify-content-center align-items-center gap-3 mb-5">
          <Search />
        </div>
        <div className="no-hotels-message">
          <p>No se encontraron hoteles disponibles.</p>
          <button onClick={() => navigate('/')}>Volver</button>
        </div>
      </>
    );
  }

    const calcularNoches = (salida, regreso) => {
    const f1 = new Date(salida);
    const f2 = new Date(regreso);
    const diffTime = Math.abs(f2 - f1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const noches = calcularNoches(fechaSalida, fechaVuelta);

  return (
    <>
      <Header />
      <div>

      <main className="main-container">
        <section className="budget-section">
          <h2>Presupuesto de tu vuelo</h2>
          <p>
            Cotización total del vuelo:{' '}
            <span className="cotizacion">{formatoPesos(costoTotal)}</span>
          </p>
          <section className="datos-busqueda">
          <h2>Datos de tu búsqueda</h2>
            <p><strong>Origen:</strong> {origen}</p>
            <p><strong>Destino:</strong> {destino}</p>
            <p><strong>Fecha de salida:</strong> {fechaSalida}</p>
            <p><strong>Fecha de regreso:</strong> {fechaVuelta}</p>
            <p><strong>Personas:</strong> {personas}</p>
            <p><strong>Auto seleccionado:</strong> {auto ? `${auto.marca} ${auto.modelo}` : 'Sin auto'}</p>
          </section>
        </section>





        <section>
          <h2>Hoteles Disponibles</h2>
          <ul className="hoteles-list">
            {hoteles.map((hotel) => (
              <li key={hotel.id} className="hotel-card">
                <strong>{hotel.nombre}</strong>
                <div className="hotel-info">
                  <b>{hotel.ciudad_nombre} </b> <br />
                  Dirección: {hotel.direccion} <br />
                  Precio/noche: <span className="precio">{formatoPesos(hotel.precio_noche)}</span>
                </div>
                <button className="btn-agregar" onClick={() => handleAgregarAlCarrito(hotel.id)}>Agregar al carrito</button>
                <h1>Total + vuelo: <span className="cotizacion">{formatoPesos(costoTotal + (hotel.precio_noche * noches))}</span></h1>
              </li>
            ))}
          </ul>
        </section>
      </main>
      </div>
    </>
  );
}

export default HotelesDisponibles;