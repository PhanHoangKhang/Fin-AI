import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { PortfolioAlertDto } from "../../types/index";
import type { PortfolioItem } from "../../utils/portfolioStorage";
import {
  getPortfolio,
  addTicker,
  removeTicker,
} from "../../utils/portfolioStorage";
import { PortfolioForm } from "../../components/portfolio/PortfolioForm";
import { PortfolioTags } from "../../components/portfolio/PortfolioTags";
import { AlertList } from "../../components/portfolio/AlertList";

export const PortfolioPage: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [alerts, setAlerts] = useState<PortfolioAlertDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [newTicker, setNewTicker] = useState<string>("");
  const [newPrice, setNewPrice] = useState<string>("");

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

  const handleAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTicker.trim() || !newPrice || isNaN(Number(newPrice))) return;

    const updated = addTicker(newTicker, Number(newPrice));
    setPortfolio(updated);
    setNewTicker("");
    setNewPrice("");
  };

  const handleRemove = (tickerToRemove: string) => {
    const updated = removeTicker(tickerToRemove);
    setPortfolio(updated);
  };

  const filteredAlerts = alerts.filter((alert) =>
    portfolio.some((item) => item.ticker === alert.ticker),
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 font-sans">
      {/* KHU VỰC QUẢN LÝ DANH MỤC */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
            Quản Lý Danh Mục
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Lưu danh mục trên thiết bị để tự động lọc tin tức phù hợp.
          </p>
        </div>

        <PortfolioForm
          newTicker={newTicker}
          newPrice={newPrice}
          onTickerChange={(e: ChangeEvent<HTMLInputElement>) => setNewTicker(e.target.value)}
          onPriceChange={(e: ChangeEvent<HTMLInputElement>) => setNewPrice(e.target.value)}
          onSubmit={handleAdd}
        />

        <PortfolioTags portfolio={portfolio} onRemove={handleRemove} />
      </section>

      {/* KHU VỰC HIỂN THỊ CẢNH BÁO */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
            Cảnh Báo Cá Nhân Hóa
          </h2>
          <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200">
            {filteredAlerts.length} bài viết
          </span>
        </div>

        <AlertList alerts={filteredAlerts} loading={loading} />
      </section>
    </div>
  );
};