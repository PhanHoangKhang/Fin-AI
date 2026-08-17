import React from 'react';
import type { Term } from '../types';

interface DictionaryCardProps {
  term: Term;
  onClick: (term: Term) => void;
}

export const DictionaryCard: React.FC<DictionaryCardProps> = ({ term, onClick }) => {
  return (
    <div
      onClick={() => onClick(term)}
      className="group p-5 bg-white border border-[#E8EDE0]/80 rounded-xl hover:border-[#7A9B58] hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium text-[#A09888] uppercase tracking-wider">
            {term.categoryName || term.category}
          </span>
          <span className="text-xs font-semibold text-[#A09888]/70 group-hover:text-[#A09888] transition">
            {term.firstLetter}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-[#2B3A1A] group-hover:text-[#3D5226] transition">
          {term.term}
        </h3>
        <p className="text-xs text-[#7A7060] mb-3 font-medium">
          {term.fullName}
        </p>
        <p className="text-sm text-[#5A5248] line-clamp-2 leading-relaxed">
          {term.shortDefinition}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-[#F0EDE6] flex items-center justify-between text-xs text-[#A09888] group-hover:text-[#5A5248] font-medium">
        <span>Chi tiết</span>
        <span>→</span>
      </div>
    </div>
  );
};