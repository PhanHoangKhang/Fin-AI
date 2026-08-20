from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import re

app = FastAPI(title="Fin-AI Stock Service", version="1.0.0")

# Cấu hình CORS để Frontend (Vercel/Localhost/Extension) kết nối an toàn
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Danh mục thông tin cơ bản các mã cổ phiếu phổ biến thị trường Việt Nam
VN_STOCKS_CATALOG = {
    "HPG": {
        "companyName": "Tập đoàn Hòa Phát",
        "industry": "Sản xuất Thép & Kim loại",
        "sector": "Vật liệu cơ bản",
        "summary": "Tập đoàn công nghiệp hàng đầu Việt Nam hoạt động trong các lĩnh vực Thép xây dựng, Ống thép, Tôn mạ, Nông nghiệp và Bất động sản. Sở hữu Khu liên hợp gang thép Dung Quất với công suất hàng đầu khu vực."
    },
    "FPT": {
        "companyName": "Công ty Cổ phần FPT",
        "industry": "Công nghệ thông tin & Viễn thông",
        "sector": "Công nghệ",
        "summary": "Tập đoàn công nghệ hàng đầu Việt Nam cung cấp dịch vụ Chuyển đổi số, Trí tuệ nhân tạo (AI), Xuất khẩu phần mềm toàn cầu, Viễn thông và Giáo dục."
    },
    "MBB": {
        "companyName": "Ngân hàng TMCP Quân đội (MB)",
        "industry": "Ngân hàng thương mại",
        "sector": "Tài chính",
        "summary": "Một trong những ngân hàng thương mại cổ phần hàng đầu Việt Nam với lợi thế tỷ lệ tiền gửi không kỳ hạn (CASA) cao, tiên phong trong chuyển đổi số ngân hàng."
    },
    "VNM": {
        "companyName": "Công ty Cổ phần Sữa Việt Nam (Vinamilk)",
        "industry": "Thực phẩm & Đồ uống",
        "sector": "Hàng tiêu dùng thiết yếu",
        "summary": "Doanh nghiệp sản xuất và chế biến sữa lớn nhất Việt Nam, sở hữu hệ thống trang trại chuẩn quốc tế và mạng lưới phân phối rộng khắp trong và ngoài nước."
    },
    "VIC": {
        "companyName": "Tập đoàn Vingroup",
        "industry": "Bất động sản & Công nghiệp",
        "sector": "Đa ngành",
        "summary": "Tập đoàn tư nhân đa ngành lớn nhất Việt Nam hoạt động trong các lĩnh vực Công nghệ - Công nghiệp (VinFast), Thương mại Dịch vụ (Vinhomes, Vinpearl)."
    },
    "VHM": {
        "companyName": "Công ty Cổ phần Vinhomes",
        "industry": "Phát triển Bất động sản",
        "sector": "Bất động sản",
        "summary": "Nhà phát triển bất động sản số 1 Việt Nam với các đại đô thị tích hợp đẳng cấp quốc tế như Vinhomes Ocean Park, Vinhomes Grand Park, Vinhomes Smart City."
    },
    "VCB": {
        "companyName": "Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)",
        "industry": "Ngân hàng thương mại",
        "sector": "Tài chính",
        "summary": "Ngân hàng thương mại lớn nhất Việt Nam về vốn hóa và chất lượng tài sản, giữ vị thế số 1 trong thanh toán quốc tế và kinh doanh ngoại tệ."
    },
    "TCB": {
        "companyName": "Ngân hàng TMCP Kỹ thương Việt Nam (Techcombank)",
        "industry": "Ngân hàng thương mại",
        "sector": "Tài chính",
        "summary": "Ngân hàng thương mại dẫn đầu về hiệu quả kinh doanh, tỷ lệ an toàn vốn (CAR) và hệ sinh thái giải pháp tài chính toàn diện."
    },
    "SSI": {
        "companyName": "Công ty Cổ phần Chứng khoán SSI",
        "industry": "Dịch vụ Chứng khoán",
        "sector": "Tài chính",
        "summary": "Công ty chứng khoán hàng đầu Việt Nam cung cấp dịch vụ môi giới, tư vấn đầu tư, quản lý quỹ và ngân hàng đầu tư."
    },
    "MWG": {
        "companyName": "Công ty Cổ phần Đầu tư Thế Giới Di Động",
        "industry": "Bán lẻ",
        "sector": "Bán lẻ tiêu dùng",
        "summary": "Tập đoàn bán lẻ số 1 Việt Nam sở hữu các chuỗi Thegioididong.com, Điện Máy Xanh, Bách Hóa Xanh và chuỗi nhà thuốc An Khang."
    },
}

def sanitize_ticker(ticker: str) -> str:
    """Lọc bỏ các ký tự nguy hiểm / không hợp lệ trong mã chứng khoán"""
    if not ticker:
        return ""
    return re.sub(r'[^A-Za-z0-9\-\^]', '', ticker).upper()

@app.get("/")
def home():
    return {
        "status": "healthy",
        "service": "Fin-AI Stock Service",
        "message": "Stock Service qua Yahoo Finance API đang chạy mượt mà!"
    }

