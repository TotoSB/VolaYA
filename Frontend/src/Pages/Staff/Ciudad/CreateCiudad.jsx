import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Staff/Create.css';

const CreateCiudad = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
    pais: '',
    latitud: '',
    longitud: '',
  });

  const [paises, setPaises] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // ⏳ Estado de carga

  useEffect(() => {
    const token = localStorage.getItem('access');
    fetch('http://127.0.0.1:8000/conseguir_paises/', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .then(data => setPaises(data))
      .catch(err => console.error('Error al cargar países:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');

    setIsLoading(true); // ⏳ Activar loading

    fetch('http://127.0.0.1:8000/crear_ciudad/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then(res => {
        setIsLoading(false); // ✅ Finalizar loading
        if (res.status === 201) {
          alert('Ciudad creada correctamente');
          navigate('/staff/Ciudad/ListCiudad');
        } else {
          return res.json().then(data => {
            console.error('Errores:', data);
            alert('Error al crear ciudad');
          });
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.error('Error al enviar datos:', err);
        alert('Ocurrió un error al enviar los datos');
      });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 text-center create-title">Crear Ciudad</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="create-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="create-label">País</label>
          <select
            className="form-control"
            name="pais"
            value={form.pais}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar país</option>
            {paises.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="create-label">Latitud</label>
          <input
            className="form-control"
            type="number"
            step="0.000001"
            name="latitud"
            value={form.latitud}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="create-label">Longitud</label>
          <input
            className="form-control"
            type="number"
            step="0.000001"
            name="longitud"
            value={form.longitud}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
          <div className="create-button">
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              'Guardar +'
            )}
          </div>
        </button>
      </form>
    </div>
  );
};

export default CreateCiudad;
