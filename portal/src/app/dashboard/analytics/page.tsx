"use client";

import React, { useState } from 'react';
import {
  AnalyticsSymbol,
  RevenueSymbol,
  OrdersSymbol,
  EfficiencySymbol,
  StaffSymbol,
  ExportSymbol,
  PulseSymbol,
  ClinicalSymbol,
  DashboardSymbol,
  SettingsSymbol
} from '../components/Symbols';

type TimeRange = 'Day' | 'Week' | 'Month' | 'Quarter' | '6 Months' | 'Custom';
type Tab = 'Overview' | 'Operational' | 'Financial' | 'Patient' | 'Quality' | 'Report Builder';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('Day');
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [hoveredData, setHoveredData] = useState<any>(null);

  // Vibrant Color Tokens
  const colors = {
    navy: '#023e8a',
    emerald: '#10B981',
    purple: '#8B5CF6',
    cyan: '#90e0ef',
    amber: '#F59E0B',
    rose: '#FF3366',
    slate: '#111827',
    muted: '#9CA3AF'
  };

  // --- MOCK SVG CHARTS ---

  // 1. Overview: Revenue Area
  const AreaChart = () => (
    <div className="w-full h-[300px] relative mt-4 group">
      <svg viewBox="0 0 800 300" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.navy} stopOpacity="0.3" />
            <stop offset="100%" stopColor={colors.navy} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map(i => (
          <line key={i} x1="0" y1={i * 100} x2="800" y2={i * 100} stroke="#F3F4F6" strokeWidth="1" />
        ))}
        <path
          d="M 0 250 C 50 200, 100 280, 150 180 C 200 80, 250 150, 300 120 C 350 90, 400 40, 450 60 C 500 80, 550 220, 600 200 C 650 180, 700 120, 800 140 L 800 300 L 0 300 Z"
          fill="url(#areaGradient)"
          className="transition-all duration-700"
        />
        <path
          d="M 0 250 C 50 200, 100 280, 150 180 C 200 80, 250 150, 300 120 C 350 90, 400 40, 450 60 C 500 80, 550 220, 600 200 C 650 180, 700 120, 800 140"
          fill="none"
          stroke={colors.navy}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {[0, 150, 300, 450, 600, 800].map((x, i) => (
          <circle key={i} cx={x} cy={i === 0 ? 250 : i === 1 ? 180 : i === 2 ? 120 : i === 3 ? 60 : i === 4 ? 200 : 140} r="7" fill={colors.navy} stroke="white" strokeWidth="4" className="cursor-pointer hover:r-9 transition-all" />
        ))}
      </svg>
    </div>
  );

  // 2. Overview: Donut Chart
  const DonutChart = () => (
    <div className="relative w-full aspect-square flex items-center justify-center max-w-[200px] mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        <circle cx="50" cy="50" r="40" stroke="#F3F4F6" strokeWidth="14" fill="none" />
        <circle cx="50" cy="50" r="40" stroke={colors.emerald} strokeWidth="14" fill="none" strokeDasharray="160 251" strokeLinecap="round" />
        <circle cx="50" cy="50" r="40" stroke={colors.purple} strokeWidth="14" fill="none" strokeDasharray="60 251" strokeDashoffset="-165" strokeLinecap="round" />
        <circle cx="50" cy="50" r="40" stroke={colors.cyan} strokeWidth="14" fill="none" strokeDasharray="30 251" strokeDashoffset="-230" strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-2xl font-black text-[#111827]">1,284</p>
        <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest">Units</p>
      </div>
    </div>
  );

  // --- TAB CONTENTS ---

  const renderOverview = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        {[
          { label: 'Total Revenue', value: '₹12,45,000', change: '+12.5%', trend: 'up', icon: <RevenueSymbol />, color: 'bg-[#023e8a]/10 text-[#023e8a]' },
          { label: 'Orders Processed', value: '1,284', change: '+8.2%', trend: 'up', icon: <OrdersSymbol />, color: 'bg-emerald-500/10 text-emerald-600' },
          { label: 'Avg Turnaround', value: '4.2 Hrs', change: '-15%', trend: 'up', icon: <EfficiencySymbol />, color: 'bg-purple-500/10 text-purple-600' },
          { label: 'Patient Retention', value: '94%', change: '+2.1%', trend: 'up', icon: <StaffSymbol />, color: 'bg-[#90e0ef]/10 text-[#023e8a]' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-[28px] p-6 hover:scale-[1.01] transition-all group shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                <div className="w-5 h-5">{stat.icon}</div>
              </div>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${stat.trend === 'up' ? 'bg-[#E2F3E9] text-[#10B981] border-[#E2F3E9]' : 'bg-[#FEE2E2] text-[#DC3545] border-[#FEE2E2]'}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-xl font-black text-[#111827] tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 min-h-[380px] flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-black text-[#111827] tracking-tight">Revenue Stream</h3>
              <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest">Financial Velocity Tracking</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-[#111827]">₹12.4L</p>
              <p className="text-[9px] font-bold text-[#10B981] uppercase tracking-widest">Operational Peak</p>
            </div>
          </div>
          <div className="flex-1">
            <AreaChart />
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="w-full mb-6 text-center">
            <h3 className="text-lg font-black text-[#111827] tracking-tight">Diagnostic Mix</h3>
            <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest">Revenue by Service Node</p>
          </div>
          <DonutChart />
          <div className="w-full mt-6 space-y-2 flex-1 flex flex-col justify-end">
            {[
              { name: 'Pathology', val: '62%', color: 'bg-[#10B981]', shadow: 'shadow-[#10B981]/40' },
              { name: 'Radiology', val: '28%', color: 'bg-[#8B5CF6]', shadow: 'shadow-[#8B5CF6]/40' },
              { name: 'Emergency', val: '10%', color: 'bg-[#F59E0B]', shadow: 'shadow-[#F59E0B]/40' }
            ].map(item => (
              <div key={item.name} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-slate-100 hover:border-slate-200 group/item">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-lg ${item.shadow}`}></span>
                  <span className="text-[10px] font-black text-[#111827] uppercase">{item.name}</span>
                </div>
                <span className="text-[10px] font-black text-[#111827]">{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderOperational = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* TAT Distribution & Top Cards */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex items-center justify-between hover:border-emerald-200 transition-colors">
            <div>
              <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-1.5">First-Time Accuracy</p>
              <h3 className="text-2xl font-black text-[#111827]">99.4%</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
          </div>
          <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-200 transition-colors">
            <div>
              <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-1.5">Cost vs Revenue / Test</p>
              <div className="flex items-end gap-2">
                <h3 className="text-2xl font-black text-[#111827]">₹320</h3>
                <span className="text-[10px] font-bold text-blue-500 mb-1">/ ₹1,200</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
              <RevenueSymbol />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-[#111827] tracking-tight">Turn Around Time (TAT)</h3>
              <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest">Distribution Across All Departments</p>
            </div>
            <div className="flex gap-3">
              <span className="text-[9px] font-bold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Fast (&lt;2h)</span>
              <span className="text-[9px] font-bold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Normal (2-6h)</span>
              <span className="text-[9px] font-bold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400"></span> Slow (&gt;6h)</span>
            </div>
          </div>
          <div className="h-[200px] w-full flex items-end gap-2 px-2">
            {[
              { height: '10%', color: 'bg-emerald-400', label: '< 1h' },
              { height: '35%', color: 'bg-emerald-400', label: '1-2h' },
              { height: '60%', color: 'bg-amber-400', label: '2-4h' },
              { height: '80%', color: 'bg-amber-400', label: '4-6h' },
              { height: '30%', color: 'bg-rose-400', label: '6-12h' },
              { height: '15%', color: 'bg-rose-400', label: '12-24h' },
              { height: '5%', color: 'bg-rose-400', label: '> 24h' },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <div className={`w-full ${bar.color} rounded-t-xl transition-all duration-300 group-hover:brightness-110`} style={{ height: bar.height }}></div>
                <span className="text-[8px] font-bold text-slate-400 mt-2 uppercase">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rankings & Utilizations */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="bg-[#0A0F24] text-white rounded-[32px] p-6 flex-1 shadow-sm">
          <h3 className="text-lg font-black tracking-tight mb-1">Equipment Utilization</h3>
          <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest mb-5">Live Sensor Data</p>
          <div className="space-y-5">
            {[
              { name: 'MRI Scanner A1', val: 92, color: 'bg-rose-500' },
              { name: 'Sysmex Hematology', val: 78, color: 'bg-emerald-400' },
              { name: 'Roche Cobas e411', val: 85, color: 'bg-amber-400' },
              { name: 'Siemens Atellica', val: 45, color: 'bg-blue-400' },
            ].map(eq => (
              <div key={eq.name}>
                <div className="flex justify-between text-[9px] font-bold uppercase mb-2">
                  <span>{eq.name}</span>
                  <span className={eq.val > 90 ? 'text-rose-400' : 'text-white/70'}>{eq.val}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full ${eq.color} rounded-full`} style={{ width: `${eq.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex-1">
          <h3 className="text-lg font-black text-[#111827] tracking-tight mb-1">Staff Efficiency</h3>
          <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-4">Top Phlebotomists / Techs</p>
          <div className="space-y-2">
            {[
              { name: 'Dr. Sarah Jenkins', ops: 142, rank: 1 },
              { name: 'Mike Ross (Tech)', ops: 128, rank: 2 },
              { name: 'Anita Patel', ops: 115, rank: 3 },
            ].map(staff => (
              <div key={staff.rank} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[9px] font-black text-slate-500">#{staff.rank}</div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-[#111827]">{staff.name}</p>
                  <p className="text-[8px] font-bold text-[#9CA3AF] uppercase">{staff.ops} Procedures/Wk</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinancial = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Financial Top Row */}
      <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#10B981] text-white rounded-[32px] p-6 shadow-sm">
          <p className="text-[9px] font-bold text-emerald-100 uppercase tracking-widest mb-1.5">Net Profit Margin</p>
          <h3 className="text-3xl font-black mb-1.5">32.4%</h3>
          <p className="text-[9px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full inline-block">+2.1% from last month</p>
        </div>
        <div className="bg-rose-50 rounded-[32px] p-6 border border-rose-100 shadow-sm">
          <p className="text-[9px] font-bold text-rose-400 uppercase tracking-widest mb-1.5">Outstanding Payments</p>
          <h3 className="text-3xl font-black text-rose-600 mb-1.5">₹1.8L</h3>
          <p className="text-[9px] font-bold text-rose-500 bg-rose-100 px-2.5 py-0.5 rounded-full inline-block">14 invoices pending &gt; 30 days</p>
        </div>
        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
          <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-1.5">Supply Cost (Consumables)</p>
          <h3 className="text-3xl font-black text-[#111827] mb-1.5">₹4.2L</h3>
          <p className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full inline-block">Warning: Reagents +15%</p>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="lg:col-span-8 bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-black text-[#111827] tracking-tight mb-1">Revenue by Patient Source</h3>
          <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-6">B2B vs B2C Channels</p>

          <div className="w-full h-10 bg-slate-100 rounded-full flex overflow-hidden shadow-inner mb-6">
            <div className="h-full bg-[#023e8a] flex items-center px-4 transition-all hover:brightness-110" style={{ width: '45%' }}>
              <span className="text-[9px] font-black text-white uppercase tracking-wider">Walk-in (45%)</span>
            </div>
            <div className="h-full bg-emerald-500 flex items-center px-4 transition-all hover:brightness-110" style={{ width: '35%' }}>
              <span className="text-[9px] font-black text-white uppercase tracking-wider">Hospitals (35%)</span>
            </div>
            <div className="h-full bg-purple-500 flex items-center px-4 transition-all hover:brightness-110" style={{ width: '20%' }}>
              <span className="text-[9px] font-black text-white uppercase tracking-wider">Corp. (20%)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { title: 'Walk-in (B2C)', rev: '₹5,60,250', col: 'text-[#023e8a]', bg: 'bg-blue-50' },
            { title: 'Hospital Referrals', rev: '₹4,35,750', col: 'text-emerald-500', bg: 'bg-emerald-50' },
            { title: 'Corporate Camps', rev: '₹2,49,000', col: 'text-purple-500', bg: 'bg-purple-50' },
          ].map(item => (
            <div key={item.title} className={`p-4 rounded-2xl border border-white/50 ${item.bg}`}>
              <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${item.col}`}>{item.title}</p>
              <h4 className="text-lg font-black text-slate-800">{item.rev}</h4>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-4 bg-[#0A0F24] text-white rounded-[32px] p-6 shadow-sm">
        <h3 className="text-lg font-black tracking-tight mb-5">Profit Margins</h3>
        <div className="space-y-4">
          {[
            { srv: 'MRI Scans', mar: '68%', col: 'text-emerald-400' },
            { srv: 'Routine Bloods', mar: '42%', col: 'text-emerald-400' },
            { srv: 'Specialized Genetics', mar: '82%', col: 'text-purple-400' },
            { srv: 'X-Ray', mar: '25%', col: 'text-amber-400' }
          ].map(i => (
            <div key={i.srv} className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">{i.srv}</span>
              <span className={`text-sm font-black ${i.col}`}>{i.mar}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPatient = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Geo Heatmap (Abstract representation) */}
      <div className="lg:col-span-7 bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-black text-[#111827] tracking-tight">Geographic Heatmap</h3>
            <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest">Patient Origin Density</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500"><ClinicalSymbol /></div>
        </div>

        {/* Abstract Grid Map */}
        <div className="grid grid-cols-12 gap-1 p-3 bg-slate-50 border border-slate-100 rounded-3xl flex-1 min-h-[200px]">
          {Array.from({ length: 84 }).map((_, i) => {
            // Generate random opacity for heatmap effect
            const opacities = ['opacity-5', 'opacity-10', 'opacity-20', 'opacity-40', 'opacity-60', 'opacity-80', 'opacity-100'];
            const color = i % 13 === 0 || i % 7 === 0 ? 'bg-rose-500' : 'bg-[#023e8a]';
            const opacity = opacities[Math.floor(Math.random() * opacities.length)];
            return (
              <div key={i} className={`w-full h-full rounded-md ${color} ${opacity} hover:opacity-100 transition-opacity cursor-pointer`}></div>
            )
          })}
        </div>
      </div>

      <div className="lg:col-span-5 flex flex-col gap-4">
        {/* New vs Returning */}
        <div className="bg-[#023e8a] text-white rounded-[32px] p-6 flex items-center justify-between shadow-sm">
          <div>
            <h3 className="text-lg font-black mb-0.5">Loyalty Ratio</h3>
            <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest mb-4">New vs Returning</p>
            <div className="flex gap-4">
              <div>
                <p className="text-2xl font-black text-cyan-300">68%</p>
                <p className="text-[8px] font-bold uppercase tracking-widest">Returning</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">32%</p>
                <p className="text-[8px] font-bold uppercase tracking-widest text-white/50">New</p>
              </div>
            </div>
          </div>
          <div className="w-20 h-20 rounded-full border-[6px] border-cyan-400 border-l-white transform rotate-45 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/10 transform -rotate-45 flex items-center justify-center"><StaffSymbol color="white" /></div>
          </div>
        </div>

        {/* Demographics */}
        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex-1">
          <h3 className="text-lg font-black text-[#111827] tracking-tight mb-0.5">Age & Gender Demographics</h3>
          <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-5">Patient Base Breakdown</p>

          <div className="space-y-3">
            {[
              { age: '0-18', m: 15, f: 12 },
              { age: '19-35', m: 45, f: 55 },
              { age: '36-50', m: 60, f: 40 },
              { age: '51-65', m: 70, f: 65 },
              { age: '65+', m: 40, f: 50 },
            ].map(d => (
              <div key={d.age} className="flex items-center gap-2">
                <div className="flex-1 flex justify-end">
                  <div className="h-3.5 bg-[#023e8a] rounded-l-sm opacity-80" style={{ width: `${d.m}%` }}></div>
                </div>
                <div className="w-10 text-center text-[9px] font-black text-slate-400">{d.age}</div>
                <div className="flex-1 flex justify-start">
                  <div className="h-3.5 bg-rose-400 rounded-r-sm opacity-80" style={{ width: `${d.f}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-5 mt-4">
            <span className="text-[9px] font-black text-[#023e8a] uppercase tracking-widest flex items-center gap-1.5"><span className="w-2 h-2 bg-[#023e8a] opacity-80 rounded-full"></span> Male</span>
            <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1.5"><span className="w-2 h-2 bg-rose-400 opacity-80 rounded-full"></span> Female</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuality = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Quality Top Cards */}
      <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-[32px] p-6 border border-rose-100 shadow-sm flex items-center justify-between hover:scale-[1.01] transition-transform">
          <div>
            <p className="text-[9px] font-bold text-rose-400 uppercase tracking-widest mb-1">Sample Rejection Rate</p>
            <h3 className="text-2xl font-black text-[#111827]">1.2%</h3>
            <span className="text-[9px] font-bold text-emerald-500 mt-1 block">↓ 0.4% Improvement</span>
          </div>
          <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center text-rose-500 font-black">!</div>
        </div>
        <div className="bg-white rounded-[32px] p-6 border border-amber-100 shadow-sm flex items-center justify-between hover:scale-[1.01] transition-transform">
          <div>
            <p className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mb-1">Rework / Retest %</p>
            <h3 className="text-2xl font-black text-[#111827]">0.8%</h3>
            <span className="text-[9px] font-bold text-rose-500 mt-1 block">↑ 0.2% Increase</span>
          </div>
          <div className="w-12 h-12 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center text-amber-500"><PulseSymbol /></div>
        </div>
        <div className="bg-emerald-500 text-white rounded-[32px] p-6 shadow-sm flex items-center justify-between hover:scale-[1.01] transition-transform">
          <div>
            <p className="text-[9px] font-bold text-emerald-100 uppercase tracking-widest mb-1">Audit Compliance</p>
            <h3 className="text-2xl font-black text-white">100%</h3>
            <span className="text-[9px] font-bold text-emerald-100 mt-1 block">NABL/ISO Standards Met</span>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white"><EfficiencySymbol /></div>
        </div>
      </div>

      <div className="lg:col-span-7 bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex flex-col">
        <h3 className="text-lg font-black text-[#111827] tracking-tight mb-0.5">Quality Incidents Trend</h3>
        <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-6">Trailing 6 Months</p>
        <div className="w-full flex-1 min-h-[160px] flex items-end justify-between px-4 relative">
          {/* Mock line connecting points */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <polyline points="20,130 120,110 220,120 320,70 420,90 520,30" fill="none" stroke="#FF3366" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {[10, 25, 20, 50, 40, 80].map((val, i) => (
            <div key={i} className="flex flex-col items-center z-10" style={{ transform: `translateY(-${val * 1.2}px)` }}>
              <div className="w-3.5 h-3.5 bg-rose-500 border-2 border-white rounded-full shadow-md hover:scale-150 transition-transform cursor-pointer"></div>
            </div>
          ))}
        </div>
        <div className="flex justify-between px-4 mt-3">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(m => <span key={m} className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{m}</span>)}
        </div>
      </div>

      <div className="lg:col-span-5 bg-[#0A0F24] text-white rounded-[32px] p-6 shadow-sm">
        <h3 className="text-lg font-black tracking-tight mb-1">Root Cause Analysis</h3>
        <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest mb-6">For Rejected Samples</p>
        <div className="space-y-4">
          {[
            { reason: 'Hemolysis', pct: 45, col: 'bg-rose-500' },
            { reason: 'Insufficient Quantity', pct: 30, col: 'bg-amber-500' },
            { reason: 'Clotted Sample', pct: 15, col: 'bg-purple-500' },
            { reason: 'Wrong Container', pct: 10, col: 'bg-cyan-500' },
          ].map(rc => (
            <div key={rc.reason}>
              <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest mb-1.5">
                <span className="text-white/80">{rc.reason}</span>
                <span>{rc.pct}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full">
                <div className={`h-full ${rc.col} rounded-full`} style={{ width: `${rc.pct}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBuilder = () => (
    <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm min-h-[450px] flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-[#023e8a]/5 rounded-2xl flex items-center justify-center text-[#023e8a] mb-5 border border-[#023e8a]/10">
        <SettingsSymbol />
      </div>
      <h2 className="text-2xl font-black text-[#111827] tracking-tight mb-1">Custom Report Builder</h2>
      <p className="text-[11px] font-bold text-[#9CA3AF] mb-8 max-w-sm">Drag and drop metrics below to construct automated daily, weekly, or monthly stakeholder reports.</p>

      <div className="w-full max-w-2xl bg-slate-50 border-2 border-dashed border-slate-200 rounded-[28px] p-6 mb-8 min-h-[160px] flex items-center justify-center transition-colors hover:bg-slate-100 hover:border-slate-300">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Drop Metric Modules Here</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
        {['Revenue Total', 'TAT Average', 'Rejection Rate', 'Equipment Util', 'Profit Margin', 'Demographics', 'Top Services'].map(chip => (
          <div key={chip} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-grab hover:border-[#023e8a] hover:text-[#023e8a] transition-all shadow-sm">
            :: {chip}
          </div>
        ))}
      </div>

      <button className="mt-8 bg-[#023e8a] text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-md">
        Save Template
      </button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-[#E8EEF5] min-h-full">
      {/* 1. Sub-Dashboard Control Panel & Tabs */}
      <div className="p-6 pb-2">
        <div className="bg-white rounded-[32px] p-6 flex flex-col gap-5 shadow-sm border border-slate-100 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex items-center">
                <div className="w-12 h-12 bg-[#dcf0fa] rounded-2xl flex items-center justify-center relative z-10">
                  <div className="w-5 h-5 text-[#023e8a]">
                    <AnalyticsSymbol />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black tracking-tight text-[#023e8a]">
                    Deep Analysis
                  </h1>
                  <div className="bg-purple-50 border border-purple-100 px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                    <span className="text-[9px] font-black text-purple-600 uppercase tracking-widest">Live Syncing</span>
                  </div>
                </div>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-[0.15em] mt-1">Real-time Performance & Clinical Insights</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="bg-[#023e8a] text-white px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-sm flex items-center gap-2">
                <div className="w-3.5 h-3.5"><ExportSymbol color="white" /></div>
                Export
              </button>
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full"></div>

          <div className="flex items-center gap-4 mt-1">
            {/* NEW: Tabbed Navigation Dropdown */}
            <div className="relative inline-block">
              <button
                onClick={() => setIsTabDropdownOpen(!isTabDropdownOpen)}
                className="flex items-center gap-3 px-6 py-2.5 bg-[#023e8a] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm hover:brightness-110 transition-all"
              >
                View: {activeTab}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isTabDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              {isTabDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-40">
                  {(['Overview', 'Operational', 'Financial', 'Patient', 'Quality', 'Report Builder'] as Tab[]).map(tab => (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        setIsTabDropdownOpen(false);
                      }}
                      className={`w-full text-left px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-slate-50 text-[#023e8a] border border-slate-100' : 'text-slate-500 hover:bg-slate-50 hover:text-[#023e8a]'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Time Range Dropdown */}
            <div className="relative inline-block">
              <button
                onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-[9px] font-black uppercase tracking-widest text-[#023e8a] hover:bg-slate-100 transition-colors shadow-sm"
              >
                {timeRange === 'Custom' && customDateRange.start ? `${customDateRange.start} - ${customDateRange.end}` : timeRange}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isTimeDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              {isTimeDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
                  {(['Day', 'Week', 'Month', 'Quarter', '6 Months', 'Custom'] as TimeRange[]).map(range => (
                    <button
                      key={range}
                      onClick={() => {
                        setTimeRange(range);
                        if (range !== 'Custom') setIsTimeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === range && range !== 'Custom' ? 'bg-[#023e8a] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-[#023e8a]'}`}
                    >
                      {range}
                    </button>
                  ))}
                  {timeRange === 'Custom' && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex flex-col gap-2 px-1">
                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Start Date</label>
                        <input type="date" value={customDateRange.start} onChange={e => setCustomDateRange({ ...customDateRange, start: e.target.value })} className="w-full text-[10px] font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#023e8a]" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">End Date</label>
                        <input type="date" value={customDateRange.end} onChange={e => setCustomDateRange({ ...customDateRange, end: e.target.value })} className="w-full text-[10px] font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#023e8a]" />
                      </div>
                      <button onClick={() => setIsTimeDropdownOpen(false)} className="w-full bg-[#023e8a] text-white text-[9px] font-black uppercase tracking-widest py-2 rounded-lg mt-1 hover:brightness-110 shadow-sm">Apply Range</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dynamic Content Area based on Active Tab */}
      <div className="flex-1 px-6 mt-4 pb-24 overflow-y-auto scrollbar-none">
        {activeTab === 'Overview' && renderOverview()}
        {activeTab === 'Operational' && renderOperational()}
        {activeTab === 'Financial' && renderFinancial()}
        {activeTab === 'Patient' && renderPatient()}
        {activeTab === 'Quality' && renderQuality()}
        {activeTab === 'Report Builder' && renderBuilder()}
      </div>
    </div>
  );
}
