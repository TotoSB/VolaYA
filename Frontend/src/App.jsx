import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import HomeStaff from './Pages/Staff/HomeStaff';
import ListCars from './Pages/Staff/Cars/ListCars';
import ListHotels from './Pages/Staff/Hotels/ListHotels';
import ListPacks from './Pages/Staff/Packs/ListPacks';
import CreateCars from './Pages/Staff/Cars/CreateCars';
import CreateHotels from './Pages/Staff/Hotels/CreateHotels';
import CreatePacks from './Pages/Staff/Packs/CreatePacks';
import HotelesDisponibles from './Pages/HotelesDisponibles';
import ProtectedRoute from './components/ProtectedRoute'; // 👈 Asegurate de tener esto
import 'boxicons/css/boxicons.min.css';
import Carrito from './Pages/Carrito';
import ListPais from './Pages/Staff/Paises/ListPais';
import CreatePais from './Pages/Staff/Paises/Createpais';
import ListCiudad from './Pages/Staff/Ciudades/ListCiudad';
import CreateCiudad from './Pages/Staff/Ciudades/CreateCiudad';
import ListPedidosPendientes from './Pages/Staff/Pendientes/ListPedidosPendientes';
import ListAviones from './Pages/Staff/Aviones/ListAviones';
import CreateAviones from './Pages/Staff/Aviones/CreateAviones';
import ListVuelo from './Pages/Staff/Vuelos/ListVuelo';
import CreateVuelo from './Pages/Staff/Vuelos/CreateVuelo';

function App() {
  return (
    <Routes>
      <Route path="/*" element={<Home />} />
      <Route path="/hoteles-disponibles" element={<HotelesDisponibles />} />
      <Route path="/carrito" element={<Carrito />} />

      <Route
        path="/staff/*"
        element={
          <ProtectedRoute requireStaff={true}>
            <HomeStaff />
          </ProtectedRoute>
        }
      >
        <Route index element={<p>Bienvenido al panel de administración</p>} />
        <Route path="autos/lista" element={<ListCars />} />
        <Route path="autos/agregar" element={<CreateCars />} />
        <Route path="hoteles/lista" element={<ListHotels />} />
        <Route path="hoteles/agregar" element={<CreateHotels />} />
        <Route path="paquetes/lista" element={<ListPacks />} />
        <Route path="paquetes/crear" element={<CreatePacks />} />
        <Route path="pais/lista" element={<ListPais />} />
        <Route path="pais/crear" element={<CreatePais />} />
        <Route path="ciudad/lista" element={<ListCiudad />} />
        <Route path="ciudad/crear" element={<CreateCiudad/>} />
        <Route path="paquetes_pendientes" element={<ListPedidosPendientes/>} />
        <Route path="vuelos/lista" element={<ListVuelo/>} />
        <Route path="vuelos/crear" element={<CreateVuelo />} />
        <Route path="aviones/lista" element={<ListAviones />} />
        <Route path="aviones/crear" element={<CreateAviones />} />
      </Route>
    </Routes>
  );
}

export default App;
