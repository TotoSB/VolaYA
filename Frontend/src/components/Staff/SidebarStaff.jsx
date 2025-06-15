import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Staff/Sidebar.css';

const SidebarStaff = () => {
  const [openMenu, setOpenMenu] = useState('');

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? '' : menu);
  };

  return (
    <aside className="staff-sidebar">
      <h2>Panel Admin</h2>
      <nav>
        <ul>
          <li>
            <button className="sidebar-toggle" onClick={() => toggleMenu('autos')}>
              <i className='bx bx-car'></i> Autos
              <i className={`bx bx-chevron-${openMenu === 'autos' ? 'up' : 'down'}`}></i>
            </button>
            {openMenu === 'autos' && (
              <ul className="sidebar-submenu">
                <li><Link to="/staff/autos/lista">Listar Autos</Link></li>
                <li><Link to="/staff/autos/crear">Crear Auto</Link></li>
              </ul>
            )}
          </li>

          <li>
            <button className="sidebar-toggle" onClick={() => toggleMenu('hoteles')}>
              <i className='bx bx-hotel'></i> Hoteles
              <i className={`bx bx-chevron-${openMenu === 'hoteles' ? 'up' : 'down'}`}></i>
            </button>
            {openMenu === 'hoteles' && (
              <ul className="sidebar-submenu">
                <li><Link to="/staff/hoteles/lista">Listar Hoteles</Link></li>
                <li><Link to="/staff/hoteles/crear">Crear Hotel</Link></li>
              </ul>
            )}
          </li>

          <li>
            <button className="sidebar-toggle" onClick={() => toggleMenu('paquetes')}>
              <i className='bx bx-package'></i> Paquetes
              <i className={`bx bx-chevron-${openMenu === 'paquetes' ? 'up' : 'down'}`}></i>
            </button>
            {openMenu === 'paquetes' && (
              <ul className="sidebar-submenu">
                <li><Link to="/staff/paquetes/lista">Listar Paquetes</Link></li>
                <li><Link to="/staff/paquetes/crear">Crear Paquete</Link></li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarStaff;
