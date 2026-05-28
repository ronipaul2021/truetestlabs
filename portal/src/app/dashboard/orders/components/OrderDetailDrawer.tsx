"use client";

import React from 'react';
import { PrintSymbol } from '../../components/Symbols';

interface OrderDetailDrawerProps {
  order: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailDrawer({ order, isOpen, onClose }: OrderDetailDrawerProps) {
  if (!order) return null;

  return (
    <div className={`fixed inset-0 z-[110] flex justify-end transition-visibility ${isOpen ? 'visible' : 'invisible'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      ></div>

      {/* Panel */}
      <div className={`relative w-full max-w-xl h-full bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] border-l border-slate-200 flex flex-col transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-[#F9FAFB]">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-[#023e8a] tracking-tight">Order #{order.id}</h2>
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                order.status === 'pending' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                order.status === 'collecting' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                order.status === 'processing' ? 'bg-[#dcf0fa] text-[#023e8a] border-[#dcf0fa]' : 'bg-[#E2F3E9] text-[#10B981] border-[#E2F3E9]'
              }`}>
                {order.status}
              </span>
              {order.priority === 'Urgent' && (
                <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-rose-50 text-rose-600 border-rose-100 animate-pulse">
                  Urgent Priority
                </span>
              )}
            </div>
            <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mt-1">Lifecycle Tracking & Diagnostics</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white border border-slate-200 text-[#9CA3AF] flex items-center justify-center hover:bg-slate-50 hover:text-white transition-all shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          
          {/* Patient Profile */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#023e8a] shadow-[0_0_8px_rgba(2,62,138,0.4)]"></span>
              Patient Information
            </h3>
            <div className="bg-[#F3F4F6] rounded-2xl p-6 border border-slate-100 grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1">Full Name</p>
                <p className="text-sm font-black text-white">{order.patientName}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1">Contact</p>
                <p className="text-sm font-black text-white">{order.patientPhone}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1">Registered Date</p>
                <p className="text-sm font-black text-white">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1">Billing Status</p>
                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${order.paymentStatus === 'Settled' ? 'bg-[#E2F3E9] text-[#10B981]' : 'bg-amber-100 text-amber-700'}`}>
                   {order.paymentStatus} (₹{order.totalAmount})
                </span>
              </div>
            </div>
          </section>

          {/* Test Logistics */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"></span>
              Service Details
            </h3>
            <div className="space-y-3">
              {order.tests.map((test: string, i: number) => (
                <div key={i} className="bg-white border border-slate-100 rounded-xl p-4 flex items-center justify-between shadow-sm hover:border-[#023e8a]/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-[#dcf0fa] text-[#023e8a] flex items-center justify-center font-black text-xs">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">{test}</p>
                      <p className="text-[10px] text-[#9CA3AF] font-bold uppercase mt-0.5">Laboratory Ready</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest block mb-1">Action</span>
                    <button className="text-[10px] font-black text-[#023e8a] hover:text-[#03045e] uppercase tracking-widest">Mark Collected</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Clinical Context & Flags */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]"></span>
              Clinical Context
            </h3>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 grid grid-cols-2 gap-y-6 gap-x-4 shadow-sm">
              <div>
                <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1">Prescribing Doctor</p>
                <p className="text-sm font-black text-white">{order.prescriber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1">Assigned Phlebotomist/Tech</p>
                <p className="text-sm font-black text-[#023e8a]">{order.assignedStaff || 'Unassigned'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest mb-2">Quality Flags</p>
                {order.flags && order.flags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {order.flags.map((flag: string, i: number) => (
                      <span key={i} className="bg-rose-50 text-rose-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-100 flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        {flag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs font-bold text-[#9CA3AF]">No flags reported. Sample integrity normal.</p>
                )}
              </div>
            </div>
          </section>

          {/* Logistics & SLA Timeline */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
              SLA & Timeline
            </h3>

            {/* SLA Gauge */}
            {order.expectedCompletion && (
              <div className="bg-[#F9FAFB] border border-slate-100 p-4 rounded-xl flex items-center justify-between mb-4">
                 <div>
                    <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest">Expected TAT</p>
                    <p className="text-xs font-black text-white">{new Date(order.expectedCompletion).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</p>
                 </div>
                 {new Date(order.expectedCompletion) < new Date() && order.status !== 'completed' ? (
                   <span className="px-3 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm">SLA Breached</span>
                 ) : (
                   <span className="px-3 py-1 bg-[#E2F3E9] text-[#10B981] rounded-lg text-[9px] font-black uppercase tracking-widest border border-[#E2F3E9]">On Track</span>
                 )}
              </div>
            )}

            <div className="relative pl-6 space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
              <div className="relative">
                <span className="absolute -left-[23px] top-1.5 w-2 h-2 rounded-full bg-[#10B981] ring-4 ring-[#E2F3E9]"></span>
                <p className="text-[11px] font-black text-white uppercase tracking-widest">Order Created</p>
                <p className="text-[10px] text-[#9CA3AF] font-medium mt-0.5">At {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="relative">
                <span className={`absolute -left-[23px] top-1.5 w-2 h-2 rounded-full ${['collecting', 'processing', 'completed'].includes(order.status) ? 'bg-amber-500 ring-4 ring-amber-50' : 'bg-slate-300'}`}></span>
                <p className="text-[11px] font-black text-white uppercase tracking-widest">Sample Collection</p>
                <p className="text-[10px] text-[#9CA3AF] font-medium mt-0.5">{['collecting', 'processing', 'completed'].includes(order.status) ? 'In Progress / Completed' : 'Pending action'}</p>
              </div>
              <div className="relative">
                <span className={`absolute -left-[23px] top-1.5 w-2 h-2 rounded-full ${['completed'].includes(order.status) ? 'bg-[#10B981] ring-4 ring-[#E2F3E9]' : 'bg-slate-300'}`}></span>
                <p className="text-[11px] font-black text-white uppercase tracking-widest">Final Report Generation</p>
                <p className="text-[10px] text-[#9CA3AF] font-medium mt-0.5">{order.status === 'completed' ? 'Delivered via Email/SMS' : 'Awaiting clinical approval'}</p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Actions */}
        <div className="p-8 border-t border-slate-100 bg-[#F9FAFB] flex gap-3">
          <button className="flex-1 bg-[#023e8a] text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-[#023e8a]/20 hover:bg-[#03045e] transition-all">
            Collect Sample
          </button>
          <button className="px-6 bg-white border border-slate-200 text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
            <div className="w-4 h-4"><PrintSymbol /></div>
            Print Barcode
          </button>
        </div>

      </div>
    </div>
  );
}
