import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Staff/Create.css'; // Importamos el mismo CSS

const CreateHotels = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    ciudad: '',
    descripcion: '',
    personas: 1,
    precio_noche: '',
    direccion: ''
  });

  const [ciudades, setCiudades] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access');
    fetch('http://127.0.0.1:8000/conseguir_ciudades/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => setCiudades(data))
      .catch(err => console.error('Error al cargar ciudades:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');

    fetch('http://127.0.0.1:8000/crear_hotel/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
      .then(res => {
        if (res.status === 201) {
          alert('Hotel creado correctamente');
          navigate('/staff/hoteles/lista');
        } else {
          return res.json().then(data => {
            console.error('Errores:', data);
            alert('Error al crear hotel');
          });
        }
      })
      .catch(err => {
        console.error('Error al enviar datos:', err);
      });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '700px' }}>
      <h2 className="mb-4 text-center create-title">Agregar Hoteles</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="create-label">Nombre</label>
          <input type="text" className="form-control" name="nombre" value={form.nombre} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="create-label">Ciudad</label>
            <select
            className="form-control"
            name="ciudad"
            value={form.ciudad}
            onChange={(e) => handleChange({ target: { name: 'ciudad', value: parseInt(e.target.value) } })}
            required
            >
            <option value="">Seleccionar ciudad</option>
            {ciudades.map(ciudad => (
                <option key={ciudad.id} value={ciudad.id}>
                {ciudad.nombre}
                </option>
            ))}
            </select>
        </div>

        <div className="mb-3">
          <label className="create-label">Descripción</label>
          <textarea className="form-control" name="descripcion" value={form.descripcion} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="create-label">Capacidad (personas)</label>
          <input type="number" className="form-control" name="personas" value={form.personas} onChange={handleChange} min="1" required />
        </div>

        <div className="mb-3">
          <label className="create-label">Precio por noche</label>
          <input type="number" className="form-control" name="precio_noche" value={form.precio_noche} onChange={handleChange} required />
        </div>

        <div className="mb-4">
          <label className="create-label">Dirección</label>
          <input type="text" className="form-control" name="direccion" value={form.direccion} onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          <div className="create-button">Guardar +</div>
        </button>
      </form>
    </div>
  );
};

export default CreateHotels;
