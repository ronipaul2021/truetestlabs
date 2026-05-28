"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { NewOrderModal } from "./orders/components/OrderModals";
import {
  DashboardSymbol,
  OrdersSymbol,
  ServicesSymbol,
  AnalyticsSymbol,
  RevenueSymbol,
  EfficiencySymbol,
  SuccessSymbol,
  AppearanceSymbol,
  ClinicalSymbol
} from "./components/Symbols";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const { currentCenter, setCurrentCenter, requests, setRequests, refreshRequests, centerLogo, setCenterLogo, adminPhoto, setAdminPhoto } = useDashboard();
  const API_URL = typeof window !== "undefined"
    ? `http://${window.location.hostname}:3000`
    : "http://localhost:3000";
  const [serviceData, setServiceData] = useState({ name: "", price: "" });

  // Executive Profile Editor State
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [editProfileData, setEditProfileData] = useState<any>(null);

  // Quick Actions State
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);

  // Sync edit data when opening
  useEffect(() => {
    if (isProfileEditorOpen && currentCenter) {
      setEditProfileData({ ...currentCenter });
    }
  }, [isProfileEditorOpen, currentCenter]);

  const addService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCenter) return;
    try {
      const response = await fetch(`${API_URL}/centers/${currentCenter.id}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceData),
      });
      if (response.ok) {
        setServiceData({ name: "", price: "" });
        const servResp = await fetch(`${API_URL}/centers/${currentCenter.id}/services`);
        const servs = await servResp.json();
        setCurrentCenter({ ...currentCenter, services: servs });
      }
    } catch (error) {
      console.error("Data sync failed");
    }
  };

  const updateRequestStatus = async (requestId: number, status: string) => {
    try {
      const response = await fetch(`${API_URL}/requests/${requestId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        setRequests(requests.map(r => r.id === requestId ? { ...r, status } : r));
      }
    } catch (e) {
      console.error("Status update failed");
    }
  };

  const handleReportUpload = async (requestId: number, file: File) => {
    const formData = new FormData();
    formData.append("report", file);
    try {
      const response = await fetch(`${API_URL}/requests/${requestId}/upload-report`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const updated = await response.json();
        setRequests(requests.map(r => r.id === requestId ? updated : r));
      }
    } catch (e) {
      console.error("Report upload failed");
    }
  };

  const acceptRequest = async (requestId: number) => {
    if (!currentCenter) return;
    try {
      const response = await fetch(`${API_URL}/requests/${requestId}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ centerId: currentCenter.id }),
      });
      if (response.ok) {
        setRequests(requests.map(r => r.id === requestId ? { ...r, status: 'accepted', centerId: currentCenter.id } : r));
      }
    } catch (e) {
      console.error("Acceptance failed");
    }
  };

  if (!currentCenter) return null;

  // ── Derived metrics (all from real request data) ──
  const pendingCount    = requests.filter(r => r.status === 'pending').length;
  const processingCount = requests.filter(r => r.status === 'processing' || r.status === 'collecting').length;
  const completedCount  = requests.filter(r => r.status === 'completed').length;
  const todayRevenue    = requests.filter(r => r.reportUrl).length * 450;

  const peakSlots = [
    { h: "08", load: 10 }, { h: "09", load: 40 }, { h: "10", load: 95 },
    { h: "11", load: 70 }, { h: "12", load: 20 }, { h: "13", load: 5  },
    { h: "14", load: 85 }, { h: "15", load: 55 }, { h: "16", load: 75 },
    { h: "17", load: 25 }, { h: "18", load: 8  },
  ];

  const kpiCards = [
    {
      label: "Today's Revenue",
      value: `₹${todayRevenue.toLocaleString()}`,
      sub: "+1.2% vs yesterday",
      positive: true,
      color: "#6366F1",
      icon: <RevenueSymbol />,
    },
    {
      label: "Pending Orders",
      value: String(pendingCount),
      sub: pendingCount > 0 ? "Require attention" : "All caught up",
      positive: pendingCount === 0,
      color: "#F43F5E",
      icon: <OrdersSymbol />,
    },
    {
      label: "Processing",
      value: String(processingCount),
      sub: "Active in lab",
      positive: true,
      color: "#F59E0B",
      icon: <EfficiencySymbol />,
    },
    {
      label: "Completed",
      value: String(completedCount),
      sub: "Reports dispatched",
      positive: true,
      color: "#10B981",
      icon: <SuccessSymbol />,
    },
    {
      label: "Patient CSAT",
      value: "4.9",
      sub: "★★★★★ out of 5",
      positive: true,
      color: "#06B6D4",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:'100%',height:'100%'}}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
    },
  ];

  const services = (currentCenter.services && currentCenter.services.length > 0
    ? currentCenter.services.slice(0, 7).map((s: any, i: number) => ({
        name: s.name,
        price: s.price,
        accent: ['#F43F5E','#10B981','#F59E0B','#6366F1','#06B6D4','#A855F7','#F43F5E'][i % 7],
      }))
    : [
        { name: "Blood Test (CBC)",  price: "220",   accent: "#F43F5E" },
        { name: "MRI Scan Brain",    price: "1,450", accent: "#10B981" },
        { name: "Lipid Profile",     price: "380",   accent: "#F59E0B" },
        { name: "X-Ray Chest",       price: "450",   accent: "#6366F1" },
        { name: "Thyroid T3/T4",     price: "520",   accent: "#06B6D4" },
        { name: "ECG Standard",      price: "280",   accent: "#A855F7" },
        { name: "HbA1c (Diabetes)",  price: "340",   accent: "#F43F5E" },
      ]
  );

  return (
    <div className="flex-1 flex flex-col min-h-full bg-[#0F1629]">

      {/* ── TOP CONTROL BAR ─────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 pt-4 pb-2 shrink-0">
        <div className="relative bg-[#162035]/80 backdrop-blur-xl border border-white/[0.08] rounded-[22px] px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#6366F1]/50 to-transparent" />
          <div className="absolute -top-20 -left-10 w-48 h-48 bg-[#6366F1] rounded-full blur-[90px] opacity-[0.07] pointer-events-none" />

          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#6366F1]/20 to-[#10B981]/10 border border-[#6366F1]/25 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#6366F1" strokeWidth="2"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#6366F1" strokeWidth="2"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#10B981" strokeWidth="2"/>
                <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="#10B981" strokeWidth="2"/>
              </svg>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-[18px] font-black tracking-tight text-white">Executive Overview</h1>
                {currentCenter.isVerified ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[#10B981]/10 border border-[#10B981]/25 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_5px_#10B981]" />
                    <span className="text-[8px] font-black text-[#10B981] uppercase tracking-widest">Verified Partner</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[#F59E0B]/10 border border-[#F59E0B]/25 rounded-full animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                    <span className="text-[8px] font-black text-[#F59E0B] uppercase tracking-widest">Pending Verification</span>
                  </div>
                )}
              </div>
              <p className="text-[10px] font-medium text-white/35 uppercase tracking-[0.15em] mt-0.5">Central Laboratory Operations — Live Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={() => setIsWalkInModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#10B981]/10 hover:bg-[#10B981]/20 border border-[#10B981]/25 text-[#10B981] rounded-xl transition-all text-[11px] font-bold whitespace-nowrap">
              <div className="w-3.5 h-3.5"><ClinicalSymbol /></div>
              New Walk-In
            </button>
            <button
              onClick={() => setIsProfileEditorOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] text-white/70 hover:text-white rounded-xl transition-all text-[11px] font-bold whitespace-nowrap">
              <div className="w-3.5 h-3.5 text-[#A855F7]"><AppearanceSymbol color="currentColor" /></div>
              Brand
            </button>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#10B981]/[0.07] border border-[#10B981]/20 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse shrink-0" />
              <span className="text-[11px] font-bold text-white/80 whitespace-nowrap">{pendingCount} Pending</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 pb-24 flex-1 overflow-y-auto">

        {/* ── 5 KPI CARDS ─────────────────────────────────────────────────────── */}
        <div className="max-w-[1600px] mx-auto mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {kpiCards.map((kpi, i) => (
            <div key={i} className="relative bg-[#162035]/80 backdrop-blur-md border border-white/[0.07] rounded-[20px] p-4 flex flex-col gap-3 overflow-hidden group hover:-translate-y-1 transition-all duration-300 shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[20px]" style={{ background: `linear-gradient(90deg, ${kpi.color}, ${kpi.color}60)` }} />
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-[0.15] pointer-events-none" style={{ background: kpi.color }} />
              <div className="flex items-start justify-between gap-2">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-tight">{kpi.label}</p>
                <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform" style={{ background: `${kpi.color}15`, color: kpi.color }}>
                  {kpi.icon}
                </div>
              </div>
              <div>
                <p className="text-[26px] font-black text-white tracking-tight leading-none">{kpi.value}</p>
                <p className={`text-[9px] font-bold mt-1.5 ${kpi.positive ? 'text-[#10B981]' : 'text-[#F43F5E]'}`}>{kpi.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── MAIN GRID ─────────────────────────────────────────────────────── */}
        <div className="max-w-[1600px] mx-auto mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* ── ORDER PIPELINE — Kanban Swimlanes (5 cols) ── */}
          <section className="lg:col-span-5">
            <div className="relative bg-[#162035]/80 backdrop-blur-md border border-white/[0.07] rounded-[22px] p-5 shadow-2xl overflow-hidden h-full">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F43F5E]/40 to-transparent" />

              <div className="flex items-center justify-between mb-5">
                <h2 className="flex items-center gap-2.5 text-[15px] font-black text-white">
                  <div className="w-8 h-8 rounded-xl bg-[#F43F5E]/10 border border-[#F43F5E]/20 flex items-center justify-center text-[#F43F5E] p-1.5"><OrdersSymbol /></div>
                  Live Order Pipeline
                </h2>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest">Live Sync</span>
                </div>
              </div>

              <div className="space-y-3">
                {/* Pending Swimlane */}
                <div className="bg-[#F43F5E]/[0.06] border border-[#F43F5E]/20 rounded-[18px] p-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#F43F5E] shadow-[0_0_6px_#F43F5E]" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Critical — Pending</span>
                    </div>
                    <span className="text-[10px] font-black text-[#F43F5E] bg-[#F43F5E]/15 px-2.5 py-0.5 rounded-full">{pendingCount}</span>
                  </div>
                  {pendingCount === 0 ? (
                    <p className="text-center text-[10px] text-white/30 font-bold py-3 uppercase tracking-widest">All Clear ✓</p>
                  ) : (
                    <div className="space-y-2">
                      {requests.filter(r => r.status === 'pending').slice(0, 3).map((req) => (
                        <div key={req.id} className="bg-[#1E1015] border border-[#F43F5E]/20 rounded-[14px] px-4 py-3 flex items-center justify-between hover:border-[#F43F5E]/40 transition-all">
                          <div>
                            <p className="text-[9px] font-bold text-[#F43F5E]/60 uppercase tracking-widest mb-0.5">#{req.id} · URGENT</p>
                            <p className="text-[13px] font-bold text-white">{req.patientName || 'Unknown Patient'}</p>
                          </div>
                          <button
                            onClick={() => acceptRequest(req.id)}
                            className="px-3 py-1.5 bg-[#F43F5E] hover:bg-[#E11D48] text-white text-[9px] font-black uppercase tracking-widest rounded-full transition-all shadow-[0_0_12px_rgba(244,63,94,0.35)]">
                            Accept
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Processing Swimlane */}
                <div className="bg-[#F59E0B]/[0.05] border border-[#F59E0B]/20 rounded-[18px] p-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#F59E0B] shadow-[0_0_6px_#F59E0B]" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Testing In-Process</span>
                    </div>
                    <span className="text-[10px] font-black text-[#F59E0B] bg-[#F59E0B]/15 px-2.5 py-0.5 rounded-full">{processingCount}</span>
                  </div>
                  {processingCount === 0 ? (
                    <p className="text-center text-[10px] text-white/30 font-bold py-3 uppercase tracking-widest">No Active Tests</p>
                  ) : (
                    <div className="space-y-2">
                      {requests.filter(r => r.status === 'processing' || r.status === 'collecting').slice(0, 3).map((req) => (
                        <div key={req.id} className="bg-[#1A1408] border border-[#F59E0B]/15 rounded-[14px] px-4 py-3 flex items-center justify-between">
                          <div>
                            <p className="text-[9px] font-bold text-[#F59E0B]/60 uppercase tracking-widest mb-0.5">#{req.id} · LAB PHASE</p>
                            <p className="text-[13px] font-bold text-white">{req.patientName || 'Unknown Patient'}</p>
                          </div>
                          <span className="px-3 py-1 bg-[#F59E0B]/10 text-[#F59E0B] text-[9px] font-black uppercase tracking-widest rounded-full">Processing</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Completed Swimlane */}
                <div className="bg-[#10B981]/[0.05] border border-[#10B981]/20 rounded-[18px] p-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Completed & Dispatched</span>
                    </div>
                    <span className="text-[10px] font-black text-[#10B981] bg-[#10B981]/15 px-2.5 py-0.5 rounded-full">{completedCount}</span>
                  </div>
                  {completedCount === 0 ? (
                    <p className="text-center text-[10px] text-white/30 font-bold py-3 uppercase tracking-widest">Nothing Dispatched Yet</p>
                  ) : (
                    <div className="space-y-2">
                      {requests.filter(r => r.status === 'completed').slice(0, 3).map((req) => (
                        <div key={req.id} className="bg-[#0A1A13] border border-[#10B981]/15 rounded-[14px] px-4 py-3 flex items-center justify-between opacity-75 hover:opacity-100 transition-opacity">
                          <p className="text-[13px] font-bold text-white/60 line-through">{req.patientName || 'Unknown Patient'}</p>
                          <span className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] text-[9px] font-black uppercase tracking-widest rounded-full">Done ✓</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ── RIGHT COLUMN (7 cols) ── */}
          <div className="lg:col-span-7 flex flex-col gap-4">

            {/* Revenue Chart + Services side-by-side */}
            <div className="grid md:grid-cols-5 gap-4">

              {/* Revenue Analytics Chart */}
              <div className="md:col-span-3 relative bg-[#162035]/80 backdrop-blur-md border border-white/[0.07] rounded-[22px] p-5 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6366F1]/40 to-transparent" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#6366F1] rounded-full blur-[70px] opacity-[0.06] pointer-events-none" />

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <h2 className="flex items-center gap-2.5 text-[15px] font-black text-white">
                    <div className="w-8 h-8 rounded-xl bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center text-[#6366F1] p-1.5"><AnalyticsSymbol /></div>
                    Revenue Analytics
                  </h2>
                  <div className="text-right">
                    <p className="text-[20px] font-black text-white">₹{todayRevenue.toLocaleString()}</p>
                    <p className="text-[9px] font-bold text-[#10B981] uppercase tracking-widest">+24% forecast</p>
                  </div>
                </div>

                <svg viewBox="0 0 340 130" className="w-full relative z-10" style={{ height: '130px' }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="prevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[20, 50, 80, 110].map(y => (
                    <line key={y} x1="0" y1={y} x2="340" y2={y} stroke="#FFFFFF" strokeWidth="0.5" opacity="0.05" />
                  ))}
                  <path d="M 0 120 C 60 90, 120 100, 170 70 C 220 40, 280 80, 340 60 L 340 120 Z" fill="url(#prevGrad)" />
                  <path d="M 0 120 C 60 90, 120 100, 170 70 C 220 40, 280 80, 340 60" fill="none" stroke="#10B981" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.7" />
                  <path d="M 0 120 C 50 50, 110 20, 170 80 C 220 130, 280 10, 340 38 L 340 120 Z" fill="url(#revGrad)" />
                  <path d="M 0 120 C 50 50, 110 20, 170 80 C 220 130, 280 10, 340 38" fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="340" cy="38" r="5" fill="#0F1629" stroke="#F43F5E" strokeWidth="2" />
                  <path d="M 280 10 C 300 18, 320 30, 340 38" fill="none" stroke="#F43F5E" strokeWidth="2" strokeDasharray="4 4" opacity="0.8" />
                  {["8am","10am","12pm","2pm","4pm","6pm"].map((l, i) => (
                    <text key={l} x={i * 68} y="128" fill="#6B7280" fontSize="8" fontWeight="bold">{l}</text>
                  ))}
                </svg>

                <div className="flex items-center gap-5 mt-2 relative z-10">
                  {[{c:"#6366F1",l:"Current"},{c:"#10B981",l:"Previous"},{c:"#F43F5E",l:"Forecast"}].map(d => (
                    <div key={d.l} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{background:d.c}} />
                      <span className="text-[9px] font-bold text-white/40">{d.l}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Smart Services List */}
              <div className="md:col-span-2 relative bg-[#162035]/80 backdrop-blur-md border border-white/[0.07] rounded-[22px] p-5 shadow-2xl overflow-hidden flex flex-col">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#10B981]/40 to-transparent" />
                <h2 className="flex items-center gap-2.5 text-[15px] font-black text-white mb-4 shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981] p-1.5"><ServicesSymbol /></div>
                  Services
                </h2>
                <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-none">
                  {services.map((s, i) => (
                    <div 
                      key={i} 
                      onClick={() => router.push('/dashboard/services')}
                      className="flex items-center justify-between rounded-[14px] px-3 py-2.5 bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/10 transition-all cursor-pointer">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{background: s.accent, boxShadow: `0 0 5px ${s.accent}70`}} />
                        <span className="text-[12px] font-semibold text-white truncate">{s.name}</span>
                        {i === 0 && (
                          <span className="text-[7px] font-black text-white px-1.5 py-0.5 rounded-full uppercase tracking-widest shrink-0" style={{background: s.accent}}>HOT</span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-white/60 shrink-0 ml-2">₹{s.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── PEAK HOURS HEATMAP BAR CHART ── */}
            <div className="relative bg-[#162035]/80 backdrop-blur-md border border-white/[0.07] rounded-[22px] p-5 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F59E0B]/40 to-transparent" />
              <div className="flex items-center justify-between mb-5">
                <h2 className="flex items-center gap-2.5 text-[15px] font-black text-white">
                  <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B] p-1.5"><DashboardSymbol /></div>
                  Peak Hours — Today's Load
                </h2>
                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  Next Peak: <span className="text-[#F43F5E] ml-1 font-black">10:00 AM</span>
                </div>
              </div>

              <div className="flex items-end gap-1.5 sm:gap-2" style={{height: '72px'}}>
                {peakSlots.map((slot, i) => {
                  const color = slot.load >= 80 ? '#F43F5E' : slot.load >= 50 ? '#F59E0B' : '#10B981';
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group" style={{height: '72px'}}>
                      <div className="flex-1 w-full flex items-end">
                        <div
                          className="w-full rounded-t-lg overflow-hidden relative"
                          style={{ height: `${Math.max(slot.load, 8)}%`, background: `${color}20`, border: `1px solid ${color}35` }}>
                          <div className="absolute bottom-0 left-0 right-0 rounded-t-lg" style={{height: '35%', background: color, opacity: 0.65}} />
                        </div>
                      </div>
                      <span className="text-[7px] sm:text-[8px] font-bold text-white/30 group-hover:text-white/60 transition-colors leading-none">{slot.h}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 sm:gap-6 mt-4 pt-3 border-t border-white/[0.05] flex-wrap">
                {[{c:'#F43F5E', l:'Peak ≥80%'},{c:'#F59E0B', l:'Busy 50–79%'},{c:'#10B981', l:'Quiet <50%'}].map(d => (
                  <div key={d.l} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-sm" style={{background:d.c}} />
                    <span className="text-[9px] font-bold text-white/40">{d.l}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>{/* end right column */}
        </div>{/* end main grid */}
      </div>

      <NewOrderModal
        isOpen={isWalkInModalOpen}
        onClose={() => setIsWalkInModalOpen(false)}
        onSuccess={() => { refreshRequests(); }}
      />

      {/* ── PROFILE EDITOR MODAL (Brand) ── */}
      {isProfileEditorOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsProfileEditorOpen(false)}></div>
          <div className="relative bg-[#162035] border border-white/[0.1] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#A855F7]/50 to-transparent" />
            <div className="px-6 py-5 border-b border-white/[0.05] flex items-center justify-between bg-[#12203A]/50">
              <div>
                <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                  <div className="w-6 h-6 text-[#A855F7]"><AppearanceSymbol color="currentColor" /></div>
                  Brand Settings
                </h2>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Customize your Center's Profile</p>
              </div>
              <button onClick={() => setIsProfileEditorOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-5">
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#A855F7]/20 to-[#6366F1]/20 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                  {centerLogo ? (
                    <img src={centerLogo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-black text-white/50">{currentCenter?.name?.substring(0,2).toUpperCase()}</span>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <span className="text-[10px] font-bold text-white">Upload</span>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-black text-white/50 uppercase tracking-widest px-1 block mb-2">Center Logo</label>
                  <input type="file" accept="image/*" className="text-xs text-white/60 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#A855F7]/10 file:text-[#A855F7] hover:file:bg-[#A855F7]/20 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setCenterLogo(URL.createObjectURL(e.target.files[0]));
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/50 uppercase tracking-widest px-1">Center Name</label>
                <input 
                  type="text" 
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#A855F7]/40 focus:border-[#A855F7] transition-all"
                  value={editProfileData?.name || ''}
                  onChange={e => setEditProfileData({...editProfileData, name: e.target.value})}
                />
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => {
                    if (editProfileData) {
                      setCurrentCenter({...currentCenter, name: editProfileData.name});
                    }
                    setIsProfileEditorOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-[#A855F7] to-[#6366F1] text-white px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg hover:opacity-90 transition-all text-center">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
