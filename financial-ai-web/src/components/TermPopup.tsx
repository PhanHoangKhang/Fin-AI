import React, { useEffect, useState, useCallback } from 'react';

export const TERM_DEFS: Record<string, { title: string; def: string; example: string; type?: string }> = {
  'p/e': {
    title: 'Chỉ số P/E (Price-to-Earnings)',
    def: 'Tỷ lệ giá thị trường chia cho lợi nhuận ròng trên mỗi cổ phiếu (EPS). P/E đo lường mức độ nhà đầu tư sẵn sàng trả cho 1 đồng lợi nhuận.',
    example: 'P/E = 12× nghĩa là bạn đang trả 12 đồng để nhận về 1 đồng lợi nhuận mỗi năm. P/E ngành thép trung bình thường ở mức 10–14×.',
    type: 'Định giá cổ phiếu'
  },
  'ebitda': {
    title: 'Chỉ số EBITDA',
    def: 'Lợi nhuận trước lãi vay, thuế, khấu hao & phân bổ. Thước đo khả năng sinh lời thuần túy từ hoạt động kinh doanh cốt lõi của doanh nghiệp.',
    example: 'EBITDA HPG tăng 38% cho thấy hiệu quả sản xuất kinh doanh cốt lõi đang cải thiện mạnh mẽ, không bị phụ thuộc vào thủ thuật tài chính.',
    type: 'Hiệu quả hoạt động'
  },
  'nim': {
    title: 'NIM (Net Interest Margin)',
    def: 'Biên lãi suất thuần — chênh lệch giữa lãi suất cho vay đầu ra và lãi suất huy động vốn đầu vào, thước đo then chốt của ngành ngân hàng.',
    example: 'NIM thu hẹp từ 5.1% xuống 4.6% phản ánh áp lực ngân hàng phải tăng lãi suất tiền gửi để giữ chân khách hàng.',
    type: 'Tài chính ngân hàng'
  },
  'roe': {
    title: 'ROE (Return on Equity)',
    def: 'Tỷ suất sinh lời trên vốn chủ sở hữu — cho biết 100 đồng vốn cổ đông đầu tư tạo ra được bao nhiêu đồng lợi nhuận ròng sau thuế.',
    example: 'ROE 14.2% là mức rất tích cực trong nhóm ngành sản xuất công nghiệp nặng (thường chỉ đạt 8–10%).',
    type: 'Sinh lời vốn'
  },
  'roa': {
    title: 'ROA (Return on Assets)',
    def: 'Tỷ suất sinh lời trên tổng tài sản — đo lường hiệu quả khai thác mọi tài sản, nguồn lực hiện có của doanh nghiệp.',
    example: 'ROA 22% của mảng phần mềm FPT cao gấp đôi trung bình ngành công nghệ thông tin Đông Nam Á.',
    type: 'Hiệu quả tài sản'
  },
  'cagr': {
    title: 'CAGR (Tăng trưởng kép hàng năm)',
    def: 'Compound Annual Growth Rate — tốc độ tăng trưởng bình quân lũy kế mỗi năm trong một giai đoạn nhiều năm liên tiếp.',
    example: 'CAGR tín dụng đạt 22% trong 3 năm liên tiếp thể hiện đà mở rộng danh mục cho vay vô cùng bền vững.',
    type: 'Động lực tăng trưởng'
  },
  'margin call': {
    title: 'Margin Call (Lệnh ký quỹ bổ sung)',
    def: 'Yêu cầu từ công ty chứng khoán buộc nhà đầu tư phải nộp thêm tiền hoặc tài sản ký quỹ khi giá trị danh mục vay margin giảm xuống dưới ngưỡng an toàn.',
    example: 'Cổ phiếu giảm mạnh quá ngưỡng an toàn → tỷ lệ tài khoản < 30% → CTCK kích hoạt Margin Call bắt buộc bán giải chấp.',
    type: 'Quản trị rủi ro'
  },
  'dividend yield': {
    title: 'Dividend Yield (Suất cổ tức)',
    def: 'Tỷ lệ cổ tức tiền mặt hàng năm chia cho giá thị trường hiện tại của cổ phiếu (tính theo %).',
    example: 'Cổ tức 2,000đ, giá thị trường 42,000đ → Dividend Yield ≈ 4.8%/năm, cao hơn mức lãi suất tiết kiệm ngắn hạn.',
    type: 'Thu nhập thụ động'
  },
  'yoy': {
    title: 'YoY (So sánh cùng kỳ)',
    def: 'Year-over-Year — phương pháp so sánh số liệu kỳ hiện tại với đúng kỳ đó của năm trước nhằm loại bỏ yếu tố mùa vụ.',
    example: 'Doanh thu Q2 tăng 28% YoY nghĩa là so với Q2 năm ngoái, doanh thu tăng trưởng thêm 28%.',
    type: 'Chỉ số so sánh'
  },
  'rsi': {
    title: 'RSI (Chỉ số Sức mạnh Tương đối)',
    def: 'Relative Strength Index (0–100) — đo lường quán tính và biên độ biến động giá. Trên 70 là quá mua (Overbought), dưới 30 là quá bán (Oversold).',
    example: 'RSI = 28 cho thấy cổ phiếu rơi vào vùng quá bán sâu, có xác suất cao xuất hiện nhịp hồi kỹ thuật ngắn hạn.',
    type: 'Phân tích kỹ thuật'
  },
};

