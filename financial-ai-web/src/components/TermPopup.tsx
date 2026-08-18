import React, { useState, useEffect } from 'react';

// Từ điển định nghĩa thuật ngữ tài chính cho popup
export const TERM_DEFS: Record<string, { title: string; type: string; def: string; example: string }> = {
  'ebitda': {
    title: 'Chỉ số EBITDA',
    type: 'Hiệu quả hoạt động',
    def: 'Lợi nhuận trước lãi vay, thuế, khấu hao & phân bổ. Thước đo khả năng sinh lời thuần túy từ hoạt động kinh doanh cốt lõi của doanh nghiệp.',
    example: 'EBITDA HPG tăng 38% cho thấy hiệu quả sản xuất kinh doanh cốt lõi đang cải thiện mạnh mẽ, không bị phụ thuộc vào thủ thuật tài chính.'
  },
  'p/e': {
    title: 'Chỉ số P/E (Price-to-Earnings)',
    type: 'Định giá cổ phiếu',
    def: 'Hệ số giá trên thu nhập. Cho biết nhà đầu tư sẵn sàng trả bao nhiêu đồng cho 1 đồng lợi nhuận doanh nghiệp làm ra trong một năm.',
    example: 'P/E ở mức 12x nghĩa là với tốc độ lợi nhuận hiện tại, nhà đầu tư mất khoảng 12 năm để hòa vốn nếu giữ nguyên lợi nhuận.'
  },
  'roe': {
    title: 'Chỉ số ROE (Return on Equity)',
    type: 'Hiệu quả sinh lời',
    def: 'Tỷ suất sinh lời trên vốn chủ sở hữu. Đo lường cứ 100 đồng vốn cổ đông bỏ ra thì doanh nghiệp tạo ra được bao nhiêu đồng lợi nhuận ròng.',
    example: 'ROE duy trì trên 20% liên tục 3 năm là tiêu chuẩn của các doanh nghiệp đầu ngành có lợi thế cạnh tranh bền vững.'
  },
  'roa': {
    title: 'Chỉ số ROA (Return on Assets)',
    type: 'Hiệu quả tài sản',
    def: 'Tỷ suất sinh lời trên tổng tài sản. Cho biết doanh nghiệp kiếm được bao nhiêu đồng lợi nhuận từ mỗi 100 đồng tổng tài sản đang quản lý.',
    example: 'ROA ngân hàng trên 2% phản ánh chất lượng sử dụng tài sản cho vay rất xuất sắc.'
  },
  'nim': {
    title: 'Biên lãi thuần NIM (Net Interest Margin)',
    type: 'Ngành Ngân hàng',
    def: 'Chênh lệch giữa thu nhập lãi từ các khoản cho vay và chi phí trả lãi tiền gửi. Thước đo "độ dày" lợi nhuận của ngân hàng.',
    example: 'NIM của MBB phục hồi lên 4.6% nhờ chi phí huy động vốn CASA giá rẻ tăng trưởng tốt.'
  },
  'cagr': {
    title: 'Tăng trưởng kép CAGR',
    type: 'Tốc độ tăng trưởng',
    def: 'Tỷ lệ tăng trưởng kép hàng năm. Đo lường mức tăng trưởng bình quân hàng năm của doanh thu hoặc lợi nhuận qua nhiều năm.',
    example: 'FPT duy trì CAGR lợi nhuận khối công nghệ trên 25%/năm trong suốt 5 năm vừa qua.'
  },
  'margin call': {
    title: 'Lệnh Margin Call',
    type: 'Quản trị rủi ro',
    def: 'Yêu cầu của công ty chứng khoán buộc nhà đầu tư nộp thêm tiền hoặc bán bớt cổ phiếu khi tỷ lệ đòn bẩy chạm ngưỡng nguy hiểm.',
    example: 'Thị trường giảm đột ngột 30 điểm kích hoạt làn sóng Margin Call trên diện rộng.'
  },
  'dividend yield': {
    title: 'Tỷ suất cổ tức (Dividend Yield)',
    type: 'Thu nhập thụ động',
    def: 'Tỷ lệ phần trăm cổ tức tiền mặt trả cho mỗi cổ phiếu so với thị giá hiện tại của cổ phiếu đó.',
    example: 'Cổ phiếu nhiệt điện có Dividend Yield 9%/năm, cao hơn đáng kể so với lãi suất gửi tiết kiệm.'
  },
  'rsi': {
    title: 'Chỉ báo RSI (Relative Strength Index)',
    type: 'Phân tích kỹ thuật',
    def: 'Chỉ số sức mạnh tương đối (0–100). Đo lường tốc độ và biên độ biến động giá để nhận diện vùng Quá Mua (>70) hoặc Quá Bán (<30).',
    example: 'RSI chạm ngưỡng 28 cho tín hiệu cổ phiếu đã rơi vào vùng quá bán sâu và có thể sớm bật hồi kỹ thuật.'
  },
  'yoy': {
    title: 'Tăng trưởng YoY (Year-over-Year)',
    type: 'Thống kê so sánh',
    def: 'Chỉ số so sánh số liệu cùng kỳ năm nay so với cùng kỳ năm ngoái (ví dụ Quý 3/2026 so với Quý 3/2025).',
    example: 'Lợi nhuận ròng tăng 45% YoY thể hiện đà phục hồi vượt bậc so với giai đoạn khó khăn năm trước.'
  }
};

