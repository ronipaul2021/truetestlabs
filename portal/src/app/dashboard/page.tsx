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
  PatientsSymbol,
  EfficiencySymbol,
  SuccessSymbol,
  TechnicianSymbol,
  PlusSymbol,
  SupportSymbol,
  ExportSymbol,
  ArrowUpSymbol,
  ArrowDownSymbol,
  AppearanceSymbol,
  ClinicalSymbol
} from "./components/Symbols";

const API_URL = "http://localhost:3000";

export default function Dashboard() {
  const { currentCenter, setCurrentCenter, requests, setRequests, refreshRequests, centerLogo, setCenterLogo, adminPhoto, setAdminPhoto } = useDashboard();
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

  return (
    <div className="flex-1 flex flex-col min-h-full">
      {/* 1. Sub-Dashboard Control Panel */}
      <div className="p-6 pb-2">
        <div className="bg-white rounded-[32px] p-6 flex items-center justify-between transition-all">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center">
              {/* The Icon Container */}
              <div className="w-12 h-12 bg-[#dcf0fa] rounded-2xl flex items-center justify-center relative z-10">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#023e8a" strokeWidth="1.8" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#023e8a" strokeWidth="1.8" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#023e8a" strokeWidth="1.8" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="#023e8a" strokeWidth="1.8" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight text-[#023e8a]">
                  Executive Overview
                </h1>
                {currentCenter.isVerified ? (
                  <div className="bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Verified</span>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-100 px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Verification Pending</span>
                  </div>
                )}
              </div>
              <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-[0.15em] mt-1">Central Laboratory Operations Control</p>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-emerald-50 p-2.5 rounded-full pr-6">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            </div>
            <div className="flex flex-col">
              <p className="text-[9px] font-black text-emerald-600/50 uppercase tracking-widest leading-none">System Link</p>
              <span className="text-[11px] font-bold text-emerald-900 mt-1">Active Control Node</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-24">
        {/* Urgent Alerts Ribbon */}
        <div className="max-w-[1600px] mx-auto mb-4">
          <div className="bg-[#FF6B9D]/10 border border-[#FF6B9D]/20 rounded-2xl p-3 flex items-center justify-between transition-all">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FF6B9D]/20 flex items-center justify-center text-[#FF6B9D] animate-pulse">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 9-5-9-5-9 5 9 5z" /><path d="m12 14 9-5-9-5-9 5 9 5z" /><path d="m5 10.11v4.79L12 20l7-5.1v-4.79" /></svg>
              </div>
              <div>
                <h4 className="text-xs font-black text-[#FF6B9D] uppercase tracking-widest">System Alert: High Volume</h4>
                <p className="text-[10px] font-medium text-[#111827]">Hematology processing is experiencing a 15-minute delay due to peak load.</p>
              </div>
            </div>
            <button className="text-[9px] font-bold text-[#FF6B9D] uppercase tracking-widest bg-white px-4 py-1.5 rounded-full hover:bg-[#FF6B9D] hover:text-white transition-all shadow-sm">Acknowledge</button>
          </div>
        </div>

        {/* 2. The Pulse (Real-Time Stats) */}
        <div className="max-w-[1600px] mx-auto mb-3 grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-[28px] p-6 flex items-center justify-between transition-all hover:scale-[1.01] border border-slate-100">
            <div>
              <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">Processing Efficiency</p>
              <h3 className="text-2xl font-bold text-[#111827] tracking-tight">98.2%</h3>
              <div className="mt-2 inline-flex items-center gap-1 bg-[#E2F3E9] px-2 py-0.5 rounded-full">
                <span className="text-[9px] font-bold text-[#2D7A4D]">+0.4%</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#E2F3E9] flex items-center justify-center p-2 text-[#2D7A4D]">
              <SuccessSymbol />
            </div>
          </div>

          <div className="bg-white rounded-[28px] p-6 flex items-center justify-between transition-all hover:scale-[1.01] border border-slate-100">
            <div>
              <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">Average TAT</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-2xl font-bold text-[#111827] tracking-tight">45</h3>
                <span className="text-sm font-medium text-[#9CA3AF]">mins</span>
              </div>
              <div className="mt-2 inline-flex items-center gap-1 bg-[#DBEAFE] px-2 py-0.5 rounded-full">
                <span className="text-[9px] font-bold text-[#023e8a]">-5 mins faster</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] flex items-center justify-center p-2 text-[#023e8a]">
              <EfficiencySymbol />
            </div>
          </div>

          <div className="bg-white rounded-[28px] p-6 flex items-center justify-between transition-all hover:scale-[1.01] border border-slate-100">
            <div>
              <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">Patient CSAT</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-2xl font-bold text-[#111827] tracking-tight">4.9</h3>
                <span className="text-sm font-medium text-[#9CA3AF]">/ 5</span>
              </div>
              <div className="mt-2 inline-flex items-center gap-1 bg-[#E2F3E9] px-2 py-0.5 rounded-full">
                <span className="text-[9px] font-bold text-[#2D7A4D]">+0.1</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center p-2 text-[#F59E0B]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            </div>
          </div>

          <div className="bg-white rounded-[28px] p-6 flex items-center justify-between transition-all hover:scale-[1.01] border border-slate-100">
            <div>
              <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">Today's Revenue</p>
              <h3 className="text-2xl font-bold text-[#111827] tracking-tight">${(requests.filter(r => r.reportUrl).length * 450).toLocaleString() || "0"}</h3>
              <div className="mt-2 inline-flex items-center gap-1 bg-[#E2F3E9] px-2 py-0.5 rounded-full">
                <span className="text-[9px] font-bold text-[#2D7A4D]">+1.2%</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#E2F3E9] flex items-center justify-center p-2 text-[#2D7A4D]">
              <RevenueSymbol />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 max-w-[1600px] mx-auto lg:min-h-[600px] pb-10">

          {/* 2. The Pipeline (Order Lifecycle - ~40%) */}
          <section className="lg:col-span-5 bg-white rounded-[32px] p-5 flex flex-col relative overflow-hidden min-h-[400px]">
            <div className="flex justify-between items-center mb-6 z-10 relative">
              <h2 className="text-lg font-bold text-[#111827] flex items-center gap-3">
                <div className="w-7 h-7 bg-[#F3F4F6] rounded-full flex items-center justify-center text-[#111827]"><OrdersSymbol /></div>
                Order Pipeline
              </h2>
              <div className="flex items-center gap-2 bg-[#E2F3E9] px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                <span className="text-[9px] font-bold text-[#2D7A4D] uppercase tracking-widest">Live Sync</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 z-10 relative scrollbar-none">
              <div className="space-y-2 pt-2 flex flex-col h-full min-h-[450px]">
                {/* CRITICAL */}
                <div className="bg-[#F3F4F6] rounded-[24px] p-3 relative min-h-[120px] flex flex-col flex-1">
                  <div className="flex items-center justify-between bg-white px-4 py-3 rounded-full relative z-20">
                    <div className="flex items-center gap-3.5">
                      <span className="w-2 h-2 rounded-full bg-[#DC3545]"></span>
                      <h3 className="text-[11px] font-bold text-[#111827] uppercase tracking-[0.15em]">Critical Requests</h3>
                    </div>
                    <span className="text-[10px] font-bold text-[#DC3545] bg-[#FEE2E2] px-3 py-0.5 rounded-full">{requests.filter(r => r.status === 'pending').length}</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    {requests.filter(r => r.status === 'pending').length === 0 ? (
                      <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.2em] opacity-60">All Caught Up</p>
                    ) : (
                      <div className="space-y-2 w-full mt-2">
                        {requests.filter(r => r.status === 'pending').slice(0, 3).map((req, idx) => (
                          <div key={req.id} className="bg-[#1A1D1F] rounded-[20px] p-5 relative group transition-all hover:scale-[1.01]">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-[9px] font-semibold text-[#9CA3AF] block mb-0.5 uppercase tracking-widest">#{req.id}024 • URGENT</span>
                                <span className="text-sm font-semibold text-white">{req.patientName || 'Sarah J.'}</span>
                              </div>
                              <button onClick={() => acceptRequest(req.id)} className="bg-white text-[#1A1D1F] px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-[#F3F4F6] transition-colors">
                                Accept
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* IN-PROCESS */}
                <div className="bg-[#F3F4F6] rounded-[24px] p-3 relative min-h-[120px] flex flex-col flex-1">
                  <div className="flex items-center justify-between bg-white px-4 py-3 rounded-full relative z-20">
                    <div className="flex items-center gap-3.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                      <h3 className="text-[11px] font-bold text-[#111827] uppercase tracking-[0.15em]">Testing In-Process</h3>
                    </div>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">{requests.filter(r => r.status === 'processing' || r.status === 'collecting').length}</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    {requests.filter(r => r.status === 'processing' || r.status === 'collecting').length === 0 ? (
                      <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.2em] opacity-60">No Active Tests</p>
                    ) : (
                      <div className="space-y-2 w-full mt-3">
                        {requests.filter(r => r.status === 'processing' || r.status === 'collecting').slice(0, 3).map((req, idx) => (
                          <div key={req.id} className="bg-white rounded-[20px] p-4 relative group transition-all hover:scale-[1.01]">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="text-sm font-semibold text-[#111827]">{req.patientName || 'Sarah J.'}</span>
                                <p className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider mt-0.5">Laboratory Phase</p>
                              </div>
                              <span className="bg-[#F3F4F6] text-[#9CA3AF] px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">Processing</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* READY FOR REVIEW */}
                <div className="bg-[#F3F4F6] rounded-[24px] p-3 relative min-h-[120px] flex flex-col flex-1">
                  <div className="flex items-center justify-between bg-white px-4 py-3 rounded-full relative z-20">
                    <div className="flex items-center gap-3.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                      <h3 className="text-[11px] font-bold text-[#111827] uppercase tracking-[0.15em]">Ready For Review</h3>
                    </div>
                    <span className="text-[10px] font-bold text-[#10B981] bg-[#E2F3E9] px-3 py-1 rounded-full">{requests.filter(r => r.status === 'completed').length}</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    {requests.filter(r => r.status === 'completed').length === 0 ? (
                      <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.2em] opacity-60">Everything Clear</p>
                    ) : (
                      <div className="space-y-2 w-full mt-3">
                        {requests.filter(r => r.status === 'completed').slice(0, 3).map((req, idx) => (
                          <div key={req.id} className="bg-white rounded-[20px] p-4 opacity-60 transition-all hover:opacity-100 mx-1">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold text-[#9CA3AF] line-through">{req.patientName || 'Sarah J.'}</span>
                              <span className="text-[10px] font-bold text-[#10B981] uppercase">Dispatched</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Column 2: Test Services (~30%) */}
          <section className="lg:col-span-3 bg-white rounded-[32px] p-5 flex flex-col relative overflow-hidden min-h-[400px]">
            <h2 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-3 relative z-10">
              <div className="w-7 h-7 bg-[#F3F4F6] rounded-full flex items-center justify-center text-[#111827]"><ServicesSymbol /></div>
              Smart Services
            </h2>

            <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1 z-10 relative scrollbar-none flex flex-col justify-between pt-4 gap-3">
              {[
                { title: "Blood Test (CBC)", dept: "Clinical Pathology", price: "220", hot: true, icon: <AppearanceSymbol />, color: "text-purple-400" },
                { title: "MRI Scan Brain", dept: "Radiology Dept", price: "1,450", hot: false, icon: <ClinicalSymbol />, color: "text-emerald-400" },
                { title: "Lipid Profile", dept: "Biochemistry", price: "380", hot: false, icon: <DashboardSymbol />, color: "text-amber-500" },
                { title: "X-Ray Chest", dept: "Radiology Dept", price: "450", hot: false, icon: <OrdersSymbol />, color: "text-[#10B981]" },
                { title: "Thyroid T3/T4", dept: "Endocrinology", price: "520", hot: false, icon: <EfficiencySymbol />, color: "text-blue-500" },
                { title: "ECG Standard", dept: "Cardiology", price: "280", hot: false, icon: <PatientsSymbol />, color: "text-rose-400" }
              ].slice(0, 6).map((service, i) => (
                <div key={i} className={`group relative flex flex-col justify-between rounded-[24px] p-3 transition-all duration-300 cursor-pointer border flex-1 ${service.hot ? 'bg-[#1A1D1F] border-[#1A1D1F] mt-2' : 'bg-[#F9FAFB] hover:bg-white border-transparent hover:border-slate-100 shadow-sm hover:shadow-md'}`}>

                  {service.hot && (
                    <div className="absolute -top-3 left-24 bg-[#D81B60] text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] animate-pulse z-20 ring-2 ring-[#1A1D1F]">
                      Hot & Popular
                    </div>
                  )}

                  <div className="flex items-center justify-between w-full mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center p-2.5 shrink-0 ${service.hot ? 'bg-white/10 text-purple-400' : 'bg-white shadow-sm ' + service.color}`}>
                        {service.icon}
                      </div>
                      <div className="flex flex-col">
                        <h3 className={`text-xs font-bold leading-tight ${service.hot ? 'text-white' : 'text-[#111827]'}`}>{service.title}</h3>
                        <p className={`text-[8px] font-bold uppercase tracking-[0.15em] mt-0.5 ${service.hot ? 'text-[#9CA3AF]' : 'text-[#9CA3AF]'}`}>{service.dept}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`${service.hot ? 'bg-white text-[#111827]' : 'bg-[#1A1D1F] text-white'} px-3 py-1 rounded-full shadow-sm shrink-0`}>
                        <p className="text-[10px] font-bold tracking-tight">${service.price}</p>
                      </div>
                    </div>
                  </div>

                  <div className={`w-full flex items-center justify-between border-t pt-2.5 mt-auto ${service.hot ? 'border-white/10' : 'border-slate-200/60'}`}>
                    <span className={`text-[8px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity ${service.hot ? 'text-white/60' : 'text-[#9CA3AF]'}`}>Quick Access</span>
                    <button className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest ${service.hot ? 'text-white hover:text-purple-300' : 'text-[#023e8a] hover:text-[#0052FF]'}`}>
                      View Details
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="m9 18 6-6-6-6" /></svg>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </section>

          {/* Column 3: Revenue Analytics & God View (~30%) */}
          <section className="lg:col-span-4 flex flex-col gap-3 min-h-[400px]">
            {/* Revenue Chart Widget */}
            <div className="bg-white rounded-[32px] p-5 flex flex-col relative shrink-0 transition-all">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-[#111827] flex items-center gap-3">
                  <div className="w-7 h-7 bg-[#F3F4F6] rounded-full flex items-center justify-center text-[#111827]"><AnalyticsSymbol /></div>
                  Analytics
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#023e8a]"></span>
                    <span className="text-[10px] font-bold text-[#9CA3AF]">Current</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#90e0ef]"></span>
                    <span className="text-[10px] font-bold text-[#9CA3AF]">Previous</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                    <span className="text-[10px] font-bold text-[#9CA3AF]">30-Day Forecast</span>
                  </div>
                </div>
              </div>

              {/* SVG Chart Replica (Current vs Previous vs Forecast) */}
              <div className="w-full relative min-h-[180px]">
                <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
                  {/* Horizontal Grid Lines */}
                  <path d="M 30 20 L 400 20 M 30 60 L 400 60 M 30 100 L 400 100 M 30 140 L 400 140 M 30 180 L 400 180" stroke="#F1F5F9" strokeWidth="1" />

                  {/* Y-Axis Labels */}
                  <text x="0" y="24" fill="#9CA3AF" fontSize="9" fontWeight="bold">12k</text>
                  <text x="0" y="64" fill="#9CA3AF" fontSize="9" fontWeight="bold">8k</text>
                  <text x="0" y="104" fill="#9CA3AF" fontSize="9" fontWeight="bold">4k</text>
                  <text x="0" y="144" fill="#9CA3AF" fontSize="9" fontWeight="bold">2k</text>
                  <text x="0" y="184" fill="#9CA3AF" fontSize="9" fontWeight="bold">0</text>

                  {/* X-Axis Labels */}
                  <text x="30" y="205" fill="#9CA3AF" fontSize="9" fontWeight="bold">8:00</text>
                  <text x="140" y="205" fill="#9CA3AF" fontSize="9" fontWeight="bold">12:00</text>
                  <text x="250" y="205" fill="#9CA3AF" fontSize="9" fontWeight="bold">16:00</text>
                  <text x="360" y="205" fill="#9CA3AF" fontSize="9" fontWeight="bold">20:00</text>

                  <defs>
                    <linearGradient id="magentaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#90e0ef" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#90e0ef" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#023e8a" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#023e8a" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Previous Layer (Ice Blue - Base) */}
                  <path d="M 30 180 C 80 120, 150 140, 200 100 C 250 60, 320 120, 380 90 L 380 180 L 30 180 Z" fill="url(#magentaGrad)" />
                  <path d="M 30 180 C 80 120, 150 140, 200 100 C 250 60, 320 120, 380 90" fill="none" stroke="#90e0ef" strokeWidth="2" strokeDasharray="4 2" strokeOpacity="0.6" strokeLinecap="round" />

                  {/* Current Layer (Navy - Dynamic) */}
                  <path d="M 30 180 C 70 80, 130 40, 190 120 C 240 180, 310 20, 380 60 L 380 180 L 30 180 Z" fill="url(#blueGrad)" />
                  <path d="M 30 180 C 70 80, 130 40, 190 120 C 240 180, 310 20, 380 60" fill="none" stroke="#023e8a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                  {/* Forecast Layer (Emerald - Dotted) */}
                  <path d="M 30 160 C 100 70, 200 140, 380 30" fill="none" stroke="#10B981" strokeWidth="2.5" strokeDasharray="4 6" strokeLinecap="round" />
                  <circle cx="380" cy="30" r="4" fill="white" stroke="#10B981" strokeWidth="2" />
                  <rect x="345" y="8" width="40" height="16" rx="8" fill="#10B981" opacity="0.1" />
                  <text x="352" y="19" fill="#10B981" fontSize="9" fontWeight="bold">+24%</text>
                </svg>
              </div>
            </div>


            {/* Operational Intelligence Widgets */}
            <div className="bg-white rounded-[32px] p-5 flex-1 overflow-hidden flex flex-col relative transition-all min-h-[340px]">

              {/* Daily Schedule / Peak Hours */}
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                    <div className="w-5 h-5 bg-[#F3F4F6] rounded-full flex items-center justify-center text-[#111827]"><DashboardSymbol /></div>
                    Peak Hours & Schedule
                  </h2>
                  <div className="text-[10px] font-bold text-[#9CA3AF] uppercase">Today</div>
                </div>

                {/* Detailed Schedule List */}
                <div className="flex-1 flex flex-col justify-between bg-[#F9FAFB] p-5 rounded-[24px] border border-slate-100">
                  {[
                    { time: "08:00 AM", bar: 0, text: "Lab opens, staff prep", type: "info" },
                    { time: "09:00 AM", bar: 20, orders: 5, status: "QUIET", type: "quiet" },
                    { time: "10:00 AM", bar: 90, orders: 13, status: "PEAK", type: "peak", emoji: "🔥" },
                    { time: "11:00 AM", bar: 60, orders: 8, status: "BUSY", type: "busy" },
                    { time: "12:00 PM", bar: 15, orders: 4, status: "QUIET", type: "quiet" },
                    { time: "01:00 PM", bar: 0, text: "LUNCH BREAK", type: "info" },
                    { time: "02:00 PM", bar: 80, orders: 10, status: "PEAK", type: "peak", emoji: "🔥" },
                    { time: "03:00 PM", bar: 20, orders: 5, status: "QUIET", type: "quiet" },
                    { time: "04:00 PM", bar: 70, orders: 11, status: "BUSY", type: "busy" },
                    { time: "05:00 PM", bar: 10, orders: 2, status: "QUIET", type: "quiet" },
                    { time: "06:00 PM", bar: 0, text: "Lab closes", type: "info" },
                  ].map((slot, i) => (
                    <div key={i} className="flex items-center gap-3 text-[10px]">
                      <div className="w-14 font-bold text-[#023e8a] shrink-0 border-r border-slate-200">{slot.time}</div>
                      
                      {slot.type === 'info' ? (
                        <div className="flex-1 text-[#9CA3AF] font-bold uppercase tracking-widest text-[8px]">{slot.text}</div>
                      ) : (
                        <div className="flex-1 flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-[#E8EEF5] rounded-full overflow-hidden shrink-0">
                            <div 
                              className={`h-full rounded-full ${slot.type === 'peak' ? 'bg-[#D81B60]' : slot.type === 'busy' ? 'bg-[#F59E0B]' : 'bg-[#10B981]'}`}
                              style={{ width: `${slot.bar}%` }}
                            ></div>
                          </div>
                          <div className="flex items-center gap-1 w-[120px]">
                            <span className="font-bold text-[#111827]">({slot.orders} orders)</span>
                            <span className={`font-black tracking-[0.1em] uppercase text-[8px] ${slot.type === 'peak' ? 'text-[#D81B60]' : slot.type === 'busy' ? 'text-[#F59E0B]' : 'text-[#10B981]'}`}>
                              {slot.emoji && <span className="mr-0.5">{slot.emoji}</span>}{slot.status}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <div className="mt-2 pt-3 border-t border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D81B60] animate-pulse"></span>
                    <span className="text-[10px] font-bold text-[#111827]">Next peak: <span className="text-[#D81B60] bg-[#D81B60]/10 px-1.5 py-0.5 rounded ml-1 mr-1">10:00 AM</span> <span className="text-[#9CA3AF] font-medium">(prep 2 more staff)</span></span>
                  </div>
                </div>
              </div>

              {/* Live Activity removed as requested */}

            </div>
          </section>

        </div>

        {/* Power Bar (Quick Actions) */}
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 ml-10 z-50 opacity-40 hover:opacity-100 transition-all duration-300">
          <div className="bg-[#03045e]/90 backdrop-blur-2xl px-4 py-2 rounded-full border border-[#caf0f8]/20 flex items-center gap-1.5">
            <button
              onClick={() => setIsWalkInModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#caf0f8] text-black px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
            >
              <div className="w-3.5 h-3.5 text-[#caf0f8]"><PlusSymbol color="#000000" /></div>
              New Walk-In
            </button>
            <div className="w-px h-4 bg-[#caf0f8]/20 mx-1"></div>
            <label className="flex items-center justify-center w-8 h-8 bg-[#caf0f8]/10 text-[#caf0f8] rounded-full hover:bg-[#caf0f8]/20 transition-all cursor-pointer" title="Quick Upload">
              <input type="file" className="hidden" />
              <div className="w-4 h-4"><ExportSymbol color="#caf0f8" /></div>
            </label>
            <button className="flex items-center justify-center w-8 h-8 bg-[#caf0f8]/10 text-[#caf0f8] rounded-full hover:bg-[#caf0f8]/20 transition-all" title="TrueTest Support">
              <div className="w-4 h-4"><SupportSymbol color="#caf0f8" /></div>
            </button>
          </div>
        </div>
        <NewOrderModal
          isOpen={isWalkInModalOpen}
          onClose={() => setIsWalkInModalOpen(false)}
          onSuccess={() => { refreshRequests(); }}
        />
      </div>
    </div>
  );
}
