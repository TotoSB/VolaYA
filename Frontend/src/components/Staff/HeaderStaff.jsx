// src/components/Public/staff/HeaderStaff.jsx
import React from 'react';
import { Button } from 'react-bootstrap';
import '../../styles/Staff/Header.css'
import { useNavigate } from 'react-router-dom';

const HeaderStaff = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  
  const navigate = useNavigate()
   const handleHome = () => {
    navigate("/")
  };
  return (
    <header className="staff-header">
      <div className="staff-header__left">
        <h2>Panel Administrativo</h2>
      </div>
      <div className="staff-header__right">
        <Button variant="danger" onClick={handleLogout}>
          Cerrar sesión
        </Button>
         <Button variant="primary" onClick={handleHome}>
          Ir al inicio
          
        </Button>
      </div>
    </header>
  );
};

export default HeaderStaff;
