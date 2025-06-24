import '../Styles/Carrito.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Public/Header';

const Carrito = () => {
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);
  const [totalCarrito, setTotalCarrito] = useState(null);
  const [reservasPendientes, setReservasPendientes] = useState([]);

  // Función para formatear fecha ISO a formato legible en español
  const formatFecha = (fechaISO) => {
    if (!fechaISO) return 'Sin fecha';
    return new Date(fechaISO).toLocaleString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('access');

    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://127.0.0.1:8000/conseguir_mi_usuario/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) throw new Error('Token inválido');
        return response.json();
      })
      .then(() => {
        return Promise.all([
          fetch('http://127.0.0.1:8000/conseguir_carrito/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch('http://127.0.0.1:8000/conseguir_mis_reservas_pendientes/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        ]);
      })
      .then(async ([carritoRes, reservasRes]) => {
        if (!carritoRes.ok || !reservasRes.ok) throw new Error('Error en la obtención de datos');

        const carritoData = await carritoRes.json();
        const reservasData = await reservasRes.json();

        setTotalCarrito(carritoData?.total || 0);
        setReservasPendientes(reservasData || []);
        setIsValidating(false);
      })
      .catch(() => {
        localStorage.removeItem('access');
        navigate('/login');
        alert('Logeate como usuario normal para ver el carrito');
      });
  }, [navigate]);

  if (isValidating) return <p>Cargando...</p>;

  return (
    <>
      <Header />
      <div className="carrito-contenido">
        <h2>
          Total del carrito:{' '}
          {new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
          }).format(totalCarrito)}
        </h2>

        <h3>Reservas pendientes: {reservasPendientes.length}</h3>
        {reservasPendientes.length === 0 ? (
          <p>No tenés reservas pendientes.</p>
        ) : (
          reservasPendientes.map(reserva => (
            <div
              key={reserva.id}
              className="reserva-item"
              style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}
            >
              <p><strong>Descripción:</strong> {reserva.descripcion || 'Sin descripción'}</p>
              <p><strong>Personas:</strong> {reserva.personas}</p>

              <p><strong>Vuelo Ida:</strong> {reserva.vuelo_ida_obj?.origen_nombre} → {reserva.vuelo_ida_obj?.destino_nombre}</p>
              <p><strong>Fecha Vuelo Ida:</strong> {formatFecha(reserva.vuelo_ida_fecha)}</p>

              <p><strong>Vuelo Vuelta:</strong> {reserva.vuelo_vuelta_obj?.origen_nombre} → {reserva.vuelo_vuelta_obj?.destino_nombre}</p>
              <p><strong>Fecha Vuelo Vuelta:</strong> {formatFecha(reserva.vuelo_vuelta_fecha)}</p>

              <p><strong>Hotel:</strong> {reserva.hotel || 'Sin hotel'}</p>
              <p><strong>Auto:</strong> {reserva.auto || 'Sin auto'}</p>

              <p><strong>Asientos Ida:</strong> {
                reserva.asiento_ida && reserva.asiento_ida.length > 0
                  ? reserva.asiento_ida.map(a => `#${a.numero} ${a.vip ? '(VIP)' : ''}`).join(', ')
                  : 'Sin asientos'
              }</p>

              <p><strong>Asientos Vuelta:</strong> {
                reserva.asiento_vuelta && reserva.asiento_vuelta.length > 0
                  ? reserva.asiento_vuelta.map(a => `#${a.numero} ${a.vip ? '(VIP)' : ''}`).join(', ')
                  : 'Sin asientos'
              }</p>

              <p><strong>Total:</strong> {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(parseFloat(reserva.total))}</p>

              <button
                className="btn-pagar"
                onClick={() => navigate('/pagar', { state: { reservaId: reserva.id, total: reserva.total } })}
              >
                Pagar
              </button>
            </div>
          ))
        )}

      </div>
    </>
  );
};

export default Carrito;
