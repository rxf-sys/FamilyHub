import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Hauptnavigation */}
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (für Desktop immer sichtbar, für mobile ein-/ausblendbar) */}
        <div className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 fixed md:relative z-10 w-64 h-[calc(100vh-4rem)] transition-transform duration-300 ease-in-out
        `}>
          <Sidebar />
        </div>
        
        {/* Hauptinhalt */}
        <div className="flex-1 overflow-auto">
          {/* Mobile Sidebar Toggle */}
          <div className="md:hidden p-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          
          {/* Seiten-Content über Outlet */}
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;