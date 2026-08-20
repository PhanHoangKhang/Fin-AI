import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import finAiLogo from '../assets/LOGO Fin-AI with slogan.svg';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#FAF7F0]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(43,58,26,0.06)] border-b border-[#DDD5C7] py-3.5' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src={finAiLogo} 
            alt="FinAI Logo" 
            className="h-9 sm:h-10 w-auto object-contain transition-opacity duration-200 group-hover:opacity-90" 
          />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-[#2B3A1A] font-semibold text-sm font-sans">
          <a href="#features" className="hover:text-[#5C7140] transition-colors py-1">
            Tính năng
          </a>
          <a href="#how-it-works" className="hover:text-[#5C7140] transition-colors py-1">
            Cách thức hoạt động
          </a>
          <a href="#pricing" className="hover:text-[#5C7140] transition-colors py-1">
            Bảng giá
          </a>
        </nav>

        <div>
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 bg-[#2B3A1A] hover:bg-[#1E2B12] text-white border border-[#4A6330] px-5 sm:px-6 py-2.5 rounded-[10px] font-bold text-xs sm:text-sm transition-all duration-200 shadow-[0_4px_14px_rgba(43,58,26,0.18)] hover:shadow-[0_6px_20px_rgba(43,58,26,0.25)] active:scale-98 font-sans"
          >
            <span>Thử ngay</span> 
            <span aria-hidden="true" className="text-[#9CB953] font-bold">&rarr;</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;