import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const ProtectedLayout = ({ user, onLogout }) => {
  return (
    <>
      <Navbar user={user} onLogout={onLogout} />
      <Outlet context={{user}} /> {/* This renders the child page (DSRFormPage, HistoryPage, EditDSRPage, etc.) */}
    </>
  );
};

export default ProtectedLayout;