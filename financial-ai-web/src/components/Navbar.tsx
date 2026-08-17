import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${darkNav ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#3D5226] rounded-xl flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M2 10L5 6L8 8L12 3" stroke="#9CB953" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="3" r="1.5" fill="#9CB953"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-[#2B3A1A] font-sans">
            Fin<span className="text-[#3D5226]">AI</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-[#2B3A1A] font-medium font-sans">
          <a href="#features" className="hover:text-[#7A9B58] transition-colors">Sản phẩm</a>
          <a href="#how-it-works" className="hover:text-[#7A9B58] transition-colors">Dành cho F0</a>
          <a href="#pricing" className="hover:text-[#7A9B58] transition-colors">Gói dịch vụ</a>
          <a href="#learn" className="hover:text-[#7A9B58] transition-colors">Học đầu tư</a>
        </div>

        <Link to="/dashboard" className="bg-[#3D5226] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#2B3A1A] transition-all duration-200 hover:shadow-lg hover:-translate-y-px flex items-center gap-2 font-sans">
          Thử ngay <span>&rarr;</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;