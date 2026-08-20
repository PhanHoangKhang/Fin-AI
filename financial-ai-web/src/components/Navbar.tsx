import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import finAiLogo from '../assets/LOGO Fin-AI with slogan.svg';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#FAF7F0]/90 backdrop-blur-md shadow-sm border-b border-[#E8EDE0]/80 py-3.5' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.img 
            whileHover={{ scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            src={finAiLogo} 
            alt="FinAI Logo" 
            className="h-10 w-auto object-contain" 
          />
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-[#2B3A1A] font-semibold text-sm font-sans">
          <a href="#features" className="hover:text-[#7A9B58] transition-colors relative py-1">
            Sản phẩm
          </a>
          <a href="#how-it-works" className="hover:text-[#7A9B58] transition-colors relative py-1">
            Dành cho F0
          </a>
          <a href="#pricing" className="hover:text-[#7A9B58] transition-colors relative py-1">
            Gói dịch vụ
          </a>
        </div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link 
            to="/dashboard" 
            className="bg-[#3D5226] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#2B3A1A] transition-all duration-200 hover:shadow-md flex items-center gap-2 font-sans"
          >
            <span>Thử ngay</span> 
            <span>&rarr;</span>
          </Link>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;