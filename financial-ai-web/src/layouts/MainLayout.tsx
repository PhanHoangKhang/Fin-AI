import React from 'react';
import { Navbar } from '../components/Navbar';
import finAiLogo from '../assets/LOGO Fin-AI with slogan.svg';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E8] text-[#2B3A1A] font-sans selection:bg-[#9CB953] selection:text-[#2B3A1A]">
      <Navbar />
      
      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-white border-t border-[#E0DDD6] py-12">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img 
                src={finAiLogo} 
                alt="FinAI Logo" 
                className="h-10 w-auto object-contain" 
              />
            </div>
            
            <div className="flex items-center gap-6 text-sm text-[#7A7060]">
              <a href="#" className="hover:text-[#3D5226] transition-colors">Chính sách</a>
              <a href="#" className="hover:text-[#3D5226] transition-colors">Điều khoản</a>
              <a href="#" className="hover:text-[#3D5226] transition-colors">Liên hệ</a>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-[#A09888]">
            &copy; {new Date().getFullYear()} FinAI Intelligence. MVP Designed for Attacker 2026
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;