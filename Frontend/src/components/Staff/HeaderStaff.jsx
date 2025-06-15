// src/components/Public/staff/HeaderStaff.jsx
import React from 'react';
import { Button } from 'react-bootstrap';
import '../../styles/Staff/Header.css'

const HeaderStaff = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
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
      </div>
    </header>
  );
};

export default HeaderStaff;
