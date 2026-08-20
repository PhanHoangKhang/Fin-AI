from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
import re

app = FastAPI(title="Fin-AI Stock Service", version="1.0.0")

# Cấu hình CORS để Frontend (Vercel/Localhost/Extension) kết nối an toàn mà không bị chặn
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def sanitize_ticker(ticker: str) -> str:
    """Lọc bỏ các ký tự nguy hiểm / không hợp lệ trong mã chứng khoán"""
    if not ticker:
        return ""
    # Chỉ cho phép chữ, số, dấu gạch ngang và dấu mũ (^ cho chỉ số như ^VNINDEX)
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

    try:
        # Mã Việt Nam trên Yahoo Finance cần thêm đuôi .VN
        symbol = f"{clean_ticker}.VN" if not clean_ticker.startswith("^") else clean_ticker
        stock = yf.Ticker(symbol)
        info = stock.info
        
        # Lọc ra các trường dữ liệu quan trọng nhất
        result = {
            "ticker": clean_ticker,
            "companyName": info.get("longName") or info.get("shortName") or clean_ticker,
            "industry": info.get("industry") or "N/A",
            "sector": info.get("sector") or "N/A",
            "currentPrice": info.get("currentPrice") or info.get("regularMarketPrice") or 0,
            "marketCap": info.get("marketCap") or 0,
            "peRatio": info.get("trailingPE") or 0,
            "pbRatio": info.get("priceToBook") or 0,
            "fiftyTwoWeekHigh": info.get("fiftyTwoWeekHigh") or 0,
            "fiftyTwoWeekLow": info.get("fiftyTwoWeekLow") or 0,
            "summary": info.get("longBusinessSummary") or "Đang cập nhật thông tin doanh nghiệp..."
        }
        return result
    except Exception as e:
        return {"error": f"Lỗi lấy thông tin từ Yahoo Finance: {str(e)}"}

# 2. Lấy dữ liệu lịch sử giá cổ phiếu
@app.get("/api/stock/price/{ticker}")
def get_stock_price(ticker: str):
    clean_ticker = sanitize_ticker(ticker)
    if not clean_ticker:
        return {"error": "Mã chứng khoán không hợp lệ"}

    try:
        symbol = f"{clean_ticker}.VN" if not clean_ticker.startswith("^") else clean_ticker
        stock = yf.Ticker(symbol)
        
        # Lấy lịch sử giá 1 tháng gần nhất
        df = stock.history(period="1m")
        
        if df.empty:
            return []

        # Format lại dữ liệu cho sạch đẹp
        df = df.reset_index()
        df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')
        
        # Chỉ lấy các cột cần thiết
        records = df[['Date', 'Open', 'High', 'Low', 'Close', 'Volume']].to_dict(orient="records")
        return records
    except Exception as e:
        return {"error": f"Lỗi lấy giá từ Yahoo Finance: {str(e)}"}

# 3. API lấy dữ liệu Realtime cho thanh Ticker
@app.get("/api/stock/ticker-list")
def get_ticker_list(tickers: str = "HPG,MBB,FPT,VCB,VIC"):
    raw_tickers = tickers.split(",")
    ticker_array = [sanitize_ticker(t) for t in raw_tickers if sanitize_ticker(t)]
    results = []
    
    for symbol in ticker_array:
        # Xử lý riêng mã chỉ số VN-Index, HNX-Index nếu dùng Yahoo Finance (^VNINDEX) hoặc cổ phiếu (.VN)
        yf_symbol = f"{symbol}.VN" if not symbol.startswith("^") else symbol
        if symbol == "VN-INDEX": yf_symbol = "^VNINDEX"
        elif symbol == "HNX-INDEX": yf_symbol = "^HNX"
        
        try:
            stock = yf.Ticker(yf_symbol)
            fast_info = stock.fast_info
            
            # Lấy giá hiện tại và giá đóng cửa phiên trước
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
            # Fallback nếu mã gặp lỗi
            results.append({"symbol": symbol, "value": "N/A", "change": "0", "percent": "0.00%", "up": True})
            
    return results