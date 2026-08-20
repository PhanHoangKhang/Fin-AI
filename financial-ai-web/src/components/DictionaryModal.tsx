import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Term } from '../types';

interface DictionaryModalProps {
  term: Term | null;
  onClose: () => void;
}

export const DictionaryModal: React.FC<DictionaryModalProps> = ({ term, onClose }) => {
  return (
    <AnimatePresence>
      {term && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-[#2B3A1A]/30 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="bg-white border border-[#E8EDE0] rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-[#A09888] hover:text-[#2B3A1A] hover:bg-[#F5F8F0] p-1.5 rounded-full transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div>
              <span className="text-xs font-bold text-[#7A9B58] bg-[#F5F8F0] px-3 py-1 rounded-full uppercase tracking-wider">
                {term.categoryName || term.category}
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#2B3A1A] mt-2">
                {term.term}
              </h2>
              <p className="text-sm text-[#7A7060] font-medium mt-1">
                {term.fullName}
              </p>
            </div>

            <div className="space-y-4 border-t border-[#F0EDE6] pt-4 text-sm text-[#5A5248] leading-relaxed">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A7060] mb-2">
                  Định nghĩa chuyên sâu
                </h4>
                <p className="leading-relaxed text-sm text-[#2B3A1A]">{term.fullDefinition}</p>
              </div>

              {term.example && (
                <div className="bg-[#F8F5F0] p-4 rounded-2xl border border-[#E8EDE0]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D5226] mb-1.5 flex items-center gap-1.5">
                    <span>💡</span>
                    <span>Ví dụ thực chiến trên thị trường</span>
                  </h4>
                  <p className="text-[#3D5226] text-xs leading-relaxed font-medium">
                    {term.example}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};