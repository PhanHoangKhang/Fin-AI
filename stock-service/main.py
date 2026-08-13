from fastapi import FastAPI
import yfinance as yf

app = FastAPI()

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