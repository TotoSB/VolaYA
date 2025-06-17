
import '../../../styles/Staff/Create.css';
import React, { useEffect, useState } from 'react';

const ListPedidosPendientes = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access');

    fetch('http://127.0.0.1:8000/conseguir_paquetes_pendientes/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener pedidos');
        return res.json();
      })
      .then(data => {
        const pendientes = data.filter(p => p.estado === 'pendiente'); // Ajusta a tu modelo
        setPedidos(pendientes);
      })
      .catch(err => {
        console.error(err);
        setError('No se pudieron cargar los pedidos');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mt-5" style={{ maxWidth: '900px' }}>
      <h2 className="mb-4 text-center">Pedidos Pendientes</h2>

      {loading && <p>Cargando pedidos...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && pedidos.length === 0 && (
        <p className="text-center">No hay pedidos pendientes.</p>
      )}

      {!loading && pedidos.length > 0 && (
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(pedido => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{pedido.cliente_nombre || 'N/A'}</td>
                <td>{pedido.fecha}</td>
                <td>{pedido.estado}</td>
                <td>
                  {/* Puedes añadir botones para aprobar, rechazar, ver detalle, etc */}
                  <button className="btn btn-sm btn-primary">Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListPedidosPendientes;
