import React, { useEffect, useState } from 'react';

function Package() {
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">🌍 Explora Nuestros Paquetes</h2>

      {loading ? (
        <p className="text-center">Cargando paquetes...</p>
      ) : paquetes.length === 0 ? (
        <p className="text-center">No hay paquetes disponibles por el momento.</p>
      ) : (
        <div className="row g-4">
          {paquetes.map((paquete) => (
            <div key={paquete.id} className="col-md-6 col-lg-4">
              <div className="card shadow-sm h-100 border-0">
                <div className="card-body">
                  <h5 className="card-title text-primary">
                    <i className='bx bxs-plane-take-off me-2'></i>
                    {paquete.descripcion}
                  </h5>
                  <ul className="list-unstyled">
                    <li><i className='bx bx-map me-2'></i><strong>Origen:</strong> {paquete.ciudad_salida_nombre}</li>
                    <li><i className='bx bx-map-pin me-2'></i><strong>Destino:</strong> {paquete.ciudad_destino_nombre}</li>
                    <li><i className='bx bx-calendar me-2'></i><strong>Salida:</strong> {new Date(paquete.fecha_salida).toLocaleDateString()}</li>
                    <li><i className='bx bx-calendar-check me-2'></i><strong>Regreso:</strong> {new Date(paquete.fecha_regreso).toLocaleDateString()}</li>
                    <li><i className='bx bx-hotel me-2'></i><strong>Hotel:</strong> {paquete.hotel_nombre}</li>
                    <li><i className='bx bx-car me-2'></i><strong>Auto:</strong> {paquete.auto_nombre || 'Sin auto'}</li>
                    <li><i className='bx bx-user me-2'></i><strong>Personas:</strong> {paquete.personas}</li>
                    <li><i className='bx bx-money me-2'></i><strong>Total:</strong> ${paquete.total}</li>
                  </ul>
                </div>
                <div className="card-footer bg-transparent border-0 text-end">
                  <button className="btn btn-outline-primary btn-sm">
                    <i className='bx bx-info-circle me-1'></i>Ver más
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
