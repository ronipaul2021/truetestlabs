"use client";

import React, { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { 
  SettingsSymbol, 
  IdentitySymbol, 
  AppearanceSymbol, 
  LogisticsSymbol, 
  ClinicalSymbol, 
  BillingSymbol, 
  SecuritySymbol,
  SuccessSymbol
} from '../components/Symbols';

type SettingsTab = 'general' | 'operations' | 'clinical' | 'security' | 'billing' | 'appearance';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#E8EEF5] min-h-full">
      {/* 1. Executive Control Panel */}
      <div className="p-6 pb-2">
        <div className="bg-white rounded-[32px] p-8 shadow-[0_10px_50px_-12px_rgba(0,0,0,0.05)] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative flex items-center">
              <div className="w-12 h-12 bg-[#dcf0fa] rounded-2xl flex items-center justify-center relative z-10">
                <div className="w-5 h-5 text-[#023e8a]">
                  <SettingsSymbol />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#023e8a] tracking-tight">Control Center</h1>
              <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.2em] mt-0.5">Global Configuration & Admin Policy Hub</p>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="bg-[#111827] text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2.5 disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <div className="w-4 h-4"><SuccessSymbol /></div>
            )}
            {isSaving ? 'Synchronizing...' : 'Save Configuration'}
          </button>
        </div>
      </div>

      <div className="flex-1 px-6 pb-12 flex gap-6 mt-4 overflow-hidden">
        {/* 2. Sidebar Tabs */}
        <aside className="w-72 flex flex-col gap-2 p-4 bg-white rounded-[32px] shadow-[0_10px_50px_-12px_rgba(0,0,0,0.05)] overflow-y-auto scrollbar-none">
          <p className="px-4 py-2 text-[9px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] mb-2">Configuration Matrix</p>
          {[
            { id: 'general', label: 'General Identity', icon: <IdentitySymbol color="#F59E0B" /> },
            { id: 'appearance', label: 'Interface & Themes', icon: <AppearanceSymbol /> },
            { id: 'operations', label: 'Ops & Logistics', icon: <LogisticsSymbol /> },
            { id: 'clinical', label: 'Clinical Approvals', icon: <ClinicalSymbol /> },
            { id: 'billing', label: 'Tax & Revenue', icon: <BillingSymbol /> },
            { id: 'security', label: 'Security & Access', icon: <SecuritySymbol color="#EF4444" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`flex items-center gap-4 px-5 py-4 rounded-[20px] transition-all ${activeTab === tab.id ? 'bg-[#111827] text-white shadow-xl translate-x-1' : 'text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6]'}`}
            >
              <div className={`w-5 h-5 shrink-0 ${activeTab === tab.id ? 'text-white' : 'text-[#9CA3AF]'}`}>{tab.icon}</div>
              <span className="uppercase tracking-widest text-[9px] font-black">{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* 3. Main Content Area */}
        <main className="flex-1 bg-white rounded-[32px] p-10 shadow-[0_10px_50px_-12px_rgba(0,0,0,0.05)] overflow-y-auto scrollbar-none">
          <div className="max-w-3xl mx-auto">
            
            {activeTab === 'general' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <header>
                  <h3 className="text-2xl font-black text-[#111827] tracking-tight">Center Identity</h3>
                  <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.2em] mt-1">Global Branding and Metadata Management</p>
                </header>

                <div className="h-px bg-[#F3F4F6] w-full"></div>

                <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <div className="space-y-2">
                         <label className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">Center Designation</label>
                         <input type="text" defaultValue="TrueTestLabs HQ" className="w-full bg-[#F3F4F6] border-transparent rounded-2xl px-5 py-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#111827] transition-all font-bold text-[#111827]" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">System Identity Code</label>
                         <input type="text" defaultValue="TTL-NY-001" className="w-full bg-[#F3F4F6] border-transparent rounded-2xl px-5 py-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#111827] transition-all font-bold text-[#111827]" />
                       </div>
                    </div>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#F3F4F6] rounded-[32px] p-8 bg-[#F3F4F6]/30 group cursor-pointer hover:border-[#111827] transition-all">
                       <div className="w-20 h-20 bg-white rounded-[24px] flex items-center justify-center text-3xl shadow-sm mb-4 group-hover:scale-105 transition-transform">🏷️</div>
                       <p className="text-[10px] font-black text-[#111827] uppercase tracking-widest">Update Portal Logo</p>
                       <p className="text-[8px] text-[#9CA3AF] mt-1 font-bold uppercase tracking-wider">Clinical Vector or Raster (Max 5MB)</p>
                    </div>
                </div>

                 <div className="space-y-2">
                   <label className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">Administrative Headquarters Address</label>
                   <textarea rows={3} className="w-full bg-[#F3F4F6] border-transparent rounded-2xl px-5 py-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#111827] transition-all font-bold text-[#111827] resize-none" defaultValue="12th Floor, Biotech Tower, Science Park, New York, NY 10001" />
                 </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <header>
                  <h3 className="text-2xl font-black text-[#111827] tracking-tight">Visual Framework</h3>
                  <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.2em] mt-1">Interface Themes and Global Aesthetic Policy</p>
                </header>

                <div className="h-px bg-[#F3F4F6] w-full"></div>

                <div className="space-y-6">
                   <div className="flex items-center justify-between p-8 bg-[#F3F4F6] rounded-[32px] border border-white transition-all shadow-sm">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-xl transition-all bg-white">
                           ☀️
                        </div>
                        <div>
                          <p className="text-lg font-black text-[#111827]">Neo-Clinical (Standard)</p>
                          <p className="text-[9px] text-[#9CA3AF] font-bold uppercase tracking-widest mt-1">High-precision light interface optimized for diagnostic command centers</p>
                        </div>
                      </div>
                      <div className="text-[9px] font-black text-white uppercase tracking-widest px-5 py-2 bg-[#111827] rounded-full shadow-lg">Active System</div>
                   </div>

                   <div className="p-8 border border-[#F3F4F6] rounded-[32px] bg-white text-center">
                      <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-[0.3em]">Alternate themes restricted by system administrator</p>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'operations' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <header>
                  <h3 className="text-2xl font-black text-[#111827] tracking-tight">Ops & Logistics</h3>
                  <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.2em] mt-1">Operational Rules and Service Mesh Availability</p>
                </header>

                <div className="h-px bg-[#F3F4F6] w-full"></div>

                 <div className="space-y-6">
                    <div className="flex items-center justify-between p-7 bg-[#F3F4F6] rounded-[32px]">
                       <div>
                         <p className="text-sm font-black text-[#111827]">Diagnostic Dispatch Network</p>
                         <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-widest mt-1">Allow remote phlebotomy and collection protocols</p>
                       </div>
                       <button className="w-14 h-7 bg-[#111827] rounded-full relative shadow-inner">
                          <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-md"></div>
                       </button>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-2">
                         <label className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">Maximum Operational Radius (KM)</label>
                         <input type="number" defaultValue="25" className="w-full bg-[#F3F4F6] border-transparent rounded-2xl px-5 py-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#111827] transition-all font-bold text-[#111827]" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">Service Window Interval</label>
                         <select className="w-full bg-[#F3F4F6] border-transparent rounded-2xl px-5 py-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#111827] transition-all font-bold text-[#111827]">
                            <option>15 Minute Clinical Blocks</option>
                            <option>30 Minute Clinical Blocks</option>
                            <option>60 Minute Clinical Blocks</option>
                         </select>
                       </div>
                    </div>

                    <div className="flex items-center justify-between p-7 bg-white border border-[#F3F4F6] rounded-[32px]">
                       <div>
                         <p className="text-sm font-black text-[#111827]">24/7 Surgical Processing</p>
                         <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-widest mt-1">Enable around-the-clock lab throughput</p>
                       </div>
                       <button className="w-14 h-7 bg-[#F3F4F6] rounded-full relative shadow-inner">
                          <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full"></div>
                       </button>
                    </div>
                </div>
              </div>
            )}

            {activeTab === 'clinical' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <header>
                  <h3 className="text-2xl font-black text-[#111827] tracking-tight">Clinical Governance</h3>
                  <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.2em] mt-1">Verification Protocols and Report Authentication</p>
                </header>

                <div className="h-px bg-[#F3F4F6] w-full"></div>

                 <div className="flex items-start gap-10">
                    <div className="flex-1 space-y-4">
                       <div className="flex items-center justify-between p-5 bg-[#F3F4F6] rounded-2xl">
                         <p className="text-[9px] font-black text-[#111827] uppercase tracking-widest">Auto-dispatch Protocols</p>
                         <button className="w-10 h-5 bg-[#111827] rounded-full relative">
                            <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                         </button>
                       </div>
                       <div className="flex items-center justify-between p-5 bg-[#F3F4F6] rounded-2xl">
                         <p className="text-[9px] font-black text-[#111827] uppercase tracking-widest">NABL Header Integration</p>
                         <button className="w-10 h-5 bg-[#D1D5DB] rounded-full relative">
                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                         </button>
                       </div>
                    </div>
                                      
                    <div className="w-72 aspect-video bg-[#F3F4F6]/50 border-2 border-dashed border-[#F3F4F6] rounded-[32px] flex flex-col items-center justify-center p-8 text-center group cursor-pointer hover:border-[#111827] transition-all">
                       <div className="text-3xl mb-3 transition-transform group-hover:scale-110">✍️</div>
                       <p className="text-[10px] font-black text-[#111827] uppercase tracking-widest leading-relaxed">Authorized Pathologist Authentication</p>
                       <p className="text-[8px] text-[#9CA3AF] mt-1 font-bold uppercase tracking-wider">Transparent Vector Signature Only</p>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <header>
                  <h3 className="text-2xl font-black text-[#111827] tracking-tight">System Integrity</h3>
                  <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.2em] mt-1">Data Sovereignty and Access Control Policies</p>
                </header>

                <div className="h-px bg-[#F3F4F6] w-full"></div>

                 <div className="space-y-6">
                    <div className="flex items-center justify-between p-8 bg-rose-50 rounded-[32px] border border-rose-100">
                       <div className="flex items-center gap-6">
                         <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-rose-500 shadow-sm border border-rose-100/50">
                           <div className="w-5 h-5">
                             <SecuritySymbol />
                           </div>
                         </div>
                         <div>
                           <p className="text-sm font-black text-rose-900 tracking-tight">Global Multi-Factor Protocol</p>
                           <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mt-1">Mandatory 2FA enforcement for all laboratory personnel</p>
                         </div>
                       </div>
                       <button className="w-14 h-7 bg-rose-500 rounded-full relative shadow-inner">
                          <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-md"></div>
                       </button>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-2">
                         <label className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">Session Inactivity Timeout</label>
                         <input type="number" defaultValue="30" className="w-full bg-[#F3F4F6] border-transparent rounded-2xl px-5 py-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#111827] transition-all font-bold text-[#111827]" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest ml-1">Report Access Token Life</label>
                         <select className="w-full bg-[#F3F4F6] border-transparent rounded-2xl px-5 py-4 text-xs focus:outline-none focus:ring-2 focus:ring-[#111827] transition-all font-bold text-[#111827]">
                            <option>7-Day Clinical Window</option>
                            <option>30-Day Storage Window</option>
                            <option>Permanent Archival Access</option>
                         </select>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
