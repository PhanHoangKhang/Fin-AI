import React from 'react';
import { Navbar } from '../components/Navbar';

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
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#3D5226] rounded-lg flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 10L5 6L8 8L12 3" stroke="#9CB953" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="3" r="1.5" fill="#9CB953"/>
                </svg>
              </div>
              <span className="text-lg font-bold text-[#2B3A1A]">FinAI</span>
              <span className="text-[#7A7060] text-sm ml-2">— Đọc thông minh hơn, đầu tư tự tin hơn.</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-[#7A7060]">
              <a href="#" className="hover:text-[#3D5226] transition-colors">Chính sách</a>
              <a href="#" className="hover:text-[#3D5226] transition-colors">Điều khoản</a>
              <a href="#" className="hover:text-[#3D5226] transition-colors">Liên hệ</a>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-[#A09888]">
            &copy; {new Date().getFullYear()} FinAI Intelligence. MVP Designed for Student FinTech Competition.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;