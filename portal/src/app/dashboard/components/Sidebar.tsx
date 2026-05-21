"use client";

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDashboard } from '@/context/DashboardContext';

import {
  DashboardSymbol,
  OrdersSymbol,
  ServicesSymbol,
  AnalyticsSymbol,
  StaffSymbol,
  SettingsSymbol,
  ExportSymbol,
  LogoFlourishSymbol,
  LogoutSymbol,
  ClinicalSymbol,
  BuildingSymbol
} from './Symbols';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { adminPhoto, setAdminPhoto, requests } = useDashboard();
  const [isCollapsed, setIsCollapsed] = React.useState(true);

  // Dynamic Counts for Badges
  const pendingOrdersCount = requests.filter(r => r.status === 'pending').length;

  const navItems = [
    { icon: (color: string) => <DashboardSymbol color={color} />, label: "Dashboard", path: "/dashboard" },
    { icon: (color: string) => <OrdersSymbol color={color} />, label: "Orders", path: "/dashboard/orders", badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
    { icon: (color: string) => <ServicesSymbol color={color} />, label: "Services", path: "/dashboard/services" },
    { icon: (color: string) => <AnalyticsSymbol color={color} />, label: "Analytics", path: "/dashboard/analytics" },
    { icon: (color: string) => <StaffSymbol color={color} />, label: "Staff", path: "/dashboard/staff", badge: 5 }, // Mock for staff
    { icon: (color: string) => <SettingsSymbol color={color} />, label: "Settings", path: "/dashboard/settings" }
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} ml-4 my-4 bg-white flex flex-col z-20 relative shrink-0 h-[calc(100vh-32px)] rounded-[48px] overflow-hidden transition-all duration-500 ease-in-out`}>
      <div className={`pt-8 ${isCollapsed ? 'px-4' : 'px-6'} pb-6 w-full flex flex-col h-full`}>
        {/* Header Section */}
        <div className={`flex flex-col ${isCollapsed ? 'items-center gap-6' : 'gap-4'} mb-8 transition-all duration-500`}>
          <div className={`flex items-center justify-between w-full`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'gap-3'} overflow-hidden transition-all duration-500`}>
              <div className="w-10 h-10 flex items-center justify-center overflow-hidden shrink-0 transition-all duration-500">
                <img src="/ttl-logo.png" alt="Logo" className="w-8 h-8 object-contain" />
              </div>
              <div className={`flex flex-col transition-all duration-500 overflow-hidden ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                <span className="text-[13px] font-black text-[#03045e] tracking-tighter truncate whitespace-nowrap uppercase">TrueTestLabs</span>
              </div>
            </div>
            {!isCollapsed && (
              <button
                onClick={() => setIsCollapsed(true)}
                className="w-8 h-8 rounded-lg border border-[#03045e]/10 flex items-center justify-center text-[#03045e]/40 hover:text-[#03045e] transition-colors shrink-0"
              >
                <div className="w-4 h-4 border-2 border-current rounded-sm relative">
                  <div className={`absolute left-0 right-0 top-0 bottom-0 w-0.5 bg-current transition-all`}></div>
                </div>
              </button>
            )}
          </div>

          {isCollapsed && (
            <button onClick={() => setIsCollapsed(false)} className="w-10 h-10 rounded-xl bg-white border border-[#03045e]/10 flex items-center justify-center hover:bg-[rgba(0,82,255,0.1)] transition-colors">
              <div className="w-4 h-4 text-[#03045e]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              </div>
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-8">
          {/* General Section */}
          <div>
            <h3 className={`text-[9px] font-bold text-[#03045e]/30 uppercase tracking-widest mb-4 transition-all duration-500 ${isCollapsed ? 'text-center px-0' : 'px-4'}`}>
              {isCollapsed ? 'Gen' : 'General'}
            </h3>
            <div className="space-y-2">
              {[navItems[0], navItems[1], navItems[2]].map((item, i) => {
                const isActive = pathname === item.path || (item.path === '/dashboard' && pathname === '/dashboard');
                return (
                  <button
                    key={i}
                    onClick={() => router.push(item.path)}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-4 px-4'} py-3 rounded-2xl transition-all group relative ${isActive ? 'text-[#03045e] font-bold bg-[#dcf0fa]' : 'text-[#03045e]/40 hover:text-[#03045e] hover:bg-[rgba(0,82,255,0.1)]'}`}
                    title={isCollapsed ? item.label : ''}
                  >
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[24px] bg-[#03045e] rounded-full"></div>}
                    <div className={`w-5 h-5 transition-colors shrink-0 ${isActive ? 'text-[#03045e]' : 'text-[#03045e]/40 group-hover:text-[#03045e]'}`}>
                      {item.icon('currentColor')}
                    </div>
                    <span className={`text-sm tracking-tight whitespace-nowrap transition-all duration-500 overflow-hidden ${isCollapsed ? 'opacity-0 w-0 ml-0' : 'opacity-100 w-auto ml-0'}`}>
                      {item.label}
                    </span>
                    {!isCollapsed && item.badge && (
                      <span className={`ml-auto px-2 py-0.5 rounded-full text-[9px] font-black bg-[#03045e] text-white`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Operational Section */}
          <div>
            <h3 className={`text-[9px] font-bold text-[#03045e]/30 uppercase tracking-widest mb-4 transition-all duration-500 ${isCollapsed ? 'text-center px-0' : 'px-4'}`}>
              {isCollapsed ? 'Ops' : 'Operations'}
            </h3>
            <div className="space-y-2">
              {[navItems[3], navItems[4]].map((item, i) => {
                const isActive = pathname === item.path;
                return (
                  <button
                    key={i}
                    onClick={() => router.push(item.path)}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-4 px-4'} py-3 rounded-2xl transition-all group relative ${isActive ? 'text-[#03045e] font-bold bg-[#dcf0fa]' : 'text-[#03045e]/40 hover:text-[#03045e] hover:bg-[rgba(0,82,255,0.1)]'}`}
                    title={isCollapsed ? item.label : ''}
                  >
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[24px] bg-[#03045e] rounded-full"></div>}
                    <div className={`w-5 h-5 transition-colors shrink-0 ${isActive ? 'text-[#03045e]' : 'text-[#03045e]/40 group-hover:text-[#03045e]'}`}>
                      {item.icon('currentColor')}
                    </div>
                    <span className={`text-sm tracking-tight whitespace-nowrap transition-all duration-500 overflow-hidden ${isCollapsed ? 'opacity-0 w-0 ml-0' : 'opacity-100 w-auto ml-0'}`}>
                      {item.label}
                    </span>
                    {!isCollapsed && item.badge && (
                      <span className={`ml-auto px-2 py-0.5 rounded-full text-[9px] font-black bg-[#03045e] text-white`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Other Section - Anchored Bottom */}
        <div className="mt-auto pt-6 space-y-4">

          <div>
            <div className="space-y-2">
              <button
                onClick={() => router.push(navItems[5].path)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-4 px-4'} py-3 rounded-2xl transition-all group relative ${pathname === navItems[5].path ? 'text-[#03045e] font-bold bg-[#dcf0fa]' : 'text-[#03045e]/40 hover:text-[#03045e] hover:bg-[rgba(0,82,255,0.1)]'}`}
                title={isCollapsed ? navItems[5].label : ''}
              >
                {pathname === navItems[5].path && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[24px] bg-[#03045e] rounded-full"></div>}
                <div className={`w-5 h-5 transition-colors shrink-0 ${pathname === navItems[5].path ? 'text-[#03045e]' : 'text-[#03045e]/40 group-hover:text-[#03045e]'}`}>
                  {navItems[5].icon('currentColor')}
                </div>
                <span className={`text-sm tracking-tight whitespace-nowrap transition-all duration-500 overflow-hidden ${isCollapsed ? 'opacity-0 w-0 ml-0' : 'opacity-100 w-auto ml-0'}`}>
                  {navItems[5].label}
                </span>
              </button>

              <button
                onClick={() => { localStorage.removeItem("ttl_center"); router.push("/"); }}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-4 px-4'} py-3 rounded-2xl text-rose-500/60 hover:text-rose-500 hover:bg-rose-500/5 transition-all group`}
                title={isCollapsed ? "Logout" : ''}
              >
                <div className="w-5 h-5 shrink-0">
                  <LogoutSymbol color="currentColor" />
                </div>
                <span className={`text-sm font-semibold tracking-tight whitespace-nowrap transition-all duration-500 overflow-hidden ${isCollapsed ? 'opacity-0 w-0 ml-0' : 'opacity-100 w-auto ml-0'}`}>
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className={`mt-[20px] mb-4 ${isCollapsed ? 'p-1.5' : 'p-2.5'} bg-[#E8EEF5] rounded-2xl flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} transition-all duration-500`}>
          <label className="relative w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#03045e]/40 font-bold text-[10px] shadow-sm overflow-hidden shrink-0 cursor-pointer group hover:scale-105 transition-transform" title="Upload Photo">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setAdminPhoto(URL.createObjectURL(e.target.files[0]));
                }
              }}
            />
            {adminPhoto ? (
              <img src={adminPhoto} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-white text-[#03045e]/40 group-hover:bg-[#dcf0fa] transition-colors">AD</div>
            )}
          </label>
          <div className={`flex flex-col overflow-hidden transition-all duration-500 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            <span className="text-[11px] font-bold text-[#03045e] truncate whitespace-nowrap">System Admin</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00db0b]"></span>
              <span className="text-[9px] text-[#00db0b]/40 whitespace-nowrap uppercase font-bold tracking-widest">Online</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
