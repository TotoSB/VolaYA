import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Styles/Carrito.css';

const Carrito = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedHotels, setSelectedHotels] = useState([]);

  const responseData = location.state?.hoteles || {};
  const hoteles = responseData.hoteles_disponibles || [];
  const costoVueloServicios = location.state?.hoteles?.costo_vuelo_y_servicios || 0;

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

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isLoading, isAuthenticated, navigate]);

  const addHotel = (hotel) => {
    setSelectedHotels([...selectedHotels, hotel]);
  };

  const removeHotel = (hotelId) => {
    setSelectedHotels(selectedHotels.filter(hotel => hotel.id !== hotelId));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  

  if (isLoading) {
    return (
      <div className="cart-container">
        <div className="loading-screen">
          <div className="loading-icon">✈️</div>
          <h2>Cargando...</h2>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (!hoteles.length) {
    return (
      <div className="cart-container">
        <div className="animated-background">
          <div className="cloud cloud-1">☁️</div>
          <div className="cloud cloud-2">☁️</div>
          <div className="cloud cloud-3">☁️</div>
          <div className="airplane airplane-1">✈️</div>
          <div className="airplane airplane-2">✈️</div>
        </div>

        <header className="cart-header">
          <div className="header-content">
            <div className="logo" onClick={() => navigate('/')}>
              <span className="plane-icon">✈️</span>
              <h1>VolaYA</h1>
            </div>
            <button className="back-btn" onClick={() => navigate(-1)}>← Volver</button>
          </div>
        </header>
        
        <main className="cart-main">
          <div className="empty-cart">
            <div className="empty-icon">🏨</div>
            <h2>No se encontraron hoteles disponibles</h2>
            <p>Lo sentimos, no hay hoteles disponibles para tu búsqueda</p>
            <button className="explore-btn" onClick={() => navigate(-1)}>Volver a buscar</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="animated-background">
        <div className="cloud cloud-1">☁️</div>
        <div className="cloud cloud-2">☁️</div>
        <div className="cloud cloud-3">☁️</div>
        <div className="airplane airplane-1">✈️</div>
        <div className="airplane airplane-2">✈️</div>
      </div>

      <header className="cart-header">
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/')}>
            <span className="plane-icon">✈️</span>
            <h1>VolaYA</h1>
          </div>
          <button className="back-btn" onClick={() => navigate(-1)}>← Volver</button>
        </div>
      </header>

      <main className="cart-main">
        <div className="cart-title">
          <h1>🏨 Hoteles Disponibles</h1>
        </div>

        <div className="cart-content">
          <div className="tickets-section">
            <div className="section-header">
              <h2>✈️ Presupuesto de tu vuelo</h2>
              <p className="flight-cost">Costo total vuelo + servicios: {formatPrice(costoVueloServicios)}</p>
            </div>

            {selectedHotels.length > 0 && (
              <>
                <div className="section-header">
                  <h2>🏨 Hoteles Seleccionados ({selectedHotels.length})</h2>
                </div>
                <div className="tickets-container">
                  {selectedHotels.map((hotel) => (
                    <div key={`selected-${hotel.id}`} className="ticket">
                      <div className="ticket-left">
                        <div className="ticket-header">
                          <div className="hotel-info">
                            <span className="hotel-name">{hotel.nombre}</span>
                            <span className="hotel-location">{hotel.ciudad_nombre}, {hotel.país_nombre}</span>
                          </div>
                          <button className="remove-btn" onClick={() => removeHotel(hotel.id)}>🗑️</button>
                        </div>
                        <div className="hotel-details">
                          <div className="detail">
                            <span className="label">Dirección:</span>
                            <span className="value">{hotel.direccion}</span>
                          </div>
                          <div className="detail">
                            <span className="label">Precio por noche:</span>
                            <span className="value">{formatPrice(hotel.precio_noche)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="ticket-right">
                        <div className="price-section">
                          <div className="total-price">{formatPrice(hotel.precio_noche)}</div>
                          <div className="unit-price">por noche</div>
                        </div>
                        <div className="ticket-perforations">
                          {Array.from({ length: 20 }, (_, i) => (
                            <div key={i} className="perforation"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="section-header">
              <h2>🏨 Hoteles Disponibles ({hoteles.length})</h2>
            </div>

            <div className="tickets-container">
              {hoteles.map((hotel) => (
                <div key={hotel.id} className="ticket">
                  <div className="ticket-left">
                    <div className="ticket-header">
                      <div className="hotel-info">
                        <span className="hotel-name">{hotel.nombre}</span>
                        <span className="hotel-location">{hotel.ciudad_nombre}, {hotel.país_nombre}</span>
                      </div>
                      <button 
                        className="add-btn"
                        onClick={() => addHotel(hotel)}
                        disabled={selectedHotels.some(selected => selected.id === hotel.id)}
                      >
                        {selectedHotels.some(selected => selected.id === hotel.id) ? '✓' : '+'}
                      </button>
                    </div>
                    <div className="hotel-details">
                      <div className="detail">
                        <span className="label">Dirección:</span>
                        <span className="value">{hotel.direccion}</span>
                      </div>
                      <div className="detail">
                        <span className="label">Precio por noche:</span>
                        <span className="value">{formatPrice(hotel.precio_noche)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ticket-right">
                    <div className="price-section">
                      <div className="total-price">{formatPrice(hotel.precio_noche)}</div>
                      <div className="unit-price">por noche</div>
                    </div>
                    <div className="ticket-perforations">
                      {Array.from({ length: 20 }, (_, i) => (
                        <div key={i} className="perforation"></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="summary-section">
            <div className="summary-card">
              <h3>Resumen del Pedido</h3>

              <div className="summary-line">
                <span>Vuelo + servicios</span>
                <span>{formatPrice(costoVueloServicios)}</span>
              </div>


              <button className="checkout-btn" disabled={selectedHotels.length === 0}>
                💳 Proceder al Pago
              </button>

             
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Carrito;