export interface PopupState {
  term: string;
  x: number;
  y: number;
  isFixed?: boolean;
}

export const findTermInText = (text: string): string | null => {
  const lower = text.toLowerCase().trim();
  for (const key of Object.keys(TERM_DEFS)) {
    if (lower.includes(key) || lower === key) return key;
  }
  return null;
};

export const GlobalTermListener: React.FC = () => {
  const [popup, setPopup] = useState<PopupState | null>(null);

  // Xử lý bôi đen bằng chuột
  const handleMouseUp = useCallback((e: MouseEvent) => {
    // Nếu click vào trong popup thì không tắt hoặc tính lại
    const target = e.target as HTMLElement;
    if (target && target.closest('.term-popup-container')) {
      return;
    }

    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const text = sel.toString().trim();
    if (!text || text.length < 2) return;
    const term = findTermInText(text);
    if (!term) return;
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    setPopup({
      term,
      x: rect.left + rect.width / 2,
      y: rect.bottom + window.scrollY,
    });
  }, []);

  // Xử lý click trực tiếp vào từ ngữ có class liquid-glass-highlight
  const handleClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target) return;
    const termEl = target.closest('[data-term]') as HTMLElement;
    if (termEl) {
      const term = termEl.getAttribute('data-term');
      if (term && TERM_DEFS[term.toLowerCase()]) {
        const rect = termEl.getBoundingClientRect();
        setPopup({
          term: term.toLowerCase(),
          x: rect.left + rect.width / 2,
          y: rect.bottom + window.scrollY,
        });
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('click', handleClick);
    };
  }, [handleMouseUp, handleClick]);

  if (!popup) return null;

  const def = TERM_DEFS[popup.term];
  if (!def) return null;

  // Tính vị trí căn giữa popup so với điểm bôi đen
  const popupWidth = 360;
  const leftPos = Math.max(16, Math.min(popup.x - popupWidth / 2, window.innerWidth - popupWidth - 16));
  const topPos = popup.y + 12;
  const arrowOffset = Math.max(20, Math.min(popup.x - leftPos - 8, popupWidth - 28));

  return (
    <>
      {/* Backdrop overlay nhẹ để đóng khi click ra ngoài */}
      <div 
        className="fixed inset-0 z-40 bg-black/5" 
        onClick={() => setPopup(null)} 
      />
      
      {/* Cửa sổ Popup Liquid-Glass */}
      <div
        className="term-popup-container absolute z-50 animate-fade-in font-sans"
        style={{ left: leftPos, top: topPos, width: popupWidth }}
      >
        {/* Mũi tên trỏ lên (Arrow) */}
        <div 
          className="absolute -top-2 w-4 h-4 bg-[#2B3A1A] rotate-45 border-t border-l border-[#9CB953]/50 z-20"
          style={{ left: arrowOffset }}
        />

        <div className="relative bg-[#2B3A1A]/95 backdrop-blur-2xl text-[#F5F0E8] rounded-2xl shadow-[0_20px_50px_rgba(43,58,26,0.45)] overflow-hidden border border-[#9CB953]/40 ring-1 ring-white/10">
          
          {/* Top Liquid Shimmer Line */}
          <div className="h-[2.5px] w-full bg-gradient-to-r from-[#9CB953]/40 via-[#9CB953] to-[#7A9B58]" />

          {/* Header */}
          <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-[#3D5226]/80 bg-white/[0.03]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 bg-[#3D5226] text-[#9CB953] text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border border-[#9CB953]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9CB953] live-dot"></span>
                  AI Giải Thích
                </span>
                {def.type && (
                  <span className="text-[10px] text-[#A09888] font-medium">
                    • {def.type}
                  </span>
                )}
              </div>
              <h4 className="font-serif text-[15px] font-bold text-white leading-snug">
                {def.title}
              </h4>
            </div>

            <button 
              onClick={() => setPopup(null)} 
              className="text-[#7A9B58] hover:text-white hover:bg-[#3D5226] w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0 text-lg leading-none mt-0.5"
              aria-label="Đóng"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4 space-y-3">
            <p className="text-xs leading-relaxed text-[#D8D0C0]">
              {def.def}
            </p>

            {/* Khối ví dụ thực tế */}
            <div className="bg-[#3D5226]/70 rounded-xl p-3.5 border border-[#9CB953]/25 backdrop-blur-md">
              <div className="text-[10px] font-bold tracking-wider text-[#9CB953] uppercase mb-1 flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Ví dụ thực tế
              </div>
              <p className="text-[11px] text-[#E8EDE0] leading-relaxed italic">
                "{def.example}"
              </p>
            </div>

            {/* Hint footer */}
            <div className="flex items-center justify-between text-[10px] text-[#7A9B58] pt-1">
              <span>💡 Thử bôi đen thêm: P/E, ROE, NIM</span>
              <span className="font-semibold text-[#9CB953]">FinAI Assistant</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default GlobalTermListener;
