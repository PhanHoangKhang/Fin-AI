import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { PortfolioAlertDto } from "../../types/index";
import type { PortfolioItem } from "../../utils/portfolioStorage";
import {
  getPortfolio,
  addTicker,
  removeTicker,
} from "../../utils/portfolioStorage";

export const PortfolioPage: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [alerts, setAlerts] = useState<PortfolioAlertDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Form states
  const [newTicker, setNewTicker] = useState<string>("");
  const [newPrice, setNewPrice] = useState<string>("");

  // 1. Fetch dữ liệu khi Component Mount
  useEffect(() => {
    const savedPortfolio = getPortfolio();
    setPortfolio(savedPortfolio);

    fetch("http://localhost:8080/api/alerts/my-alerts")
      .then((res) => res.json())
      .then((data: PortfolioAlertDto[]) => {
        setAlerts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi kết nối API:", err);
        setLoading(false);
      });
  }, []);

  // 2. Thêm mã cổ phiếu vào localStorage
  const handleAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTicker.trim() || !newPrice || isNaN(Number(newPrice))) return;

    const updated = addTicker(newTicker, Number(newPrice));
    setPortfolio(updated);
    setNewTicker("");
    setNewPrice("");
  };

  // 3. Xóa mã cổ phiếu
  const handleRemove = (tickerToRemove: string) => {
    const updated = removeTicker(tickerToRemove);
    setPortfolio(updated);
  };

  // 4. FILTER: Lọc bài báo dựa trên danh mục trong localStorage
  const filteredAlerts = alerts.filter((alert) =>
    portfolio.some((item) => item.ticker === alert.ticker),
  );

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>💼 Quản Lý Danh Mục (Local Storage)</h2>

      {/* FORM THÊM MÃ */}
      <form
        onSubmit={handleAdd}
        style={{ display: "flex", gap: "8px", marginBottom: "20px" }}
      >
        <input
          type="text"
          placeholder="Mã CP (vd: VIC)"
          value={newTicker}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewTicker(e.target.value)
          }
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="number"
          step="0.1"
          placeholder="Giá vốn (vd: 45.0)"
          value={newPrice}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewPrice(e.target.value)
          }
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            backgroundColor: "#0070f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          + Thêm
        </button>
      </form>

      {/* DANH SÁCH MÃ ĐANG THEO DÕI */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "24px",
        }}
      >
        {portfolio.map((item) => (
          <span
            key={item.ticker}
            style={{
              padding: "6px 12px",
              backgroundColor: "#f0f0f0",
              borderRadius: "16px",
              fontSize: "14px",
            }}
          >
            <strong>{item.ticker}</strong> (Giá vốn: {item.avgPrice}k)
            <button
              onClick={() => handleRemove(item.ticker)}
              style={{
                marginLeft: "8px",
                border: "none",
                background: "none",
                color: "#ff4d4f",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid #eee",
          margin: "20px 0",
        }}
      />

      {/* DANH SÁCH CẢNH BÁO ĐÃ LỌC */}
      <h2>🚨 Cảnh Báo Cá Nhân Hóa ({filteredAlerts.length})</h2>

      {loading ? (
        <p>Đang tải dữ liệu từ server...</p>
      ) : filteredAlerts.length === 0 ? (
        <p style={{ color: "#888" }}>
          Không có cảnh báo nào cho các mã cổ phiếu trong danh mục của bạn.
        </p>
      ) : (
        filteredAlerts.map((alert) => (
          <div
            key={alert.alertId}
            style={{
              borderLeft: `4px solid ${
                alert.alertType === "NEGATIVE_RISK" ? "#ff4d4f" : "#52c41a"
              }`,
              backgroundColor: "#fafafa",
              padding: "16px",
              marginBottom: "16px",
              borderRadius: "0 8px 8px 0",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  fontWeight: "bold",
                  color:
                    alert.alertType === "NEGATIVE_RISK" ? "#ff4d4f" : "#52c41a",
                }}
              >
                [{alert.ticker}] -{" "}
                {alert.alertType === "NEGATIVE_RISK"
                  ? "CẢNH BÁO RỦI RO"
                  : "CƠ HỘI TÍCH CỰC"}
              </span>
              <small style={{ color: "#888" }}>{alert.publishedDate}</small>
            </div>

            <h3 style={{ margin: "0 0 8px 0" }}>{alert.title}</h3>
            <p style={{ margin: "0 0 12px 0", color: "#555" }}>
              {alert.summary}
            </p>

            <div
              style={{
                padding: "8px 12px",
                backgroundColor: "#fff",
                borderRadius: "4px",
                border: "1px solid #eee",
                fontSize: "13px",
              }}
            >
              <strong>Khuyến nghị AI:</strong> {alert.suggestedAction}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
