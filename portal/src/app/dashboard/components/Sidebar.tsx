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
  const { adminPhoto, setAdminPhoto, requests, isMobileSidebarOpen, setMobileSidebarOpen } = useDashboard();
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const confirmLogout = () => {
    localStorage.removeItem("ttl_center");
    router.push("/");
  };

  // Dynamic Counts for Badges
  const pendingOrdersCount = requests.filter(r => r.status === 'pending').length;

  const navItems = [
    { icon: (color: string) => <DashboardSymbol color={color} />, label: "Dashboard", path: "/dashboard" },
    { icon: (color: string) => <OrdersSymbol color={color} />, label: "Orders", path: "/dashboard/orders", badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
    { icon: (color: string) => <ServicesSymbol color={color} />, label: "Services", path: "/dashboard/services" },
    { icon: (color: string) => <AnalyticsSymbol color={color} />, label: "Analytics", path: "/dashboard/analytics" },
    { icon: (color: string) => <StaffSymbol color={color} />, label: "Staff", path: "/dashboard/staff", badge: pendingOrdersCount > 0 ? null : null },
    { icon: (color: string) => <SettingsSymbol color={color} />, label: "Settings", path: "/dashboard/settings" }
  ];

  const isSidebarCollapsed = isCollapsed && !isMobileSidebarOpen;

  const NavButton = ({ item, isActive }: { item: typeof navItems[0], isActive: boolean }) => (
    <button
      onClick={() => { router.push(item.path); setMobileSidebarOpen(false); }}
      className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3.5 px-3.5'} py-2.5 rounded-xl transition-all duration-200 group relative ${
        isActive
          ? 'bg-gradient-to-r from-[#6366F1]/15 to-[#10B981]/10 text-white shadow-sm'
          : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
      }`}
      title={isSidebarCollapsed ? item.label : ''}
    >
      {/* Active left indicator */}
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-[#6366F1] to-[#10B981] rounded-full" />
      )}

      {/* Icon */}
      <div className={`w-4.5 h-4.5 transition-all duration-200 shrink-0 ${
        isActive ? 'text-[#10B981]' : 'text-white/50 group-hover:text-white/80'
      }`} style={{ width: '18px', height: '18px' }}>
        {item.icon('currentColor')}
      </div>

      {/* Label */}
      <span className={`text-[13px] font-medium tracking-tight whitespace-nowrap transition-all duration-300 overflow-hidden ${
        isSidebarCollapsed ? 'opacity-0 w-0 ml-0' : 'opacity-100 w-auto'
      } ${isActive ? 'text-white font-semibold' : ''}`}>
        {item.label}
      </span>

      {/* Badge */}
      {!isSidebarCollapsed && item.badge && (
        <span className="ml-auto px-2 py-0.5 rounded-full text-[9px] font-black bg-[#F43F5E] text-white shadow-[0_0_8px_rgba(244,63,94,0.5)]">
          {item.badge}
        </span>
      )}

      {/* Collapsed badge dot */}
      {isSidebarCollapsed && item.badge && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F43F5E] shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
      )}
    </button>
  );

  return (
    <>
      {/* ── Logout Confirmation Modal ──────────────────────────────────────── */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4"
          onClick={() => setShowLogoutModal(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#0A0F1E]/70 backdrop-blur-md" />

          {/* Modal card */}
          <div
            className="relative z-10 w-full max-w-[380px] bg-[#162035] border border-white/[0.09] rounded-[24px] shadow-[0_0_60px_rgba(244,63,94,0.12)] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F43F5E]/40 to-transparent" />

            <div className="p-7">
              {/* Icon */}
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-2xl bg-[#F43F5E]/10 border border-[#F43F5E]/20 flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.15)]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </div>
              </div>

              {/* Text */}
              <h3 className="text-[18px] font-black text-white text-center tracking-tight mb-2">
                Sign Out?
              </h3>
              <p className="text-[12px] text-white/45 text-center leading-relaxed mb-1">
                You will be signed out of your TrueTestLabs portal session.
              </p>
              <p className="text-[11px] text-white/25 text-center mb-7">
                Any unsaved changes will be lost.
              </p>

              {/* Divider */}
              <div className="h-px bg-white/[0.06] mb-5" />

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 py-3 rounded-xl text-[13px] font-bold text-white/60 bg-white/[0.04] border border-white/[0.08] hover:text-white hover:bg-white/[0.08] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 py-3 rounded-xl text-[13px] font-bold text-white bg-[#F43F5E] hover:bg-[#E11D48] transition-all shadow-[0_0_16px_rgba(244,63,94,0.3)] hover:shadow-[0_0_24px_rgba(244,63,94,0.45)] relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                  Confirm Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-[#0F1629]/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 pointer-events-auto"
        />
      )}

      <aside className={`
        fixed inset-y-3 left-3 z-50 flex md:relative md:inset-auto md:my-3 md:ml-3 flex-col shrink-0 h-[calc(100vh-24px)] rounded-[28px] overflow-hidden transition-all duration-400 ease-in-out pointer-events-auto bg-[#12203A] border border-white/[0.07] shadow-2xl shadow-black/40
        ${isMobileSidebarOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-[110%] w-0 md:translate-x-0 md:w-auto'}
        ${isSidebarCollapsed ? 'md:w-[70px]' : 'md:w-64'}
      `}>
        {/* Subtle gradient top accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6366F1]/40 to-transparent" />

        <div className={`pt-5 ${isSidebarCollapsed ? 'px-3' : 'px-4'} pb-4 w-full flex flex-col h-full bg-transparent`}>

          {/* Header Section */}
          <div className={`flex flex-col ${isSidebarCollapsed ? 'items-center gap-4' : 'gap-3'} mb-6 transition-all duration-400`}>
            <div className="flex items-center justify-between w-full gap-2">
              <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center w-full' : 'gap-2.5'} overflow-hidden transition-all duration-400`}>
                <div className="flex items-center justify-center shrink-0 w-8 h-8 relative">
                  <div className="absolute inset-0 rounded-full bg-[#10B981]/10 blur-md" />
                  <img src="/ttl-final.png" alt="TrueTestLabs Logo" className="w-full h-full object-contain relative z-10" />
                </div>
                <div className={`flex flex-col transition-all duration-400 overflow-hidden ${isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                  <span className="text-[18px] font-black text-white tracking-tight truncate whitespace-nowrap leading-tight">
                    TrueTest<span className="text-[#10B981]">Labs</span>
                  </span>
                  <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] truncate">Diagnostics Portal</span>
                </div>
              </div>

              {/* Mobile close */}
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="flex md:hidden w-7 h-7 rounded-lg items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors shrink-0"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>

              {/* Desktop collapse */}
              {!isSidebarCollapsed && (
                <button
                  onClick={() => setIsCollapsed(true)}
                  className="hidden md:flex w-7 h-7 rounded-lg items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/5 transition-all shrink-0"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                </button>
              )}
            </div>

            {isSidebarCollapsed && (
              <button
                onClick={() => setIsCollapsed(false)}
                className="hidden md:flex w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] items-center justify-center hover:bg-white/[0.08] transition-all text-white/40 hover:text-white/70"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
            )}
          </div>

          {/* Thin separator */}
          <div className="w-full h-px bg-white/[0.05] mb-5" />

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-5">
            {/* General Section */}
            <div>
              <p className={`text-[9px] font-black text-white/25 uppercase tracking-[0.25em] mb-2.5 transition-all duration-400 ${isSidebarCollapsed ? 'text-center px-0' : 'px-1'}`}>
                {isSidebarCollapsed ? '•••' : 'General'}
              </p>
              <div className="space-y-0.5">
                {[navItems[0], navItems[1], navItems[2]].map((item, i) => {
                  const isActive = pathname === item.path || (item.path === '/dashboard' && pathname === '/dashboard');
                  return <NavButton key={i} item={item} isActive={isActive} />;
                })}
              </div>
            </div>

            {/* Operations Section */}
            <div>
              <p className={`text-[9px] font-black text-white/25 uppercase tracking-[0.25em] mb-2.5 transition-all duration-400 ${isSidebarCollapsed ? 'text-center px-0' : 'px-1'}`}>
                {isSidebarCollapsed ? '•••' : 'Operations'}
              </p>
              <div className="space-y-0.5">
                {[navItems[3], navItems[4]].map((item, i) => {
                  const isActive = pathname === item.path;
                  return <NavButton key={i} item={item} isActive={isActive} />;
                })}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-auto pt-4 space-y-0.5">
            <div className="w-full h-px bg-white/[0.05] mb-3" />

            {/* Settings */}
            <NavButton item={navItems[5]} isActive={pathname === navItems[5].path} />

            {/* Logout */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3.5 px-3.5'} py-2.5 rounded-xl text-rose-400/70 hover:text-white hover:bg-rose-500/15 transition-all group border border-transparent hover:border-rose-500/20`}
              title={isSidebarCollapsed ? "Logout" : ''}
            >
              <div className="shrink-0 group-hover:scale-110 transition-transform" style={{ width: '18px', height: '18px' }}>
                <LogoutSymbol color="currentColor" />
              </div>
              <span className={`text-[13px] font-medium tracking-tight whitespace-nowrap transition-all duration-300 overflow-hidden ${isSidebarCollapsed ? 'opacity-0 w-0 ml-0' : 'opacity-100 w-auto'}`}>
                Logout
              </span>
            </button>
          </div>

          {/* User Card */}
          <div className={`mt-3 mb-1 ${isSidebarCollapsed ? 'p-1.5' : 'p-2.5'} bg-white/[0.03] rounded-xl flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} transition-all duration-400 border border-white/[0.05]`}>
            <label className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[#6366F1]/30 to-[#10B981]/30 flex items-center justify-center text-white/80 font-bold text-[10px] shadow-sm overflow-hidden shrink-0 cursor-pointer group hover:opacity-90 transition-all border border-white/10" title="Upload Photo">
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
                <div className="flex items-center justify-center w-full h-full text-white/70 text-[11px] font-black">AD</div>
              )}
            </label>
            <div className={`flex flex-col overflow-hidden transition-all duration-400 ${isSidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
              <span className="text-[11px] font-semibold text-white/90 truncate whitespace-nowrap">System Admin</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_5px_#10B981]" />
                <span className="text-[9px] text-[#10B981]/70 whitespace-nowrap uppercase font-bold tracking-widest">Online</span>
              </div>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
}
