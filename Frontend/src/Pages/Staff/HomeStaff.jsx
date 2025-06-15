import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarStaff from '../../components/Staff/SidebarStaff';
import HeaderStaff from '../../components/Staff/HeaderStaff';
import '../../styles/Staff/Home.css';

const HomeStaff = () => {
  return (
    <div className="staff-layout">
      <SidebarStaff />
      <div className="staff-content">
        <HeaderStaff />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HomeStaff;
