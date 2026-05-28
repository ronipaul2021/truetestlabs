"use client";

import React, { useState } from 'react';
import { SuccessSymbol } from '../../components/Symbols';
import { useDashboard } from '@/context/DashboardContext';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewOrderModal({ isOpen, onClose, onSuccess }: NewOrderModalProps) {
  const { currentCenter } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    age: '',
    gender: 'Male',
    referredBy: '',
    paymentStatus: 'pending',
    selectedServices: [] as string[],
  });

  const services = currentCenter?.services?.map((s: any, i: number) => ({
    id: s.id || s.name,
    name: s.name,
    price: s.price,
    accent: ['#F43F5E', '#10B981', '#6366F1', '#F59E0B', '#06B6D4', '#A855F7'][i % 6]
  })) || [];

  const filteredServices = services.filter((s: any) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (!isOpen) return null;

  const totalAmount = formData.selectedServices.reduce((acc, serviceId) => {
    const service = services.find((s: any) => s.id === serviceId);
    return acc + (Number(service?.price) || 0);
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onSuccess();
      onClose();
    }, 1500);
  };

  const toggleService = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(id)
        ? prev.selectedServices.filter(sid => sid !== id)
        : [...prev.selectedServices, id]
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-[#0F1629]/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-[#162035]/90 border border-white/[0.08] rounded-[24px] w-full max-w-[800px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#10B981]/50 to-transparent" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#10B981] rounded-full blur-[100px] opacity-[0.05] pointer-events-none" />

        <div className="px-6 py-5 sm:px-8 sm:py-6 border-b border-white/[0.06] flex items-center justify-between bg-[#12203A]/50 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path></svg>
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                New Walk-In Order
                <span className="bg-[#10B981]/10 text-[#10B981] text-[9px] px-2 py-0.5 rounded-full border border-[#10B981]/20 uppercase tracking-widest animate-pulse">Live</span>
              </h2>
              <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest mt-1">Patient Registration & Billing</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] rounded-xl transition-all text-white/50 hover:text-white">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden z-10">
          <div className="p-6 sm:p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
            
            {/* Patient Details Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-6 h-6 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/50 text-xs font-bold border border-white/[0.05]">1</span>
                <h3 className="text-sm font-bold text-white">Patient Information</h3>
                <div className="flex-1 h-px bg-white/[0.05]" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/50 uppercase tracking-widest px-1">Full Name <span className="text-[#F43F5E]">*</span></label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. John Doe"
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-[13px] font-medium text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/40 focus:border-[#6366F1] transition-all"
                    value={formData.patientName}
                    onChange={e => setFormData({...formData, patientName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/50 uppercase tracking-widest px-1">Phone Number <span className="text-[#F43F5E]">*</span></label>
                  <input 
                    required
                    type="tel" 
                    placeholder="+91 00000 00000"
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-[13px] font-medium text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/40 focus:border-[#6366F1] transition-all"
                    value={formData.patientPhone}
                    onChange={e => setFormData({...formData, patientPhone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/50 uppercase tracking-widest px-1">Age <span className="text-[#F43F5E]">*</span></label>
                  <input 
                    required
                    type="number" 
                    placeholder="Years"
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-[13px] font-medium text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/40 focus:border-[#6366F1] transition-all"
                    value={formData.age}
                    onChange={e => setFormData({...formData, age: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/50 uppercase tracking-widest px-1">Gender</label>
                  <div className="flex gap-2 p-1.5 bg-white/[0.03] border border-white/[0.05] rounded-xl">
                    {['Male', 'Female', 'Other'].map(g => (
                      <button 
                        key={g}
                        type="button"
                        onClick={() => setFormData({...formData, gender: g})}
                        className={`flex-1 py-2.5 rounded-[10px] text-[11px] font-bold uppercase tracking-wider transition-all ${
                          formData.gender === g 
                            ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-lg' 
                            : 'text-white/40 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-[10px] font-black text-white/50 uppercase tracking-widest px-1">Referred By (Doctor) <span className="text-[#10B981] lowercase tracking-normal">(Optional)</span></label>
                  <input 
                    type="text" 
                    placeholder="e.g. Dr. Sarah Smith"
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-[13px] font-medium text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/40 focus:border-[#6366F1] transition-all"
                    value={formData.referredBy}
                    onChange={e => setFormData({...formData, referredBy: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Service Selection Section */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-6 h-6 rounded-lg bg-white/[0.05] flex items-center justify-center text-white/50 text-xs font-bold border border-white/[0.05]">2</span>
                <h3 className="text-sm font-bold text-white">Select Services</h3>
                <div className="flex-1 h-px bg-white/[0.05]" />
              </div>

              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search for a test or service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-[14px] pl-10 pr-4 py-3 text-[13px] font-medium text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#10B981]/40 focus:border-[#10B981] transition-all"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-1.5 custom-scrollbar">
                {filteredServices.length > 0 ? (
                  filteredServices.map((s: any) => {
                    const isSelected = formData.selectedServices.includes(s.id);
                    return (
                      <button
                        key={s.id}
                      type="button"
                      onClick={() => toggleService(s.id)}
                      className={`relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200 group overflow-hidden ${
                        isSelected 
                          ? 'bg-[#10B981]/10 border-[#10B981]/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                          : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/20'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#10B981] shadow-[0_0_8px_#10B981]" />
                      )}
                      <div className="flex items-center gap-3 pl-1 text-left">
                        <div className="w-2.5 h-2.5 rounded-full" style={{background: s.accent, boxShadow: `0 0 8px ${s.accent}80`}} />
                        <div>
                          <p className={`text-[13px] font-bold ${isSelected ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>{s.name}</p>
                          <p className="text-[11px] text-white/40 font-semibold mt-0.5 tracking-wide">₹{s.price}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-[#10B981] border-[#10B981] text-white shadow-[0_0_8px_#10B981]' 
                          : 'border-white/20 text-transparent'
                      }`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="col-span-full py-8 text-center bg-white/[0.02] border border-white/[0.05] rounded-[16px]">
                  <p className="text-[12px] font-bold text-white/40">No services match your search.</p>
                </div>
              )}
              </div>
            </div>

          </div>

          {/* Footer / Billing */}
          <div className="px-6 py-5 sm:px-8 sm:py-6 border-t border-white/[0.06] bg-[#0A0F1E]/80 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 relative z-20">
            <div className="flex flex-col">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Total Payable Amount</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white tracking-tight leading-none">₹{totalAmount.toLocaleString()}</span>
                {formData.selectedServices.length > 0 && (
                  <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-widest">({formData.selectedServices.length} items)</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl text-[12px] font-bold text-white/50 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all"
              >
                Cancel
              </button>
              <button 
                disabled={loading || formData.selectedServices.length === 0}
                className="flex-1 sm:flex-none relative overflow-hidden bg-gradient-to-r from-[#10B981] to-[#059669] text-white px-8 py-3.5 rounded-xl text-[12px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:-translate-y-0 hover:-translate-y-0.5 group"
              >
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-out" />
                <span className="flex items-center justify-center gap-2 relative z-10">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Processing...
                    </>
                  ) : (
                    'Create Order'
                  )}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
