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
        // Filtramos los no pagados (pendientes)
        const pendientes = data.filter(p => !p.pagado);
        setPedidos(pendientes);
      })
      .catch(err => {
        console.error(err);
        setError('No se pudieron cargar los pedidos');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mt-5" style={{ maxWidth: '1200px' }}>
      <h2 className="mb-4 text-center">Pedidos Pendientes</h2>

      {loading && <p>Cargando pedidos...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && pedidos.length === 0 && (
        <p className="text-center">No hay pedidos.</p>
      )}

      {!loading && pedidos.length > 0 && (
        <table className="table table-bordered table-sm">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Personas</th>
              <th>Fecha Salida</th>
              <th>Fecha Regreso</th>
              <th>Ciudad Salida</th>
              <th>Ciudad Salida Nombre</th>
              <th>Ciudad Destino</th>
              <th>Ciudad Destino Nombre</th>
              <th>Hora Salida</th>
              <th>Auto</th>
              <th>Hotel</th>
              <th>Hotel Nombre</th>
              <th>Pagado</th>
              <th>Total</th>
              <th>ID Usuario</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(pedido => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{pedido.descripcion || '-'}</td>
                <td>{pedido.personas}</td>
                <td>{new Date(pedido.fecha_salida).toLocaleDateString()}</td>
                <td>{new Date(pedido.fecha_regreso).toLocaleDateString()}</td>
                <td>{pedido.ciudad_salida}</td>
                <td>{pedido.ciudad_salida_nombre}</td>
                <td>{pedido.ciudad_destino}</td>
                <td>{pedido.ciudad_destino_nombre}</td>
                <td>{pedido.hora_salida}</td>
                <td>{pedido.auto || '-'}</td>
                <td>{pedido.hotel}</td>
                <td>{pedido.hotel_nombre}</td>
                <td>{pedido.pagado ? 'Sí' : 'No'}</td>
                <td>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(pedido.total)}</td>
                <td>{pedido.id_usuario}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListPedidosPendientes;
