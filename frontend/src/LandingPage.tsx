import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    // The 'dark' class on <html> handles the toggle, 
    // but this div ensures the background fills the whole screen.
    <div className="flex min-h-screen w-full bg-[#000000]">
  <Sidebar />
  <main className="flex-1 p-8 overflow-y-auto bg-[#000000]">
      <Outlet /> 
  </main>
</div>
  );
};

export default LandingPage;
