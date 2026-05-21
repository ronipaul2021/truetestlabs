"use client";

import React, { useState } from 'react';
import { SuccessSymbol } from '../../components/Symbols';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewOrderModal({ isOpen, onClose, onSuccess }: NewOrderModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    age: '',
    gender: 'Male',
    paymentStatus: 'pending',
    selectedServices: [] as number[],
  });

  // Mock services for now
  const services = [
    { id: 1, name: 'Blood Test (CBC)', price: 220 },
    { id: 2, name: 'MRI Scan Brain', price: 1450 },
    { id: 3, name: 'X-Ray Chest', price: 450 },
    { id: 4, name: 'Lipid Profile', price: 650 },
  ];

  if (!isOpen) return null;

  const totalAmount = formData.selectedServices.reduce((acc, serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return acc + (service?.price || 0);
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

  const toggleService = (id: number) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(id)
        ? prev.selectedServices.filter(sid => sid !== id)
        : [...prev.selectedServices, id]
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-[var(--deep-navy)]/50">
          <div>
            <h2 className="text-xl font-black text-brand-navy tracking-tight">New Walk-In Order</h2>
            <p className="text-[10px] font-bold text-brand-teal uppercase tracking-widest mt-1">Patient Registration & Billing</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-rose-50 hover:text-rose-600 rounded-full transition-colors text-slate-400">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Patient Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Patient Name</label>
              <input 
                required
                type="text" 
                placeholder="Full Name"
                className="w-full bg-[var(--deep-navy)] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
                value={formData.patientName}
                onChange={e => setFormData({...formData, patientName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
              <input 
                required
                type="tel" 
                placeholder="+91 00000 00000"
                className="w-full bg-[var(--deep-navy)] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
                value={formData.patientPhone}
                onChange={e => setFormData({...formData, patientPhone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Age</label>
              <input 
                required
                type="number" 
                placeholder="Years"
                className="w-full bg-[var(--deep-navy)] border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all"
                value={formData.age}
                onChange={e => setFormData({...formData, age: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Gender</label>
              <div className="flex gap-2 p-1 bg-[var(--deep-navy)] rounded-xl">
                {['Male', 'Female', 'Other'].map(g => (
                  <button 
                    key={g}
                    type="button"
                    onClick={() => setFormData({...formData, gender: g})}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${formData.gender === g ? 'bg-white text-brand-teal shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Service Selection */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Select Required Tests</label>
            <div className="grid grid-cols-2 gap-3">
              {services.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleService(s.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${formData.selectedServices.includes(s.id) ? 'bg-brand-mint/30 border-brand-teal/30 ring-2 ring-brand-teal/10' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'}`}
                >
                  <div className="text-left">
                    <p className={`text-xs font-black ${formData.selectedServices.includes(s.id) ? 'text-brand-navy' : 'text-slate-700'}`}>{s.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">₹{s.price}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${formData.selectedServices.includes(s.id) ? 'bg-brand-teal border-brand-teal' : 'border-slate-200'}`}>
                    {formData.selectedServices.includes(s.id) && <div className="w-3 h-3"><SuccessSymbol /></div>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer / Billing */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Payable Amount</p>
              <p className="text-2xl font-black text-brand-navy tracking-tight">₹{totalAmount.toLocaleString()}</p>
            </div>
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-[var(--deep-navy)] transition-all"
              >
                Cancel
              </button>
              <button 
                disabled={loading || formData.selectedServices.length === 0}
                className="bg-brand-navy text-white px-8 py-3 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg hover:shadow-brand-navy/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                  </>
                ) : (
                  'Create Order'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
