import '../Styles/Carrito.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Public/Header';

const Carrito = () => {
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);
  const [totalCarrito, setTotalCarrito] = useState(null);
  const [reservasPendientes, setReservasPendientes] = useState([]);

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
            <div key={reserva.id} className="reserva-item" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <p><strong>Origen:</strong> {reserva.ciudad_salida_nombre}</p>
              <p><strong>Destino:</strong> {reserva.ciudad_destino_nombre}</p>
              <p><strong>Hotel:</strong> {reserva.hotel_nombre}</p>
              <p><strong>Fecha de salida:</strong> {new Date(reserva.fecha_salida).toLocaleDateString()}</p>
              <p><strong>Fecha de regreso:</strong> {new Date(reserva.fecha_regreso).toLocaleDateString()}</p>
              <p><strong>Hora de salida:</strong> {reserva.hora_salida}</p>
              <p><strong>Cantidad de personas:</strong> {reserva.personas}</p>
              <p><strong>Total:</strong> {new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS',
              }).format(reserva.total)}</p>
              <button className='btn-pagar'>Pagar</button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Carrito;
