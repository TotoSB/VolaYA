import React, { useEffect, useState } from 'react';
import '../../../styles/Staff/Create.css';

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
    <div className="container mt-4">
      <div
        className="d-flex align-items-center mb-3 fw-bold gap-2"
        style={{ color: "#0d6efd", fontSize: "25px" }}
      >
        <i className="bx bx-cart-alt" style={{ fontSize: "2rem", color: "#0d6efd" }}></i>
        Pedidos Pendientes
      </div>

      <div className="table-responsive" style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {loading && <p className="text-center fw-bold text-secondary">Cargando pedidos...</p>}
        {error && <div className="alert alert-danger text-center">{error}</div>}
        {!loading && pedidos.length === 0 && (
          <p className="text-center fw-bold" style={{ color: "#0d6efd" }}>
            No hay pedidos pendientes.
          </p>
        )}

        {!loading && pedidos.length > 0 && (
          <table className="table table-striped table-bordered align-middle text-center">
            <thead className="table-primary text-center">
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
                  <td>
                    {new Intl.NumberFormat('es-AR', {
                      style: 'currency',
                      currency: 'ARS',
                    }).format(pedido.total)}
                  </td>
                  <td>{pedido.id_usuario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ListPedidosPendientes;
