import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function HotelesDisponibles() {
  const location = useLocation();
    const {
    costoTotal,
    costoIda,
    costoVuelta,
    vueloIda,
    vueloVuelta,
    personas,
    destinoId,
    fechaSalida,
    fechaVuelta,
    seleccionIda,
    seleccionVuelta
    } = location.state || {};


  const [hoteles, setHoteles] = useState([]);

  const formatoPesos = (valor) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(valor);

  // Calcular cantidad de noches
  const calcularNoches = () => {
    const salida = new Date(fechaSalida);
    const vuelta = new Date(fechaVuelta);
    const diferenciaMs = vuelta - salida;
    const noches = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));
    return noches > 0 ? noches : 1;
  };

  const noches = calcularNoches();

  useEffect(() => {
    const fetchHoteles = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/conseguir_hotel_ciudad/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
          },
          body: JSON.stringify({ ciudad_id: destinoId, personas })
        });

        const data = await res.json();
        setHoteles(data);
      } catch (error) {
        console.error('Error al obtener hoteles:', error);
      }
    };

    if (destinoId) {
      fetchHoteles();
    }
  }, [destinoId, personas]);

  const handleAgregarAlCarrito = async (hotel) => {
    try {
        const totalHotel = hotel.precio_noche * noches;

        const data = {
        personas,
        vuelo_ida: vueloIda.id,
        vuelo_vuelta: vueloVuelta.id,
        hotel: hotel.id,
        total: Number((costoTotal + totalHotel).toFixed(2)),
        asiento_ida: seleccionIda.map(a => a.id),
        asiento_vuelta: seleccionVuelta.map(a => a.id)
        };

        const res = await fetch('http://127.0.0.1:8000/crear_paquete/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access')}`
        },
        body: JSON.stringify(data)
        });

        const result = await res.json();
        if (res.ok) {
        alert(`Paquete creado: ${result.message} - Total: ${formatoPesos(result.costo_total)}`);
        } else {
        alert('Error al crear paquete: ' + JSON.stringify(result));
        }
    } catch (err) {
        console.error('Error al agregar paquete:', err);
    }
    };



  return (
    <div className="contenedor-hotel">
      <h3>Total vuelos: {formatoPesos(costoTotal)}</h3>
      <p>🛫 Ida ({vueloIda.origen} → {vueloIda.destino}): {formatoPesos(costoIda)}</p>
      <p>🔙 Vuelta ({vueloVuelta.origen} → {vueloVuelta.destino}): {formatoPesos(costoVuelta)}</p>
      <p>👥 Personas: {personas}</p>
      <p>🛏️ Noches de estadía: {noches}</p>

      <h4>🏨 Hoteles disponibles en {hoteles[0]?.ciudad_nombre || 'el destino'}</h4>
      <ul>
        {hoteles.length > 0 ? (
          hoteles.map((hotel) => (
            <li key={hotel.id} style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
              <h5>{hotel.nombre}</h5>
              <p><strong>Descripción:</strong> {hotel.descripcion}</p>
              <p><strong>Dirección:</strong> {hotel.direccion}</p>
              <p><strong>Ciudad:</strong> {hotel.ciudad_nombre}, {hotel.pais_nombre}</p>
              <p><strong>Capacidad:</strong> {hotel.personas} personas</p>
              <p><strong>Precio por noche:</strong> {formatoPesos(hotel.precio_noche)}</p>
              <p><strong>Total ({noches} noches):</strong> {formatoPesos(hotel.precio_noche * noches)}</p>
                <button className="btn btn-success mt-2" onClick={() => handleAgregarAlCarrito(hotel)}>Agregar al carrito</button>
            </li>
          ))
        ) : (
          <p>No hay hoteles disponibles.</p>
        )}
      </ul>
    </div>
  );
}

export default HotelesDisponibles;
