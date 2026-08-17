import React from 'react';
import type { CategoryOption } from '../types';

export interface DictionarySearchProps {
  searchKeyword: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedLetter: string;
  onLetterChange: (letter: string) => void;
  categories: CategoryOption[];
  alphabet: string[];
}

export const DictionarySearch: React.FC<DictionarySearchProps> = ({
  searchKeyword,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedLetter,
  onLetterChange,
  categories,
  alphabet,
}) => {
  return (
    <div className="space-y-4">
      {/* Ô nhập từ khóa tìm kiếm */}
      <div className="relative">
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Nhập thuật ngữ cần tìm (VD: RSI, P/E, cổ tức...)"
          className="w-full px-4 py-3 bg-white border border-[#E8EDE0] rounded-xl text-sm placeholder-[#7A7060]/60 text-[#2B3A1A] focus:outline-none focus:border-[#7A9B58] focus:ring-2 focus:ring-[#9CB953]/20 shadow-sm"
        />
      </div>

      {/* Lọc theo Danh mục (Category Pills) */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => onCategoryChange(cat.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === cat.key
                ? 'bg-[#3D5226] text-white shadow-sm'
                : 'bg-white text-[#5A5248] border border-[#E8EDE0] hover:border-[#9CB953] hover:text-[#2B3A1A]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Lọc theo Bảng chữ cái (A-Z) */}
      <div className="flex flex-wrap gap-1 pt-3 border-t border-[#E8EDE0]">
        <button
          type="button"
          onClick={() => onLetterChange('')}
          className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition ${
            !selectedLetter ? 'bg-[#3D5226] text-white' : 'text-[#7A7060] bg-white border border-[#E8EDE0] hover:bg-[#F5F8F0]'
          }`}
        >
          Tất cả
        </button>
        {alphabet.map((letter) => (
          <button
            key={letter}
            type="button"
            onClick={() => onLetterChange(letter === selectedLetter ? '' : letter)}
            className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition ${
              selectedLetter === letter
                ? 'bg-[#3D5226] text-white'
                : 'text-[#7A7060] bg-white border border-[#E8EDE0] hover:bg-[#F5F8F0] hover:text-[#2B3A1A]'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DictionarySearch;