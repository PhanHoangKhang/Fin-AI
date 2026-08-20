import React from 'react';
import { motion } from 'framer-motion';
import type { Term } from '../types';

interface DictionaryCardProps {
  term: Term;
  onClick: (term: Term) => void;
}

export const DictionaryCard: React.FC<DictionaryCardProps> = ({ term, onClick }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      whileHover={{ 
        y: -4, 
        scale: 1.02,
        borderColor: "rgba(122, 155, 88, 0.8)",
        boxShadow: "0 12px 24px -6px rgba(43, 58, 26, 0.08)"
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(term)}
      className="group p-5 bg-white border border-[#E8EDE0]/80 rounded-2xl transition-colors cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-[#7A9B58] uppercase tracking-wider bg-[#F5F8F0] px-2.5 py-0.5 rounded-md">
            {term.categoryName || term.category}
          </span>
          <span className="text-xs font-bold text-[#A09888] font-mono group-hover:text-[#3D5226] transition-colors">
            {term.firstLetter}
          </span>
        </div>
        <h3 className="text-lg font-bold text-[#2B3A1A] group-hover:text-[#3D5226] transition-colors">
          {term.term}
        </h3>
        <p className="text-xs text-[#7A7060] mb-3 font-medium">
          {term.fullName}
        </p>
        <p className="text-xs text-[#5A5248] line-clamp-2 leading-relaxed">
          {term.shortDefinition}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[#F0EDE6] flex items-center justify-between text-xs text-[#7A7060] group-hover:text-[#3D5226] font-bold">
        <span>Xem chi tiết</span>
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </div>
    </motion.div>
  );
};