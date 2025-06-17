// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../../../styles/Staff/Create.css';

// const CreatePacks = () => {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     descripcion: '',
//     personas: 1,
//     fecha_salida: '',
//     fecha_regreso: '',
//     hora_salida: '',
//     ciudad_salida: '',
//     ciudad_destino: '',
//     auto: '',
//     hotel: '',
//   });

//   const [ciudades, setCiudades] = useState([]);
//   const [autos, setAutos] = useState([]);
//   const [hoteles, setHoteles] = useState([]);

//   useEffect(() => {
//     const token = localStorage.getItem('access');
//     const headers = {
//       'Authorization': `Bearer ${token}`,
//       'Content-Type': 'application/json'
//     };

//     const fetchData = async () => {
//       try {
//         const [ciudadesRes, autosRes, hotelesRes] = await Promise.all([
//           fetch('http://127.0.0.1:8000/conseguir_ciudades/', { headers }),
//           fetch('http://127.0.0.1:8000/conseguir_autos/', { headers }),
//           fetch('http://127.0.0.1:8000/conseguir_hoteles/', { headers }),
//         ]);

//         const [ciudadesData, autosData, hotelesData] = await Promise.all([
//           ciudadesRes.json(),
//           autosRes.json(),
//           hotelesRes.json()
//         ]);

//         setCiudades(ciudadesData);
//         setAutos(autosData);
//         setHoteles(hotelesData);
//       } catch (error) {
//         console.error('Error al cargar datos:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({
//       ...prev,
//       [name]: name === 'personas' ? parseInt(value) : value
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('access');

//     fetch('http://127.0.0.1:8000/crear_paquete/', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(form)
//     })
//       .then(res => {
//         if (res.status === 201) {
//           alert('Paquete creado correctamente');
//           navigate('/staff/paquetes/lista');
//         } else {
//           return res.json().then(data => {
//             console.error('Errores:', data);
//             alert('Error al crear paquete');
//           });
//         }
//       })
//       .catch(err => {
//         console.error('Error al enviar datos:', err);
//       });
//   };

//   return (
//     <div className="container mt-5" style={{ maxWidth: '800px' }}>
//       <h2 className="mb-4 text-center create-title">Crear Paquete</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <label className="create-label">Descripción</label>
//           <textarea className="form-control" name="descripcion" value={form.descripcion} onChange={handleChange} />
//         </div>

//         <div className="mb-3">
//           <label className="create-label">Cantidad de personas</label>
//           <input type="number" className="form-control" name="personas" value={form.personas} onChange={handleChange} min="1" required />
//         </div>

//         <div className="mb-3">
//           <label className="create-label">Fecha de salida</label>
//           <input type="datetime-local" className="form-control" name="fecha_salida" value={form.fecha_salida} onChange={handleChange} required />
//         </div>

//         <div className="mb-3">
//           <label className="create-label">Fecha de regreso</label>
//           <input type="datetime-local" className="form-control" name="fecha_regreso" value={form.fecha_regreso} onChange={handleChange} required />
//         </div>

//         <div className="mb-3">
//           <label className="create-label">Hora de salida</label>
//           <input type="time" className="form-control" name="hora_salida" value={form.hora_salida} onChange={handleChange} required />
//         </div>

//         <div className="mb-3">
//           <label className="create-label">Ciudad de salida</label>
//           <select className="form-control" name="ciudad_salida" value={form.ciudad_salida} onChange={handleChange} required>
//             <option value="">Seleccionar ciudad</option>
//             {ciudades.map(ciudad => (
//               <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
//             ))}
//           </select>
//         </div>

//         <div className="mb-3">
//           <label className="create-label">Ciudad de destino</label>
//           <select className="form-control" name="ciudad_destino" value={form.ciudad_destino} onChange={handleChange} required>
//             <option value="">Seleccionar ciudad</option>
//             {ciudades.map(ciudad => (
//               <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
//             ))}
//           </select>
//         </div>

//         <div className="mb-3">
//           <label className="create-label">Auto (opcional)</label>
//           <select className="form-control" name="auto" value={form.auto} onChange={handleChange}>
//             <option value="">Ninguno</option>
//             {autos.map(auto => (
//               <option key={auto.id} value={auto.id}>{auto.modelo}</option>
//             ))}
//           </select>
//         </div>

