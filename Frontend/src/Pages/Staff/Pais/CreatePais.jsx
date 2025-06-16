import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Staff/Create.css';

const CreatePais = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '',
  });

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

    fetch('http://127.0.0.1:8000/crear_pais/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (res.status === 201) {
          alert('País creado correctamente');
          navigate('/staff/paises/lista');
        } else {
          return res.json().then(data => {
            console.error('Errores:', data);
            alert('Error al crear país');
          });
        }
      })
      .catch(err => {
        console.error('Error al enviar datos:', err);
      });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 text-center create-title">Crear País</h2>
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

        <button type="submit" className="btn btn-primary w-100">
          <div className="create-button">Guardar +</div>
        </button>
      </form>
    </div>
  );
};

export default CreatePais;
