"use client";

import React from 'react';
import { DashboardProvider } from '@/context/DashboardContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <div className="min-h-screen flex bg-[#E8EEF5] font-sans text-brand-navy overflow-hidden relative transition-colors duration-500">
        {/* Premium Background System */}
        <div className="premium-bg-container">
          <div className="mesh-orb orb-1"></div>
          <div className="mesh-orb orb-2"></div>
          <div className="mesh-orb orb-3"></div>
        </div>
        <div className="noise-overlay"></div>

        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
          {/* Header */}
          <Header />

          {/* Page Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}
