// src/layouts/UserLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';

const UserLayout = () => {
  return (
    <>
      <Header />
      <div className="content-wrapper">
        <Outlet />
      </div>
    </>
  );
};

export default UserLayout;
