import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

import { LandingPage } from './pages/LandingPage';
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { PortfolioPage } from './pages/dashboard/PortfolioPage';
import { NewsDetailPage } from './pages/dashboard/NewsDetailPage';
import DictionaryPage from './pages/dashboard/DictionaryPage';
import { GlobalTermListener } from './components/TermPopup';

const App: React.FC = () => {
  return (
    <Router>
      <GlobalTermListener />
      <Routes>
        {/* Layout cho Landing Page */}
        <Route 
          path="/" 
          element={
            <MainLayout>
              <LandingPage />
            </MainLayout>
          } 
        />

        {/* LAYOUT DÀNH RIÊNG CHO DASHBOARD (CÓ SIDEBAR) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="news/:id" element={<NewsDetailPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="dictionary" element={<DictionaryPage />} />
          <Route path="history" element={<div className="font-bold text-[#2B3A1A] p-6 bg-white rounded-2xl border border-[#E8EDE0]">Trang Lịch sử tra cứu (Sắp ra mắt)</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;