import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import finAiLogo from '../assets/LOGO Fin-AI with slogan.svg';

export const Navbar = () => {
  const [darkNav, setDarkNav] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setDarkNav(true);
      } else {
        setDarkNav(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${darkNav ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src={finAiLogo} 
            alt="FinAI Logo" 
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105" 
          />
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-[#2B3A1A] font-medium font-sans">
          <a href="#features" className="hover:text-[#7A9B58] transition-colors">Sản phẩm</a>
          <a href="#how-it-works" className="hover:text-[#7A9B58] transition-colors">Dành cho F0</a>
          <a href="#pricing" className="hover:text-[#7A9B58] transition-colors">Gói dịch vụ</a>
        </div>

        <Link to="/dashboard" className="bg-[#3D5226] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#2B3A1A] transition-all duration-200 hover:shadow-lg hover:-translate-y-px flex items-center gap-2 font-sans">
          Thử ngay <span>&rarr;</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;