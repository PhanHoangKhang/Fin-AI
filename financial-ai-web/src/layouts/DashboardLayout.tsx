import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Squares2X2Icon, 
  ShieldExclamationIcon, 
  BookOpenIcon, 
  ClockIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  HomeIcon
} from '@heroicons/react/24/outline';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  proOnly?: boolean;
}

export const DashboardLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const location = useLocation();

  // Danh sách Menu điều hướng với Heroicons v2
  const menuItems: MenuItem[] = [
    { 
      path: '/dashboard', 
      label: 'Tổng quan & Tin AI', 
      icon: <Squares2X2Icon className="w-5 h-5 shrink-0" aria-hidden="true" /> 
    },
    { 
      path: '/dashboard/portfolio', 
      label: 'Cảnh báo Danh mục', 
      icon: <ShieldExclamationIcon className="w-5 h-5 shrink-0" aria-hidden="true" />,
      proOnly: true
    },
    { 
      path: '/dashboard/dictionary', 
      label: 'Từ điển F0 & Pop-up', 
      icon: <BookOpenIcon className="w-5 h-5 shrink-0" aria-hidden="true" /> 
    },
    { 
      path: '/dashboard/history', 
      label: 'Lịch sử tra cứu', 
      icon: <ClockIcon className="w-5 h-5 shrink-0" aria-hidden="true" /> 
    },
  ];

  // Lấy label của trang hiện tại cho Breadcrumb
  const currentMenu = menuItems.find(m => m.path === location.pathname);
  const currentTitle = currentMenu ? currentMenu.label : 'Tổng quan';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 antialiased select-none">
      
      {/* SIDEBAR BÊN TRÁI - Nền trắng, Chữ đen */}
      <aside 
        aria-label="Thanh điều hướng chính"
        aria-expanded={!collapsed}
        className={`h-full shrink-0 bg-white text-slate-800 flex flex-col justify-between relative transition-all duration-300 ease-in-out border-r border-slate-200 z-20 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Toggle Button thu gọn Sidebar */}
        <button 
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Mở rộng thanh điều hướng" : "Thu gọn thanh điều hướng"}
          className="absolute -right-3.5 top-8 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 p-1.5 rounded-full border border-slate-200 shadow-md transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500 z-30"
        >
          {collapsed ? (
            <ChevronRightIcon className="w-3.5 h-3.5" aria-hidden="true" />
          ) : (
            <ChevronLeftIcon className="w-3.5 h-3.5" aria-hidden="true" />
          )}
        </button>

        {/* Top Sidebar: Header Brand + Nav Links */}
        <div className="p-4 space-y-8">
          {/* Logo Brand Header */}
          <header className={`flex items-center gap-3 px-2 ${collapsed ? 'justify-center' : ''}`}>
            <Link 
              to="/dashboard" 
              aria-label="FinAI Hub - Trang chủ" 
              className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-2xl"
            >
              <div className="w-10 h-10 bg-cyan-800 rounded-2xl flex items-center justify-center font-extrabold text-xl text-white shadow-md shadow-cyan-800/20 shrink-0">
                F
              </div>
              {!collapsed && (
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  FinAI
                </span>
              )}
            </Link>
          </header>

          {/* Navigation Links */}
          <nav aria-label="Menu chức năng Dashboard">
            <ul className="space-y-1.5" role="list">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      aria-current={isActive ? 'page' : undefined}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center gap-3 px-3.5 py-3 text-sm font-semibold transition-all duration-200 ${
                        isActive 
                          ? 'bg-cyan-800 text-white shadow-sm' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      } ${collapsed ? 'justify-center' : ''}`}
                    >
                      <span className="shrink-0">{item.icon}</span>
                      {!collapsed && (
                        <span className="flex items-center justify-between w-full">
                          <span>{item.label}</span>
                          {item.proOnly && (
                            <span 
                              aria-label="Tính năng gói Pro"
                              className={`text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wider ${
                                isActive 
                                  ? 'bg-amber-400 text-slate-900' 
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              PRO
                            </span>
                          )}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Bottom Sidebar: Back to Home Link */}
        <footer className="p-4 border-t border-slate-100">
          <nav aria-label="Điều hướng ngoài">
            <Link
              to="/"
              title={collapsed ? "Về Trang Chủ" : undefined}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              <HomeIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
              {!collapsed && <span>Về Trang Chủ</span>}
            </Link>
          </nav>
        </footer>
      </aside>

      {/* KHU VỰC NỘI DUNG CHÍNH BÊN PHẢI */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10 shrink-0">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Đường dẫn trang hiện tại" className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Link to="/dashboard" className="hover:text-cyan-800 transition">Dashboard</Link>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <h1 className="text-slate-900 font-bold text-sm inline">
              {currentTitle}
            </h1>
          </nav>

          {/* User Profile Badge */}
          <aside aria-label="Thông tin người dùng" className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-full shadow-sm">
              <div className="w-7 h-7 bg-cyan-800 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                F0
              </div>
              <span className="text-xs font-bold text-slate-700">Tài khoản F0 (Standard)</span>
            </div>
          </aside>
        </header>

        {/* Sub-Pages Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50">
          <section aria-label="Nội dung chính" className="max-w-6xl mx-auto">
            <Outlet />
          </section>
        </main>

      </div>
    </div>
  );
};