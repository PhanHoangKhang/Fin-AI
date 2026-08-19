from fastapi import FastAPI
import yfinance as yf

app = FastAPI()

# pip install -r requirements.txt
# pip install fastapi uvicorn yfinance
# uvicorn main:app --host 0.0.0.0 --port 8001 --reload

@app.get("/")
def home():
    return {"message": "Stock Service qua Yahoo Finance API đang chạy mượt mà!"}

# 1. Lấy thông tin tổng quan doanh nghiệp
@app.get("/api/stock/info/{ticker}")
def get_stock_info(ticker: str):
    try:
        # Mã Việt Nam trên Yahoo Finance cần thêm đuôi .VN
        symbol = f"{ticker.upper()}.VN"
        stock = yf.Ticker(symbol)
        info = stock.info
        
        # Lọc ra các trường dữ liệu quan trọng nhất
        result = {
            "ticker": ticker.upper(),
            "companyName": info.get("longName") or info.get("shortName"),
            "industry": info.get("industry"),
            "sector": info.get("sector"),
            "currentPrice": info.get("currentPrice") or info.get("regularMarketPrice"),
            "marketCap": info.get("marketCap"),
            "peRatio": info.get("trailingPE"),
            "pbRatio": info.get("priceToBook"),
            "fiftyTwoWeekHigh": info.get("fiftyTwoWeekHigh"),
            "fiftyTwoWeekLow": info.get("fiftyTwoWeekLow"),
            "summary": info.get("longBusinessSummary")
        }
        return result
    except Exception as e:
        return {"error": f"Lỗi lấy thông tin từ Yahoo Finance: {str(e)}"}

# 2. Lấy dữ liệu lịch sử giá cổ phiếu
@app.get("/api/stock/price/{ticker}")
def get_stock_price(ticker: str):
    try:
        symbol = f"{ticker.upper()}.VN"
        stock = yf.Ticker(symbol)
        
        # Lấy lịch sử giá 1 tháng gần nhất
        df = stock.history(period="1m")
        
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
    ticker_array = [t.strip().upper() for t in tickers.split(",") if t.strip()]
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