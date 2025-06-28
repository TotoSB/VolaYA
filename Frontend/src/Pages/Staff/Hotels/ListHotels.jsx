import React, { useEffect, useState } from 'react';

const ListHotels = () => {
  const [hoteles, setHoteles] = useState([]);
  const [hotelEditar, setHotelEditar] = useState(null);

  // Cargar hoteles al inicio
  const cargarHoteles = () => {
    const token = localStorage.getItem('access');

    fetch('http://127.0.0.1:8000/conseguir_hoteles/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al obtener hoteles');
        }
        return res.json();
      })
      .then((data) => {
        setHoteles(data);
      })
      .catch((err) => {
        console.error(err);
        setHoteles([]);
      });
  };

  useEffect(() => {
    cargarHoteles();
  }, []);

  const handleEditar = (hotel) => {
    setHotelEditar(hotel);
  };

  const handleUpdate = () => {
    const token = localStorage.getItem('access');

    fetch(`http://127.0.0.1:8000/actualizar_hotel/${hotelEditar.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(hotelEditar),
    })
      .then((res) => {
        if (res.ok) {
          alert('Hotel actualizado correctamente');
          setHotelEditar(null);
          cargarHoteles(); // recargar la lista
        } else {
          alert('Error al actualizar hotel');
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-3 fw-bold gap-2" style={{ color: "#0d6efd", fontSize: "25px" }}>
        <i className="bx bx-hotel" style={{ fontSize: "2rem", color: "#0d6efd" }}></i>
        Lista De Hoteles
      </div>

      {/* Tabla de hoteles */}
      <div className="table-responsive" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {hoteles.length > 0 ? (
          <table className="table table-striped table-bordered align-middle text-center">
            <thead className="table-primary text-center">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Dirección</th>
                <th>Precio</th>
                <th>Personas</th>
                <th>Ciudad</th>
                <th>País</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {hoteles.map((hotel) => (
                <tr key={hotel.id}>
                  <td>{hotel.id}</td>
                  <td>{hotel.nombre}</td>
                  <td>{hotel.descripcion}</td>
                  <td>{hotel.direccion}</td>
                  <td>${hotel.precio_noche}</td>
                  <td>{hotel.personas}</td>
                  <td>{hotel.ciudad_nombre}</td>
                  <td>{hotel.pais_nombre}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-3">
                      <button
                        onClick={() => handleEditar(hotel)}
                        className="btn btn-primary btn-sm"
                        style={{ backgroundColor: "transparent", borderColor: "#0d6efd" }}
                        title="Modificar"
                      >
                        <i className="bx bx-edit" style={{ fontSize: "1.2rem", color: "#0d6efd" }}></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center fw-bold" style={{ color: '#0d6efd' }}>
            No se encontraron hoteles para mostrar.
          </p>
        )}
      </div>

      {/* Formulario de edición */}
      {hotelEditar && (
        <div className="mt-5">
          <h4 className="mb-3">Editar Hotel ID {hotelEditar.id}</h4>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                value={hotelEditar.nombre}
                onChange={(e) => setHotelEditar({ ...hotelEditar, nombre: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-control"
                value={hotelEditar.descripcion}
                onChange={(e) => setHotelEditar({ ...hotelEditar, descripcion: e.target.value })}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Dirección</label>
              <input
                type="text"
                className="form-control"
                value={hotelEditar.direccion}
                onChange={(e) => setHotelEditar({ ...hotelEditar, direccion: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Precio por Noche</label>
              <input
                type="number"
                className="form-control"
                value={hotelEditar.precio_noche}
                onChange={(e) => setHotelEditar({ ...hotelEditar, precio_noche: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Personas</label>
              <input
                type="number"
                className="form-control"
                value={hotelEditar.personas}
                onChange={(e) => setHotelEditar({ ...hotelEditar, personas: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-success">Guardar Cambios</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={() => setHotelEditar(null)}>Cancelar</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ListHotels;
