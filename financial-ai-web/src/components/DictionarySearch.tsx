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
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
        />
      </div>

      {/* Lọc theo Danh mục (Category Pills) */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => onCategoryChange(cat.key)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              selectedCategory === cat.key
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Lọc theo Bảng chữ cái (A-Z) */}
      <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => onLetterChange('')}
          className={`px-2 py-1 text-xs rounded font-medium ${
            !selectedLetter ? 'bg-slate-200 text-slate-900' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          Tất cả
        </button>
        {alphabet.map((letter) => (
          <button
            key={letter}
            type="button"
            onClick={() => onLetterChange(letter === selectedLetter ? '' : letter)}
            className={`px-2 py-1 text-xs rounded font-medium ${
              selectedLetter === letter
                ? 'bg-slate-900 text-white'
                : 'text-slate-500 hover:bg-slate-100'
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