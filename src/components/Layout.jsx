import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="main-content">
        <header className="mobile-header">
          <div className="logo-icon"></div>
          <h2>FinFlow</h2>
        </header>
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