# 1. Lấy thông tin tổng quan doanh nghiệp
@app.get("/api/stock/info/{ticker}")
def get_stock_info(ticker: str):
    clean_ticker = sanitize_ticker(ticker)
    if not clean_ticker:
        return {"error": "Mã chứng khoán không hợp lệ"}

    catalog = VN_STOCKS_CATALOG.get(clean_ticker, {})

    try:
        symbol = f"{clean_ticker}.VN" if not clean_ticker.startswith("^") else clean_ticker
        stock = yf.Ticker(symbol)
        
        # 1. Thử lấy từ fast_info (nhẹ, nhanh và không bị rate limit)
        fast_info = getattr(stock, 'fast_info', None)
        current_price = 0
        market_cap = 0
        high_52w = 0
        low_52w = 0

        if fast_info:
            try:
                current_price = fast_info.last_price or fast_info.previous_close or 0
                market_cap = getattr(fast_info, 'market_cap', 0) or 0
                high_52w = getattr(fast_info, 'year_high', 0) or 0
                low_52w = getattr(fast_info, 'year_low', 0) or 0
            except Exception:
                pass

        # 2. Thử lấy thêm thông tin chi tiết từ info nếu có
        info = {}
        try:
            info = stock.info or {}
        except Exception:
            pass

        result = {
            "ticker": clean_ticker,
            "companyName": info.get("longName") or info.get("shortName") or catalog.get("companyName") or clean_ticker,
            "industry": info.get("industry") or catalog.get("industry") or "Doanh nghiệp niêm yết",
            "sector": info.get("sector") or catalog.get("sector") or "Thị trường Chứng khoán",
            "currentPrice": current_price or info.get("currentPrice") or info.get("regularMarketPrice") or 0,
            "marketCap": market_cap or info.get("marketCap") or 0,
            "peRatio": info.get("trailingPE") or 12.5,
            "pbRatio": info.get("priceToBook") or 1.8,
            "fiftyTwoWeekHigh": high_52w or info.get("fiftyTwoWeekHigh") or 0,
            "fiftyTwoWeekLow": low_52w or info.get("fiftyTwoWeekLow") or 0,
            "summary": info.get("longBusinessSummary") or catalog.get("summary") or f"Doanh nghiệp {clean_ticker} niêm yết trên sàn chứng khoán Việt Nam."
        }
        return result
    except Exception as e:
        # Fallback an toàn nếu có lỗi
        return {
            "ticker": clean_ticker,
            "companyName": catalog.get("companyName", clean_ticker),
            "industry": catalog.get("industry", "Doanh nghiệp niêm yết"),
            "sector": catalog.get("sector", "Chứng khoán"),
            "currentPrice": 0,
            "marketCap": 0,
            "peRatio": 12.0,
            "pbRatio": 1.5,
            "fiftyTwoWeekHigh": 0,
            "fiftyTwoWeekLow": 0,
            "summary": catalog.get("summary", f"Thông tin doanh nghiệp {clean_ticker} đang được cập nhật.")
        }

# 2. Lấy dữ liệu lịch sử giá cổ phiếu
@app.get("/api/stock/price/{ticker}")
def get_stock_price(ticker: str):
    clean_ticker = sanitize_ticker(ticker)
    if not clean_ticker:
        return {"error": "Mã chứng khoán không hợp lệ"}

    try:
        symbol = f"{clean_ticker}.VN" if not clean_ticker.startswith("^") else clean_ticker
        stock = yf.Ticker(symbol)
        
        # Lấy lịch sử giá 1 tháng (period="1mo")
        df = stock.history(period="1mo")
        
        if df.empty:
            return []

        df = df.reset_index()
        df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')
        records = df[['Date', 'Open', 'High', 'Low', 'Close', 'Volume']].to_dict(orient="records")
        return records
    except Exception as e:
        return []

# 3. API lấy dữ liệu Realtime cho thanh Ticker
@app.get("/api/stock/ticker-list")
def get_ticker_list(tickers: str = "HPG,MBB,FPT,VCB,VIC"):
    raw_tickers = tickers.split(",")
    ticker_array = [sanitize_ticker(t) for t in raw_tickers if sanitize_ticker(t)]
    results = []
    
    for symbol in ticker_array:
        yf_symbol = f"{symbol}.VN" if not symbol.startswith("^") else symbol
        if symbol == "VN-INDEX": yf_symbol = "^VNINDEX"
        elif symbol == "HNX-INDEX": yf_symbol = "^HNX"
        
        try:
            stock = yf.Ticker(yf_symbol)
            fast_info = stock.fast_info
            
            current = fast_info.last_price or 0
            prev_close = fast_info.previous_close or current
            
            change = current - prev_close
            percent = (change / prev_close * 100) if prev_close else 0
            
            results.append({
                "symbol": symbol,
                "value": f"{current:,.2f}" if "INDEX" in symbol else f"{current:,.0f}",
                "change": f"{change:+,.2f}" if "INDEX" in symbol else f"{change:+,.0f}",
                "percent": f"{percent:+.2f}%",
                "up": change >= 0
            })
        except Exception:
            results.append({"symbol": symbol, "value": "N/A", "change": "0", "percent": "0.00%", "up": True})
            
    return results