import React from "react";
import type { ChangeEvent, FormEvent } from "react";

interface PortfolioFormProps {
  newTicker: string;
  newPrice: string;
  onTickerChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPriceChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export const PortfolioForm: React.FC<PortfolioFormProps> = ({
  newTicker,
  newPrice,
  onTickerChange,
  onPriceChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Mã CP (vd: VIC)"
          value={newTicker}
          onChange={onTickerChange}
          className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 focus:bg-white text-slate-800 uppercase placeholder:normal-case transition-colors"
        />
      </div>
      <div className="w-full sm:w-44">
        <input
          type="number"
          step="0.1"
          placeholder="Giá vốn (vd: 45.0)"
          value={newPrice}
          onChange={onPriceChange}
          className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 focus:bg-white text-slate-800 transition-colors"
        />
      </div>
      <button
        type="submit"
        className="px-5 py-2 bg-[#2B3A1A] hover:bg-[#3D5226] text-white text-sm font-medium rounded-lg transition-colors shadow-sm self-stretch sm:self-auto"
      >
        Thêm vị thế
      </button>
    </form>
  );
};