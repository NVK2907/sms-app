import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-6 min-h-screen lg:ml-0">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout;
