import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#f3f7fa] text-stone-900 font-sans antialiased overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-[#f3f7fa]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
