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
      className="group p-5 bg-white border border-slate-200/80 rounded-xl hover:border-slate-300 hover:shadow-sm transition cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            {term.categoryName || term.category}
          </span>
          <span className="text-xs font-semibold text-slate-300 group-hover:text-slate-400 transition">
            {term.firstLetter}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-700 transition">
          {term.term}
        </h3>
        <p className="text-xs text-slate-500 mb-3 font-medium">
          {term.fullName}
        </p>
        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {term.shortDefinition}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-600 font-medium">
        <span>Chi tiết</span>
        <span>→</span>
      </div>
    </div>
  );
};