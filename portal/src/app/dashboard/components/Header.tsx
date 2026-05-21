"use client";

import React from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { SearchSymbol, NotificationSymbol, ArrowDownSymbol, PlusSymbol, SupportSymbol, OrdersSymbol, ClinicalSymbol, AnalyticsSymbol } from './Symbols';

export function Header() {
  const { globalSearchQuery, setGlobalSearchQuery, currentCenter, centerLogo, requests } = useDashboard();

  const [currentTime, setCurrentTime] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime ? currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Loading...";
  const formattedTime = currentTime ? currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) : "--:--";

  return (
    <div className="pt-2 pl-4 pr-4 md:pr-4 shrink-0 z-30 pointer-events-none">
      <header className="h-16 px-4 flex items-center gap-3 bg-white rounded-full pointer-events-auto">

        {/* Diagnostic Center Profile Chip (Left) */}
        <div className="flex items-center gap-3 bg-[#E8EEF5] rounded-full pl-1.5 pr-4 h-10 cursor-pointer hover:bg-[#90e0ef]/30 transition-colors group">
          <div className="w-7.5 h-7.5 rounded-full overflow-hidden flex items-center justify-center bg-white">
            {centerLogo ? (
              <img src={centerLogo} alt={currentCenter?.name || "Center Logo"} className="w-full h-full object-cover" />
            ) : (
              <div className="w-5 h-5 flex items-center justify-center font-bold text-[10px] text-[#03045e]/40">
                {currentCenter?.name ? currentCenter.name.substring(0, 2).toUpperCase() : "HC"}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[12px] font-bold text-[#03045e] leading-tight">
              {currentCenter?.name || "Healthline Center"}
            </span>
            <span className="text-[9px] text-[#03045e]/60 font-bold leading-tight uppercase tracking-wider">
              {currentCenter?.generatedId ? `ID: ${currentCenter.generatedId}` : "Registered Lab"}
            </span>
          </div>
          <div className="w-3.5 h-3.5 text-[#03045e] ml-1">
            <ArrowDownSymbol color="#03045e" />
          </div>
        </div>

        {/* Date & Time Display (Left) */}
        <div className="hidden md:flex items-center gap-2 pl-3 border-l border-[#caf0f8] w-[120px]">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-[#03045e]">{formattedDate}</span>
            <span className="text-[10px] font-semibold text-[#03045e]/50 tracking-wider">{formattedTime}</span>
          </div>
        </div>


        {/* Spacer to push content to the right */}
        <div className="flex-1" />

        {/* Small Search Bar (Right) */}
        <div className="w-64 relative h-9">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#03045e]">
            <SearchSymbol color="#03045e" />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="w-full h-full bg-[#ffffff] border border-[#90e0ef] rounded-full pl-9 pr-4 text-[13px] font-medium text-[#03045e] placeholder:text-[#03045e]/30 focus:outline-none focus:border-[#00e9ff] transition-all"
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
          />
        </div>

        {/* Quick Create Dropdown (Right) */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 bg-[#03045e] text-white px-3.5 py-1.5 rounded-full hover:bg-[#03045e]/90 transition-all h-9 shrink-0">
            <div className="w-3.5 h-3.5"><PlusSymbol color="currentColor" /></div>
            <span className="text-[11px] font-bold uppercase tracking-widest">New</span>
          </button>
          
          <div className="absolute right-0 top-[110%] w-44 bg-white rounded-[20px] shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden py-2">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F3F4F6] transition-colors text-left group/btn">
              <div className="w-4 h-4 text-[#023e8a] group-hover/btn:scale-110 transition-transform"><OrdersSymbol /></div>
              <span className="text-[11px] font-bold text-[#111827] uppercase tracking-wider">Add Order</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F3F4F6] transition-colors text-left group/btn">
              <div className="w-4 h-4 text-[#10B981] group-hover/btn:scale-110 transition-transform"><ClinicalSymbol /></div>
              <span className="text-[11px] font-bold text-[#111827] uppercase tracking-wider">Add Service</span>
            </button>
            <div className="mx-4 my-1 border-t border-slate-100"></div>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F3F4F6] transition-colors text-left group/btn">
              <div className="w-4 h-4 text-[#F59E0B] group-hover/btn:scale-110 transition-transform"><AnalyticsSymbol /></div>
              <span className="text-[11px] font-bold text-[#111827] uppercase tracking-wider">Generate Report</span>
            </button>
          </div>
        </div>

        {/* Support Icon (Right) */}
        <button className="w-9 h-9 flex items-center justify-center bg-[#E8EEF5] rounded-full text-[#03045e] hover:bg-[#dcf0fa] transition-all shrink-0">
          <div className="w-4 h-4"><SupportSymbol color="currentColor" /></div>
        </button>

        {/* Notification Button (Right) */}
        <button className="w-9 h-9 flex items-center justify-center bg-[#E8EEF5] rounded-full text-[#03045e] hover:bg-[#dcf0fa] transition-all shrink-0 relative">
          <div className="w-4 h-4"><NotificationSymbol color="currentColor" /></div>
          {requests.filter(r => r.status === 'pending').length > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
          )}
        </button>

      </header>
    </div>
  );
}
