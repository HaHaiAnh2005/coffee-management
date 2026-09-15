import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { PromoPopup } from '../components/common/PromoPopup';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f3f7fa] text-stone-900 font-sans antialiased">
      <Navbar />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
      <Footer />
      <PromoPopup />
    </div>
  );
};
