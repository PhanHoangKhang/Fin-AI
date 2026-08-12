import React from 'react';
import { Navbar } from '../components/Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="w-full min-h-screen bg-white text-slate-800 font-sans flex flex-col justify-between overflow-x-hidden">
      <Navbar />
      <main className="grow w-full">
        {children}
      </main>
      <footer className="w-full border-t border-slate-100 py-8 text-center text-xs text-slate-400 mt-auto">
        © 2026 FinAI Intelligence. MVP Designed for Student FinTech Competition.
      </footer>
    </div>
  );
};