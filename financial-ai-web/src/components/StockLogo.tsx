import React, { useState } from 'react';

interface StockLogoProps {
  ticker?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  alt?: string;
  fallback?: 'avatar' | 'none';
}

export const isStockTicker = (ticker?: string): boolean => {
  if (!ticker) return false;
  const t = ticker.trim().toUpperCase();
  // Check if it's 3-4 alphanumeric letters and not a general category word
  const nonStocks = [
    'VĨ MÔ', 'VIMO', 'VI MO', 'NGÂN HÀNG', 'THỊ TRƯỜNG', 
    'BẤT ĐỘNG SẢN', 'TIN TỨC', 'KINH TẾ', 'CHỨNG KHOÁN',
    'THÉP', 'XUẤT KHẨU', 'DOANH NGHIỆP', 'VĨ MÔ TIỀN TỆ'
  ];
  if (nonStocks.includes(t)) return false;
  return /^[A-Z0-9]{3,4}$/.test(t);
};

export const StockLogo: React.FC<StockLogoProps> = ({
  ticker,
  size = 'md',
  className = '',
  alt,
  fallback = 'avatar',
}) => {
  const [hasError, setHasError] = useState(false);
  const cleanTicker = ticker ? ticker.trim().toUpperCase() : '';
  const validTicker = isStockTicker(cleanTicker);

  const sizeClasses = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-base',
  };

  if (!validTicker) {
    if (fallback === 'none') return null;
    return (
      <div
        className={`shrink-0 rounded-full bg-[#5C7140] text-white flex items-center justify-center font-bold font-mono shadow-2xs select-none ${sizeClasses[size]} ${className}`}
        title={cleanTicker || 'Tài chính'}
      >
        {cleanTicker ? cleanTicker.slice(0, 3) : 'AI'}
      </div>
    );
  }

  const logoUrl = `https://finance.vietstock.vn/image/${cleanTicker}`;

  if (hasError) {
    if (fallback === 'none') return null;
    return (
      <div
        className={`shrink-0 rounded-full bg-[#5C7140] text-white flex items-center justify-center font-bold font-mono shadow-2xs select-none ${sizeClasses[size]} ${className}`}
        title={cleanTicker}
      >
        {cleanTicker.slice(0, 3)}
      </div>
    );
  }

  return (
    <div
      className={`shrink-0 rounded-full bg-white p-0.5 border border-[#E0DDD6] shadow-2xs overflow-hidden flex items-center justify-center ${sizeClasses[size]} ${className}`}
      title={alt || cleanTicker}
    >
      <img
        src={logoUrl}
        alt={alt || cleanTicker}
        onError={() => setHasError(true)}
        className="w-full h-full object-contain rounded-full"
        loading="lazy"
      />
    </div>
  );
};

export default StockLogo;
