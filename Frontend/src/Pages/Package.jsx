import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Package.css";

function Package() {
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaquetes = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/conseguir_paquetes_en_venta/');
        const data = await response.json();
        setPaquetes(data);
      } catch (error) {
        console.error('Error al obtener paquetes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaquetes();
  }, []);

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString('es-AR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  return (
    <div className="container paquetes-container">
      <h2 className="titulo-principal">Explora Nuestros Paquetes</h2>

      {loading ? (
        <p className="text-center">Cargando paquetes...</p>
      ) : paquetes.length === 0 ? (
        <p className="text-center">No hay paquetes disponibles por el momento.</p>
      ) : (
        <div className="row g-4">
          {paquetes.map((paquete) => (
            <div key={paquete.id} className="col-md-6 col-lg-4">
              <div className="card paquete-card shadow h-100">
                <div className="card-body">
                  <h5 className="card-title text-primary fw-bold mb-3">
                    {paquete.descripcion || `Paquete #${paquete.id}`}
                  </h5>
                  <ul className="list-unstyled paquete-list">
                    <li><i className="bx bx-user"></i> <strong>Personas:</strong> {paquete.personas}</li>
                    <li><i className="bx bx-plane-alt"></i> <strong>Vuelo ida:</strong> {formatearFecha(paquete.vuelo_ida_fecha)} - {paquete.vuelo_ida}</li>
                    <li><i className="bx bx-plane-alt"></i> <strong>Vuelo vuelta:</strong> {formatearFecha(paquete.vuelo_vuelta_fecha)} - {paquete.vuelo_vuelta}</li>
                    <li><i className="bx bx-building-house"></i> <strong>Hotel:</strong> {paquete.hotel}</li>
                    <li><i className="bx bx-car"></i> <strong>Auto:</strong> {paquete.auto || 'Sin auto'}</li>
                    <li><i className="bx bx-dollar-circle"></i> <strong>Total:</strong> ${parseFloat(paquete.total).toLocaleString()}</li>
                  </ul>
                </div>
                <div className="card-footer text-end bg-transparent border-0">
                  <button
                    className="btn btn-outline-primary btn-sm boton-reserva"
                    onClick={() =>
                      navigate('/reservar_asientos', {
                        state: {
                          vueloIda: paquete.vuelo_ida_obj,
                          vueloVuelta: paquete.vuelo_vuelta_obj,
                          personas: paquete.personas,
                          destinoId: paquete.destino_id,
                          auto: paquete.auto,
                          autoSeleccionadoId: paquete.auto_id,
                          desdePaquete: true,
                        }
                      })
                    }
                  >
                    Elegir asientos
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Package;