import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/Pagar.css';

const Pagar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reservaId, total } = location.state || {};

  const [formData, setFormData] = useState({
    razon_social: '',
    cuil: '',
    provincia: '',
    ciudad: '',
    calle: '',
    numero_calle: '',
    piso: '',
    departamento: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('access');
    if (!token) {
      alert('No estás logeado.');
      return navigate('/login');
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/hacer_pago/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reserva_id: reservaId,
          ...formData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || JSON.stringify(data.errors) || 'Error en el pago';
        throw new Error(errorMsg);
      }

      alert('Pago y factura generados con éxito.');
      navigate('/');

    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="formulario-pago">
      <h1>Pago Y Facturación</h1>
      <form onSubmit={handleSubmit}>
        <label>Razón Social:
          <input type="text" name="razon_social" value={formData.razon_social} onChange={handleChange} required />
        </label>
        <label>CUIL:
          <input type="text" name="cuil" value={formData.cuil} onChange={handleChange} required />
        </label>
        <label>Provincia:
          <input type="text" name="provincia" value={formData.provincia} onChange={handleChange} required />
        </label>
        <label>Ciudad:
          <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} required />
        </label>
        <label>Calle:
          <input type="text" name="calle" value={formData.calle} onChange={handleChange} required />
        </label>
        <label>Número de calle:
          <input type="text" name="numero_calle" value={formData.numero_calle} onChange={handleChange} required />
        </label>
        <label>Piso:
          <input type="text" name="piso" value={formData.piso} onChange={handleChange} />
        </label>
        <label>Departamento:
          <input type="text" name="departamento" value={formData.departamento} onChange={handleChange} />
        </label>

        <p>El total a pagar es: ${total}</p>

        <button type="submit">Confirmar y Pagar</button>
      </form>
    </div>
  );
};

export default Pagar;
