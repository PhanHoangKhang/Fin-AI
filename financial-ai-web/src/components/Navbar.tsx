import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="w-full flex items-center justify-between px-8 md:px-16 lg:px-24 py-6">
      <div className="flex items-center gap-12">
        <a href='/' className="flex items-center gap-2">
          <div className="w-9 h-9 bg-cyan-800 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-sm">
            F
          </div>
          <span className="font-extrabold text-2xl text-slate-900 tracking-tight">FinAI</span>
        </a>
        <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600">
          <a href="#features" className="hover:text-cyan-800 transition">Sản phẩm</a>
          <a href="#how-it-works" className="hover:text-cyan-800 transition">Dành cho F0</a>
          <a href="#pricing" className="hover:text-cyan-800 transition">Gói dịch vụ</a>
          <a href="#learn" className="hover:text-cyan-800 transition">Học đầu tư</a>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm font-semibold">
        <a href='/dashboard' className="bg-cyan-800 hover:bg-cyan-900 text-white px-6 py-2.5 rounded-full transition shadow-sm flex items-center gap-1">
          Thử ngay <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </nav>
  );
};