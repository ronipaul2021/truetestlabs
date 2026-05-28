"use client";

import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { SearchSymbol, NotificationSymbol, ArrowDownSymbol, PlusSymbol, SupportSymbol, OrdersSymbol, ClinicalSymbol, AnalyticsSymbol } from './Symbols';
import { useRouter } from 'next/navigation';

export function Header() {
  const { globalSearchQuery, setGlobalSearchQuery, currentCenter, centerLogo, requests, isMobileSidebarOpen, setMobileSidebarOpen } = useDashboard();
  const router = useRouter();

  const [currentTime, setCurrentTime] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime
    ? currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : "Loading...";
  const formattedTime = currentTime
    ? currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
    : "--:--";

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="pt-3 pl-3 pr-3 shrink-0 z-30 pointer-events-none mb-2">
      <header className="h-[66px] px-3 md:px-4 flex items-center gap-2.5 sm:gap-3 bg-[#12203A]/80 backdrop-blur-2xl border border-white/[0.07] rounded-[22px] pointer-events-auto transition-all duration-500 hover:border-white/[0.1] hover:bg-[#12203A]/90 shadow-xl shadow-black/30">

        {/* Top accent line */}
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#6366F1]/30 to-transparent rounded-full" />

        {/* Hamburger — Mobile */}
        <button
          onClick={() => setMobileSidebarOpen(!isMobileSidebarOpen)}
          className="flex md:hidden w-9 h-9 items-center justify-center bg-white/[0.05] rounded-xl text-white/70 hover:bg-[#6366F1]/15 hover:text-[#6366F1] transition-all shrink-0 border border-white/[0.06]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Center Profile Chip */}
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-[16px] p-1.5 pr-3 h-[44px] cursor-pointer hover:bg-white/[0.07] hover:border-[#10B981]/25 transition-all group max-w-[180px] sm:max-w-[260px] lg:max-w-none shrink-0">
          <div className="w-7 h-7 rounded-[10px] overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#6366F1]/20 to-[#10B981]/20 shrink-0 border border-white/10">
            {centerLogo ? (
              <img src={centerLogo} alt={currentCenter?.name || "Center Logo"} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-black text-[10px] text-white/70">
                {currentCenter?.name ? currentCenter.name.substring(0, 2).toUpperCase() : "HC"}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center overflow-hidden">
            <span className="text-[11px] md:text-[12px] font-bold text-white leading-tight truncate tracking-tight">
              {currentCenter?.name || "Healthline Center"}
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1 h-1 rounded-full bg-[#10B981]" />
              <span className="text-[8px] md:text-[9px] text-white/50 font-semibold leading-none uppercase tracking-[0.12em] truncate">
                {currentCenter?.generatedId ? `${currentCenter.generatedId}` : "Lab"}
              </span>
            </div>
          </div>
          <div className="w-3.5 h-3.5 text-white/30 ml-1 shrink-0 group-hover:text-[#10B981] transition-colors group-hover:translate-y-0.5 duration-200">
            <ArrowDownSymbol color="currentColor" />
          </div>
        </div>

        {/* Date & Time */}
        <div className="hidden lg:flex items-center gap-2.5 pl-3 border-l border-white/[0.07]">
          <div className="w-7 h-7 rounded-full bg-[#6366F1]/10 flex items-center justify-center text-[#6366F1] shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-tight text-white leading-tight">{formattedDate}</span>
            <span className="text-[9px] font-medium text-white/40 tracking-wide font-mono">{formattedTime}</span>
          </div>
        </div>

        {/* Live System Status */}
        <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-white/[0.07]">
          <div className="flex items-center gap-1.5 bg-[#10B981]/8 border border-[#10B981]/20 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981] animate-pulse" />
            <span className="text-[9px] font-black text-[#10B981] uppercase tracking-[0.18em]">
              {pendingCount > 0 ? `${pendingCount} Pending` : 'System Live'}
            </span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search Bar */}
        <div className="w-32 xs:w-44 sm:w-52 md:w-64 relative h-[40px] transition-all group/search">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 group-focus-within/search:text-[#6366F1] transition-colors">
            <SearchSymbol color="currentColor" />
          </div>
          <input
            type="text"
            placeholder="Search patient, order..."
            className="w-full h-full bg-white/[0.04] border border-white/[0.07] rounded-[14px] pl-9 pr-8 text-[12px] font-medium text-white placeholder:text-white/30 focus:outline-none focus:bg-white/[0.07] focus:border-[#6366F1]/40 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] transition-all"
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1">
            <kbd className="hidden md:inline-flex items-center justify-center px-1.5 py-0.5 text-[8px] font-bold text-white/25 bg-white/[0.06] border border-white/[0.07] rounded-md">⌘K</kbd>
          </div>
        </div>

        {/* Create Button + Dropdown */}
        <div className="relative group hidden sm:block">
          <button className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#6366F1] to-[#10B981] text-white px-4 rounded-[14px] hover:opacity-90 transition-all h-[40px] shrink-0 relative overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_0_28px_rgba(99,102,241,0.4)]">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <div className="w-3.5 h-3.5 text-white shrink-0">
              <PlusSymbol color="currentColor" />
            </div>
            <span className="text-[12px] font-bold tracking-wide text-white">Create</span>
          </button>

          {/* Dropdown */}
          <div className="absolute right-0 top-[120%] w-44 bg-[#162035] rounded-[18px] border border-white/[0.08] opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:top-[110%] transition-all duration-300 z-50 overflow-hidden py-2 shadow-2xl shadow-black/50">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6366F1]/30 to-transparent" />

            <button
              onClick={() => router.push('/dashboard/orders')}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.05] transition-colors text-left group/btn"
            >
              <div className="w-4 h-4 flex items-center justify-center text-white/50 group-hover/btn:text-[#F43F5E] transition-colors">
                <OrdersSymbol />
              </div>
              <span className="text-[11px] font-semibold text-white/70 group-hover/btn:text-white transition-colors">Add Order</span>
            </button>

            <button
              onClick={() => router.push('/dashboard/services')}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.05] transition-colors text-left group/btn"
            >
              <div className="w-4 h-4 flex items-center justify-center text-white/50 group-hover/btn:text-[#10B981] transition-colors">
                <ClinicalSymbol />
              </div>
              <span className="text-[11px] font-semibold text-white/70 group-hover/btn:text-white transition-colors">Add Service</span>
            </button>

            <div className="mx-4 my-1.5 border-t border-white/[0.06]" />

            <button
              onClick={() => window.print()}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.05] transition-colors text-left group/btn"
            >
              <div className="w-4 h-4 flex items-center justify-center text-white/50 group-hover/btn:text-[#F59E0B] transition-colors">
                <AnalyticsSymbol />
              </div>
              <span className="text-[11px] font-semibold text-white/70 group-hover/btn:text-white transition-colors">Export Report</span>
            </button>
          </div>
        </div>

        <div className="w-px h-6 bg-white/[0.07] hidden sm:block mx-0.5" />

        {/* Support */}
        <button className="hidden sm:flex w-[40px] h-[40px] items-center justify-center bg-white/[0.04] rounded-[14px] text-white/40 hover:bg-white/[0.07] hover:text-white/80 transition-all shrink-0 border border-white/[0.06]">
          <div className="w-4 h-4"><SupportSymbol color="currentColor" /></div>
        </button>

        {/* Notification */}
        <button className="w-[40px] h-[40px] flex items-center justify-center bg-white/[0.04] rounded-[14px] text-white/40 hover:bg-[#F43F5E]/10 hover:text-[#F43F5E] transition-all shrink-0 relative border border-white/[0.06]">
          <div className="w-4 h-4"><NotificationSymbol color="currentColor" /></div>
          {pendingCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#F43F5E] rounded-full border-2 border-[#12203A] shadow-[0_0_6px_rgba(244,63,94,0.8)] animate-pulse" />
          )}
        </button>

      </header>
    </div>
  );
}
