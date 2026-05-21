"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeftSymbol, 
  StaffSymbol, 
  SecuritySymbol, 
  PlusSymbol,
  IdentitySymbol,
  ClinicalSymbol,
  LogisticsSymbol
} from '../../components/Symbols';

export default function AddStaffPage() {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#E8EEF5] min-h-full">
      <div className="p-6 pb-2">
        <div className="bg-white rounded-[32px] p-6 flex flex-col gap-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/staff" className="w-12 h-12 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl flex items-center justify-center text-slate-400 hover:text-[#023e8a]">
                <div className="w-5 h-5"><ArrowLeftSymbol /></div>
              </Link>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[#023e8a]">
                  New Personnel Onboarding
                </h1>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-[0.15em] mt-1">Register Medical Staff & Clinical Technicians</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/dashboard/staff" className="bg-slate-50 text-slate-500 px-7 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
                Cancel
              </Link>
              <button className="bg-[#10B981] text-white px-7 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-sm shadow-emerald-500/20">
                Register Member
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 mt-4 pb-24 overflow-y-auto scrollbar-none">
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
          
          {/* Identity & Contact */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><IdentitySymbol /></div>
              <h2 className="text-sm font-black text-[#023e8a] uppercase tracking-widest">Identity & Contact</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Legal Full Name</label>
                <input type="text" placeholder="e.g. Dr. Rahul Sharma" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:font-semibold placeholder:text-slate-300" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Primary Email Address</label>
                <input type="email" placeholder="e.g. rahul.s@truetest.com" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:font-semibold placeholder:text-slate-300" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Mobile Contact</label>
                <input type="tel" placeholder="+91 98765 43210" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:font-semibold placeholder:text-slate-300" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Emergency Contact</label>
                <input type="tel" placeholder="Next of kin phone number" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:font-semibold placeholder:text-slate-300" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Clinical Designation */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center"><ClinicalSymbol /></div>
                <h2 className="text-sm font-black text-[#023e8a] uppercase tracking-widest">Clinical Designation</h2>
              </div>
              
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Role Classification</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer">
                    <option value="">Select organizational role...</option>
                    <option value="Pathologist">Pathologist</option>
                    <option value="Technician">Lab Technician</option>
                    <option value="Phlebotomist">Phlebotomist</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Registration No. (MCI / DMLT)</label>
                  <input type="text" placeholder="e.g. MCI-82910" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:font-semibold placeholder:text-slate-300" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Sub-Specialization</label>
                  <input type="text" placeholder="e.g. Hematology, Microbiology" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:font-semibold placeholder:text-slate-300" />
                </div>
              </div>
            </div>

            {/* Operational Assignment */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center"><LogisticsSymbol /></div>
                <h2 className="text-sm font-black text-[#023e8a] uppercase tracking-widest">Operational Assignment</h2>
              </div>
              
              <div className="flex flex-col gap-6 flex-1">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Default Duty Shift</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Morning (08:00 - 16:00)', 'Evening (16:00 - 00:00)', 'Night (00:00 - 08:00)'].map((shift, i) => (
                      <button key={i} className={`p-4 rounded-2xl border text-center transition-all ${i === 0 ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'}`}>
                         <p className="text-[9px] font-black uppercase tracking-widest">{shift.split(' ')[0]}</p>
                         <p className="text-[8px] font-bold mt-1 opacity-70">{shift.split(' ').slice(1).join(' ')}</p>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Initial Status</label>
                  <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
                    <button className="flex-1 bg-white text-emerald-600 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-slate-100">On-Duty</button>
                    <button className="flex-1 text-slate-400 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-slate-600">Away</button>
                    <button className="flex-1 text-slate-400 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-slate-600">Off-Duty</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Credentials Vault */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center"><SecuritySymbol /></div>
              <h2 className="text-sm font-black text-[#023e8a] uppercase tracking-widest">Credentials Vault</h2>
            </div>
            
            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
              className={`w-full h-48 rounded-[24px] border-2 border-dashed flex flex-col items-center justify-center transition-all ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${dragActive ? 'bg-blue-100 text-blue-600' : 'bg-white text-slate-400 shadow-sm'}`}>
                <PlusSymbol />
              </div>
              <p className="text-sm font-black text-[#023e8a]">Drag & Drop Certification Documents</p>
              <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Supports PDF, JPG, PNG up to 10MB</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
