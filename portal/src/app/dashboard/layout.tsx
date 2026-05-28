"use client";

import React from 'react';
import { DashboardProvider } from '@/context/DashboardContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <div className="min-h-screen flex bg-[#0F1629] text-white overflow-hidden relative transition-colors duration-500">
        {/* Premium Background System */}
        <div className="premium-bg-container">
          <div className="mesh-orb orb-1"></div>
          <div className="mesh-orb orb-2"></div>
          <div className="mesh-orb orb-3"></div>
        </div>
        <div className="noise-overlay"></div>

        {/* Sidebar */}
        <div className="print:hidden h-full z-20">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 print:h-auto print:overflow-visible">
          {/* Header */}
          <div className="print:hidden relative z-50">
            <Header />
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar print:overflow-visible">
            {children}
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}