//         <div className="mb-4">
//           <label className="create-label">Hotel (opcional)</label>
//           <select className="form-control" name="hotel" value={form.hotel} onChange={handleChange}>
//             <option value="">Ninguno</option>
//             {hoteles.map(hotel => (
//               <option key={hotel.id} value={hotel.id}>{hotel.nombre}</option>
//             ))}
//           </select>
//         </div>

//         <button type="submit" className="btn btn-primary w-100">
//           <div className="create-button">Guardar +</div>
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreatePacks;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Staff/Create.css';

const CreatePacks = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    descripcion: '',
    personas: 1,
    fecha_salida: '',
    fecha_regreso: '',
    hora_salida: '',
    ciudad_salida: '',
    ciudad_destino: '',
    auto: '',
    hotel: '',
  });

  const [ciudades, setCiudades] = useState([]);
  const [autos, setAutos] = useState([]);
  const [hoteles, setHoteles] = useState([]);
  const [hotelesFiltrados, setHotelesFiltrados] = useState([]); // 🆕 hoteles según ciudad destino

  useEffect(() => {
    const token = localStorage.getItem('access');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const fetchData = async () => {
      try {
        const [ciudadesRes, autosRes, hotelesRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/conseguir_ciudades/', { headers }),
          fetch('http://127.0.0.1:8000/conseguir_autos/', { headers }),
          fetch('http://127.0.0.1:8000/conseguir_hoteles/', { headers }),
        ]);

        const [ciudadesData, autosData, hotelesData] = await Promise.all([
          ciudadesRes.json(),
          autosRes.json(),
          hotelesRes.json()
        ]);

        setCiudades(ciudadesData);
        setAutos(autosData);
        setHoteles(hotelesData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === 'personas' ? parseInt(value) : value;

    setForm(prev => ({
      ...prev,
      [name]: parsedValue
    }));

    // 🧠 Filtrar hoteles cuando cambia la ciudad destino
    if (name === 'ciudad_destino') {
      const hotelesEnCiudad = hoteles.filter(hotel => hotel.ciudad === parseInt(value));
      setHotelesFiltrados(hotelesEnCiudad);
      setForm(prev => ({ ...prev, hotel: '' })); // Limpiar selección anterior
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');

    fetch('http://127.0.0.1:8000/crear_paquete/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
      .then(res => {
        if (res.status === 201) {
          alert('Paquete creado correctamente');
          navigate('/staff/paquetes/lista');
        } else {
          return res.json().then(data => {
            console.error('Errores:', data);
            alert('Error al crear paquete');
          });
        }
      })
      .catch(err => {
        console.error('Error al enviar datos:', err);
      });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '800px' }}>
      <h2 className="mb-4 text-center create-title">Crear Paquete</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="create-label">Descripción</label>
          <textarea className="form-control" name="descripcion" value={form.descripcion} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="create-label">Cantidad de personas</label>
          <input type="number" className="form-control" name="personas" value={form.personas} onChange={handleChange} min="1" required />
        </div>

        <div className="mb-3">
          <label className="create-label">Fecha de salida</label>
          <input type="datetime-local" className="form-control" name="fecha_salida" value={form.fecha_salida} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="create-label">Fecha de regreso</label>
          <input type="datetime-local" className="form-control" name="fecha_regreso" value={form.fecha_regreso} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="create-label">Hora de salida</label>
          <input type="time" className="form-control" name="hora_salida" value={form.hora_salida} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="create-label">Ciudad de salida</label>
          <select className="form-control" name="ciudad_salida" value={form.ciudad_salida} onChange={handleChange} required>
            <option value="">Seleccionar ciudad</option>
            {ciudades.map(ciudad => (
              <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="create-label">Ciudad de destino</label>
          <select className="form-control" name="ciudad_destino" value={form.ciudad_destino} onChange={handleChange} required>
            <option value="">Seleccionar ciudad</option>
            {ciudades.map(ciudad => (
              <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="create-label">Auto (opcional)</label>
          <select className="form-control" name="auto" value={form.auto} onChange={handleChange}>
            <option value="">Ninguno</option>
            {autos.map(auto => (
              <option key={auto.id} value={auto.id}>{auto.modelo}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="create-label">Hotel (opcional)</label>
          <select
            className="form-control"
            name="hotel"
            value={form.hotel}
            onChange={handleChange}
            disabled={!form.ciudad_destino}
          >
            <option value="">Ninguno</option>
            {hotelesFiltrados.map(hotel => (
              <option key={hotel.id} value={hotel.id}>{hotel.nombre}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          <div className="create-button">Guardar +</div>
        </button>
      </form>
    </div>
  );
};

export default CreatePacks;