interface PopupState {
  term: string;
  x: number;
  y: number;
  width: number;
}

export const GlobalTermListener: React.FC = () => {
  const [popup, setPopup] = useState<PopupState | null>(null);

  useEffect(() => {
    // 1. Lắng nghe sự kiện bôi đen văn bản (Selection)
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const selectedText = selection.toString().trim().toLowerCase();
      if (!selectedText || selectedText.length < 2) return;

      // Tìm xem từ được chọn có khớp với danh mục thuật ngữ không
      let matchedKey: string | null = null;
      if (TERM_DEFS[selectedText]) {
        matchedKey = selectedText;
      } else {
        const found = Object.keys(TERM_DEFS).find(k => 
          selectedText === k || 
          selectedText.includes(k) || 
          k.includes(selectedText)
        );
        if (found) matchedKey = found;
      }

      if (matchedKey) {
        try {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setPopup({
            term: matchedKey,
            x: rect.left + rect.width / 2 + window.scrollX,
            y: rect.bottom + window.scrollY + 8,
            width: rect.width
          });
        } catch {
          // Ignored
        }
      }
    };

    // 2. Lắng nghe sự kiện click vào các badge [data-term]
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.closest('.term-popup-container')) {
        return;
      }

      const termEl = target.closest('[data-term]') as HTMLElement;
      if (termEl) {
        const term = termEl.getAttribute('data-term');
        if (term && TERM_DEFS[term.toLowerCase()]) {
          const rect = termEl.getBoundingClientRect();
          setPopup({
            term: term.toLowerCase(),
            x: rect.left + rect.width / 2 + window.scrollX,
            y: rect.bottom + window.scrollY + 8,
            width: rect.width
          });
          return;
        }
      }

      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        setPopup(null);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  if (!popup || !TERM_DEFS[popup.term]) return null;

  const def = TERM_DEFS[popup.term];
  const popupWidth = 320;
  const screenPadding = 16;
  const leftPos = Math.max(
    screenPadding, 
    Math.min(window.innerWidth - popupWidth - screenPadding, popup.x - popupWidth / 2)
  );
  const topPos = popup.y;
  const arrowOffset = Math.max(16, Math.min(popupWidth - 24, popup.x - leftPos - 8));

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-transparent" 
        onClick={() => setPopup(null)} 
      />
      
      {/* Cửa sổ Popup Tinh gọn - Đơn giản - Không icon rườm rà */}
      <div
        className="term-popup-container absolute z-50 animate-fade-in font-sans"
        style={{ left: leftPos, top: topPos, width: popupWidth }}
      >
        {/* Mũi tên trỏ lên (Arrow) */}
        <div 
          className="absolute -top-1.5 w-3 h-3 bg-[#2B3A1A] rotate-45 border-t border-l border-[#7A9B58]/40 z-20"
          style={{ left: arrowOffset }}
        />

        <div className="relative bg-[#2B3A1A] text-[#F5F0E8] rounded-2xl shadow-xl p-5 border border-[#5C7140]/50">
          
          {/* Header: Tiêu đề + Phân loại + Nút đóng */}
          <div className="flex items-start justify-between gap-3 mb-2.5 pb-2.5 border-b border-[#3D5226]">
            <div>
              <h4 className="font-serif text-base font-bold text-white leading-snug">
                {def.title}
              </h4>
              {def.type && (
                <span className="text-xs text-[#9CB953] font-medium block mt-0.5">
                  {def.type}
                </span>
              )}
            </div>

            <button 
              onClick={() => setPopup(null)} 
              className="text-[#9CB953] hover:text-white w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0 text-base leading-none"
              aria-label="Đóng"
            >
              ✕
            </button>
          </div>

          {/* Body: Định nghĩa liền mạch */}
          <p className="text-xs leading-relaxed text-[#EDE8DF] mb-3">
            {def.def}
          </p>

          {/* Ví dụ thực tế liền mạch, không chia khối hộp */}
          <div className="border-l-2 border-[#7A9B58] pl-3 py-0.5 text-xs text-[#D8E2CE] italic leading-relaxed mb-3">
            Ví dụ: "{def.example}"
          </div>

          {/* Footer nhỏ gọn */}
          <div className="pt-2 border-t border-[#3D5226] text-[11px] text-[#8A9678]">
            Tra cứu bởi FinAI Intelligence
          </div>

        </div>
      </div>
    </>
  );
};

export default GlobalTermListener;
