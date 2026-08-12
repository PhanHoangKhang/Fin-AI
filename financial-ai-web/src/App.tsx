import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

import { LandingPage } from './pages/LandingPage';
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { PortfolioPage } from './pages/dashboard/PortfolioPage';
import { NewsDetailPage } from './pages/dashboard/NewsDetailPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 1. Layout cho Landing Page */}
        <Route 
          path="/" 
          element={
            <MainLayout>
              <LandingPage />
            </MainLayout>
          } 
        />

        {/* 2. 🔥 LAYOUT DÀNH RIÊNG CHO DASHBOARD (CÓ SIDEBAR) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="news/:id" element={<NewsDetailPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="dictionary" element={<div className="font-bold text-slate-800">Trang Từ điển F0 (Sắp ra mắt)</div>} />
          <Route path="history" element={<div className="font-bold text-slate-800">Trang Lịch sử tra cứu (Sắp ra mắt)</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;