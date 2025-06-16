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

function App() {
  return (
    <Routes>
      <Route path="/*" element={<Home />} />
      <Route path="/hoteles-disponibles" element={<HotelesDisponibles />} />

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
      </Route>
    </Routes>
  );
}

export default App;
