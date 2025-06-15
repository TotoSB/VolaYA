import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home'
import HomeStaff from './Pages/Staff/HomeStaff';
import ListCars from './Pages/Staff/Cars/ListCars';
import CreateCars from './Pages/Staff/Cars/CreateCars';
import 'boxicons/css/boxicons.min.css';

function App() {
  return (
    <Routes>
      <Route path="/*" element={<Home />} />

      <Route path="/staff" element={<HomeStaff />}>
        <Route index element={<p>Bienvenido al panel de administración</p>} />
        <Route path="autos/lista" element={<ListCars />} />
        <Route path="autos/crear" element={<CreateCars />} />
      </Route>
    </Routes>
  );
}

export default App;
