import React from 'react';
import type { Term } from '../types';

interface DictionaryModalProps {
  term: Term | null;
  onClose: () => void;
}

export const DictionaryModal: React.FC<DictionaryModalProps> = ({ term, onClose }) => {
  if (!term) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-xl p-6 max-w-lg w-full space-y-5 shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div>
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {term.categoryName || term.category}
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            {term.term}
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            {term.fullName}
          </p>
        </div>

        <div className="space-y-4 border-t border-slate-100 pt-4 text-sm text-slate-700 leading-relaxed">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Định nghĩa
            </h4>
            <p>{term.fullDefinition}</p>
          </div>

          {term.example && (
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Ví dụ thực tế
              </h4>
              <p className="text-slate-600 text-xs leading-normal">
                {term.example}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};