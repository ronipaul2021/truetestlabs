"use client";

import React, { useState, useMemo } from 'react';
import { AddServiceModal } from './components/ServiceModals';
import { useDashboard } from '@/context/DashboardContext';
import { ServicesSymbol, EditSymbol, DeleteSymbol, PlusSymbol, PulseSymbol, EfficiencySymbol, ArrowLeftSymbol, ArrowRightSymbol } from '../components/Symbols';

interface Service {
  id: number;
  name: string;
  code: string;
  category: string;
  price: number;
  demand: number;
  demandTrend: number;
  revenue: number;
  revenueTrend: number;
  margin: number;
  passRate: number;
  status: 'Active' | 'Inactive' | 'Archived';
  acceptanceRate: number;
  equipment: string;
  // Old fields kept for Modal compatibility
  offerPrice: number | null;
  tat: string;
  specimen: string;
  preparation: string;
  homeCollection: boolean;
  collectionTime: string;
  homeVisitFee: number;
}

export default function ServicesPage() {
  const { currentCenter, globalSearchQuery, setGlobalSearchQuery } = useDashboard();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Tier 1 - Essential Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [demandFilter, setDemandFilter] = useState('All');
  const [marginFilter, setMarginFilter] = useState('All');
  const [qualityFilter, setQualityFilter] = useState('All');
  const [trendFilter, setTrendFilter] = useState('All');

  // Tier 2 - Strategic Filters
  const [acceptanceFilter, setAcceptanceFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [revenueFilter, setRevenueFilter] = useState('All');

  // Tier 3 - Advanced Filters
  const [priceFilter, setPriceFilter] = useState('All');

  // Sorting State
  type SortField = 'name' | 'demand' | 'price' | 'revenue' | 'margin' | 'passRate' | 'status' | null;
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Clear search on mount to ensure contextual search
  React.useEffect(() => {
    setGlobalSearchQuery("");
  }, [setGlobalSearchQuery]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Industry Standard Initial Services
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: 'Blood Test (CBC)', code: 'PATH-001', category: 'Pathology', price: 220, demand: 142, demandTrend: 15, revenue: 32240, revenueTrend: 8, margin: 62, passRate: 98.2, status: 'Active', acceptanceRate: 35, equipment: 'Siemens ADVIA', offerPrice: 199, tat: '4 Hours', specimen: 'Blood (EDTA)', preparation: 'No fasting required', homeCollection: true, collectionTime: 'Morning', homeVisitFee: 50 },
    { id: 2, name: 'MRI Scan Brain', code: 'RAD-042', category: 'Radiology', price: 4500, demand: 28, demandTrend: 3, revenue: 98560, revenueTrend: 12, margin: 58, passRate: 96.1, status: 'Active', acceptanceRate: 28, equipment: 'Philips MRI', offerPrice: 4200, tat: '24 Hours', specimen: 'None', preparation: 'Metallic objects removed', homeCollection: false, collectionTime: 'Morning', homeVisitFee: 0 },
    { id: 3, name: 'Lipid Profile', code: 'PATH-088', category: 'Pathology', price: 850, demand: 68, demandTrend: -2, revenue: 47600, revenueTrend: -5, margin: 45, passRate: 91.5, status: 'Active', acceptanceRate: 22, equipment: 'Beckman Coulter', offerPrice: null, tat: '6 Hours', specimen: 'Blood', preparation: '12-hour fasting mandatory', homeCollection: true, collectionTime: 'Morning', homeVisitFee: 50 },
    { id: 4, name: 'X-Ray Chest PA', code: 'RAD-005', category: 'Radiology', price: 450, demand: 34, demandTrend: 22, revenue: 14580, revenueTrend: 26, margin: 38, passRate: 97.8, status: 'Active', acceptanceRate: 40, equipment: 'Canon CT', offerPrice: null, tat: '1 Hour', specimen: 'None', preparation: 'None', homeCollection: false, collectionTime: 'Morning', homeVisitFee: 0 },
    { id: 5, name: 'Thyroid T3/T4', code: 'PATH-099', category: 'Pathology', price: 650, demand: 12, demandTrend: -15, revenue: 6500, revenueTrend: -18, margin: 28, passRate: 83.3, status: 'Active', acceptanceRate: 15, equipment: 'Beckman Coulter', offerPrice: 599, tat: '12 Hours', specimen: 'Blood', preparation: 'Fasting preferred', homeCollection: true, collectionTime: 'Morning', homeVisitFee: 50 },
    { id: 6, name: 'Vitamin D3', code: 'PATH-156', category: 'Pathology', price: 1200, demand: 8, demandTrend: -25, revenue: 8400, revenueTrend: -31, margin: 35, passRate: 94.0, status: 'Inactive', acceptanceRate: 10, equipment: 'Siemens ADVIA', offerPrice: 999, tat: '24 Hours', specimen: 'Blood', preparation: 'None', homeCollection: true, collectionTime: 'Morning', homeVisitFee: 50 },
    { id: 7, name: 'ECG (Resting)', code: 'CARD-001', category: 'Cardiology', price: 350, demand: 45, demandTrend: 5, revenue: 15750, revenueTrend: 4, margin: 55, passRate: 99.1, status: 'Active', acceptanceRate: 32, equipment: 'GE USG', offerPrice: null, tat: '30 Mins', specimen: 'None', preparation: 'None', homeCollection: true, collectionTime: 'Morning', homeVisitFee: 100 },
    { id: 8, name: 'Glucose (Fasting)', code: 'PATH-002', category: 'Pathology', price: 150, demand: 110, demandTrend: 10, revenue: 16500, revenueTrend: 12, margin: 60, passRate: 98.5, status: 'Active', acceptanceRate: 45, equipment: 'Siemens ADVIA', offerPrice: null, tat: '4 Hours', specimen: 'Blood', preparation: '12-hour fasting mandatory', homeCollection: true, collectionTime: 'Morning', homeVisitFee: 50 },
    { id: 9, name: 'Liver Function Test', code: 'PATH-012', category: 'Pathology', price: 550, demand: 55, demandTrend: 2, revenue: 30250, revenueTrend: 1, margin: 48, passRate: 95.2, status: 'Active', acceptanceRate: 26, equipment: 'Beckman Coulter', offerPrice: 499, tat: '8 Hours', specimen: 'Blood', preparation: 'Fasting suggested', homeCollection: true, collectionTime: 'Morning', homeVisitFee: 50 },
    { id: 10, name: 'Kidney Function Test', code: 'PATH-015', category: 'Pathology', price: 750, demand: 40, demandTrend: -4, revenue: 30000, revenueTrend: -2, margin: 50, passRate: 97.0, status: 'Active', acceptanceRate: 24, equipment: 'Beckman Coulter', offerPrice: 650, tat: '8 Hours', specimen: 'Blood', preparation: 'Fasting suggested', homeCollection: true, collectionTime: 'Morning', homeVisitFee: 50 },
  ]);

  // Filtering Logic
  const filteredServices = useMemo(() => {
    return services.filter(s => {
      // Search & Category
      const matchesSearch = s.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) || s.code.toLowerCase().includes(globalSearchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
      if (!matchesSearch || !matchesCategory) return false;

      // Tier 1 Filters
      if (statusFilter !== 'All' && s.status !== (statusFilter.split(' ')[0] as any)) return false;
      
      if (demandFilter !== 'All') {
        if (demandFilter === 'High (100+/mo)' && s.demand < 100) return false;
        if (demandFilter === 'Medium (30-100)' && (s.demand < 30 || s.demand >= 100)) return false;
        if (demandFilter === 'Low (10-30)' && (s.demand < 10 || s.demand >= 30)) return false;
        if (demandFilter === 'Minimal (<10)' && s.demand >= 10) return false;
      }

      if (marginFilter !== 'All') {
        if (marginFilter === 'Excellent (55%+)' && s.margin < 55) return false;
        if (marginFilter === 'Good (40-55%)' && (s.margin < 40 || s.margin >= 55)) return false;
        if (marginFilter === 'Fair (25-40%)' && (s.margin < 25 || s.margin >= 40)) return false;
        if (marginFilter === 'Poor (<25%)' && s.margin >= 25) return false;
      }

      if (qualityFilter !== 'All') {
        if (qualityFilter === 'Excellent (95%+)' && s.passRate < 95) return false;
        if (qualityFilter === 'Good (90-95%)' && (s.passRate < 90 || s.passRate >= 95)) return false;
        if (qualityFilter === 'Fair (85-90%)' && (s.passRate < 85 || s.passRate >= 90)) return false;
        if (qualityFilter === 'Poor (<85%)' && s.passRate >= 85) return false;
      }

      if (trendFilter !== 'All') {
        if (trendFilter === '↑ Growing (+10%+)' && s.demandTrend < 10) return false;
        if (trendFilter === '➡️ Stable (±5%)' && (s.demandTrend < -5 || s.demandTrend > 5)) return false;
        if (trendFilter === '↓ Declining (-10% or more)' && s.demandTrend > -10) return false;
      }

      // Tier 2 Filters
      if (acceptanceFilter !== 'All') {
        if (acceptanceFilter === 'Winning (>30%)' && s.acceptanceRate <= 30) return false;
        if (acceptanceFilter === 'Competitive (20-30%)' && (s.acceptanceRate <= 20 || s.acceptanceRate > 30)) return false;
        if (acceptanceFilter === 'Struggling (<20%)' && s.acceptanceRate >= 20) return false;
      }

      if (riskFilter !== 'All') {
        const isAtRisk = s.margin < 25 || s.passRate < 90 || s.demandTrend < -15 || s.acceptanceRate < 20;
        const isCritical = (s.margin < 20 && s.demandTrend < -20) || s.passRate < 80;
        
        if (riskFilter === 'Healthy ✅' && isAtRisk) return false;
        if (riskFilter === 'At-Risk ⚠️' && !isAtRisk) return false;
        if (riskFilter === 'Critical 🔴' && !isCritical) return false;
      }

      if (revenueFilter !== 'All') {
        if (revenueFilter === 'High (30%+)' && s.revenue < 50000) return false;
        if (revenueFilter === 'Medium (10-30%)' && (s.revenue < 20000 || s.revenue >= 50000)) return false;
        if (revenueFilter === 'Low (1-10%)' && (s.revenue < 5000 || s.revenue >= 20000)) return false;
        if (revenueFilter === 'Minimal (<1%)' && s.revenue >= 5000) return false;
      }

      // Tier 3 Filters
      if (priceFilter !== 'All') {
        if (priceFilter === 'Premium (>$1000)' && s.price <= 1000) return false;
        if (priceFilter === 'Mid-Market ($200-$1000)' && (s.price < 200 || s.price > 1000)) return false;
        if (priceFilter === 'Affordable (<$200)' && s.price >= 200) return false;
      }

      return true;
    });
  }, [
    services, globalSearchQuery, selectedCategory, statusFilter, demandFilter, 
    marginFilter, qualityFilter, trendFilter, acceptanceFilter, riskFilter, 
    revenueFilter, priceFilter
  ]);

  // Sorting Logic
  const sortedServices = useMemo(() => {
    if (!sortField) return filteredServices;
    return [...filteredServices].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDirection === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
  }, [filteredServices, sortField, sortDirection]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedServices.length / itemsPerPage);
  const paginatedServices = sortedServices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#E8EEF5] min-h-full">
      {/* 1. Executive Control Panel */}
      <div className="p-6 pb-2">
        <div className="bg-white rounded-[32px] p-8 flex flex-col gap-6">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative flex items-center">
                <div className="w-12 h-12 bg-[#dcf0fa] rounded-2xl flex items-center justify-center relative z-10">
                  <div className="w-5 h-5 text-[#023e8a]">
                    <ServicesSymbol />
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[#023e8a]">
                  Managed Services
                </h1>
                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.2em] mt-0.5">Comprehensive Diagnostic Catalog & Inventory</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#03045e] text-white px-7 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center gap-2.5"
              >
                <div className="w-4 h-4"><PlusSymbol color="white" /></div>
                New Service Entry
              </button>
            </div>
          </header>

          <div className="h-px bg-[#F3F4F6] w-full"></div>

          <div className="flex flex-col gap-4 bg-[#F9FAFB] p-5 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
              <div className="flex items-center gap-2 text-[#111827] font-black uppercase tracking-widest text-[10px]">
                <svg className="w-4 h-4 text-[#023e8a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                Advanced Marketplace Filters
              </div>
              <div className="flex gap-3 items-center">
                <span className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                  Showing {filteredServices.length} of {services.length} services
                </span>
                <button 
                  onClick={() => {
                    setStatusFilter('All'); setDemandFilter('All'); setMarginFilter('All'); setQualityFilter('All'); setTrendFilter('All');
                    setAcceptanceFilter('All'); setRiskFilter('All'); setRevenueFilter('All'); setSelectedCategory('All');
                    setPriceFilter('All');
                  }}
                  className="text-[9px] font-black uppercase tracking-widest text-[#EF4444] hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Row 1: Core */}
            <div className="grid grid-cols-5 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-[8px] font-black text-[#9CA3AF] uppercase tracking-widest">Status</span>
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="bg-white border border-slate-200 text-xs font-bold p-2 rounded-xl text-[#111827] outline-none focus:border-[#023e8a] shadow-sm cursor-pointer">
                  <option>All</option><option>Active 🟢</option><option>Inactive 🔴</option><option>Archived 📦</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[8px] font-black text-[#9CA3AF] uppercase tracking-widest">Demand</span>
                <select value={demandFilter} onChange={e => { setDemandFilter(e.target.value); setCurrentPage(1); }} className="bg-white border border-slate-200 text-xs font-bold p-2 rounded-xl text-[#111827] outline-none focus:border-[#023e8a] shadow-sm cursor-pointer">
                  <option>All</option><option>High (100+/mo)</option><option>Medium (30-100)</option><option>Low (10-30)</option><option>Minimal (&lt;10)</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[8px] font-black text-[#9CA3AF] uppercase tracking-widest">Margin</span>
                <select value={marginFilter} onChange={e => { setMarginFilter(e.target.value); setCurrentPage(1); }} className="bg-white border border-slate-200 text-xs font-bold p-2 rounded-xl text-[#111827] outline-none focus:border-[#023e8a] shadow-sm cursor-pointer">
                  <option>All</option><option>Excellent (55%+)</option><option>Good (40-55%)</option><option>Fair (25-40%)</option><option>Poor (&lt;25%)</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[8px] font-black text-[#9CA3AF] uppercase tracking-widest">Quality</span>
                <select value={qualityFilter} onChange={e => { setQualityFilter(e.target.value); setCurrentPage(1); }} className="bg-white border border-slate-200 text-xs font-bold p-2 rounded-xl text-[#111827] outline-none focus:border-[#023e8a] shadow-sm cursor-pointer">
                  <option>All</option><option>Excellent (95%+)</option><option>Good (90-95%)</option><option>Fair (85-90%)</option><option>Poor (&lt;85%)</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[8px] font-black text-[#9CA3AF] uppercase tracking-widest">Trend</span>
                <select value={trendFilter} onChange={e => { setTrendFilter(e.target.value); setCurrentPage(1); }} className="bg-white border border-slate-200 text-xs font-bold p-2 rounded-xl text-[#111827] outline-none focus:border-[#023e8a] shadow-sm cursor-pointer">
                  <option>All</option><option>↑ Growing (+10%+)</option><option>➡️ Stable (±5%)</option><option>↓ Declining (-10% or more)</option>
                </select>
              </label>
            </div>

            {/* Row 2: Strategic */}
            <div className="grid grid-cols-5 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-[8px] font-black text-[#9CA3AF] uppercase tracking-widest">Acceptance</span>
                <select value={acceptanceFilter} onChange={e => { setAcceptanceFilter(e.target.value); setCurrentPage(1); }} className="bg-white border border-slate-200 text-xs font-bold p-2 rounded-xl text-[#111827] outline-none focus:border-[#023e8a] shadow-sm cursor-pointer">
                  <option>All</option><option>Winning (&gt;30%)</option><option>Competitive (20-30%)</option><option>Struggling (&lt;20%)</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[8px] font-black text-[#9CA3AF] uppercase tracking-widest">Risk Level</span>
                <select value={riskFilter} onChange={e => { setRiskFilter(e.target.value); setCurrentPage(1); }} className="bg-white border border-slate-200 text-xs font-bold p-2 rounded-xl text-[#111827] outline-none focus:border-[#023e8a] shadow-sm cursor-pointer">
                  <option>All</option><option>Healthy ✅</option><option>At-Risk ⚠️</option><option>Critical 🔴</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[8px] font-black text-[#9CA3AF] uppercase tracking-widest">Revenue Impact</span>
                <select value={revenueFilter} onChange={e => { setRevenueFilter(e.target.value); setCurrentPage(1); }} className="bg-white border border-slate-200 text-xs font-bold p-2 rounded-xl text-[#111827] outline-none focus:border-[#023e8a] shadow-sm cursor-pointer">
                  <option>All</option><option>High (30%+)</option><option>Medium (10-30%)</option><option>Low (1-10%)</option><option>Minimal (&lt;1%)</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[8px] font-black text-[#9CA3AF] uppercase tracking-widest">Category</span>
                <select value={selectedCategory} onChange={e => { setSelectedCategory(e.target.value); setCurrentPage(1); }} className="bg-white border border-slate-200 text-xs font-bold p-2 rounded-xl text-[#111827] outline-none focus:border-[#023e8a] shadow-sm cursor-pointer">
                  <option>All</option><option>Pathology</option><option>Radiology</option><option>Cardiology</option><option>Biochemistry</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[8px] font-black text-[#9CA3AF] uppercase tracking-widest">Price Positioning</span>
                <select value={priceFilter} onChange={e => { setPriceFilter(e.target.value); setCurrentPage(1); }} className="bg-white border border-slate-200 text-xs font-bold p-2 rounded-xl text-[#111827] outline-none focus:border-[#023e8a] shadow-sm cursor-pointer">
                  <option>All</option><option>Premium (&gt;$1000)</option><option>Mid-Market ($200-$1000)</option><option>Affordable (&lt;$200)</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Precision Services Table */}
      <div className="flex-1 px-6 pb-12 flex flex-col overflow-hidden mt-4">
        <div className="flex-1 bg-white rounded-[32px] p-6 overflow-hidden flex flex-col relative transition-all">
          <div className="overflow-x-auto flex-1 scrollbar-none overflow-y-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-[#dcf0fa]">
                  <th onClick={() => handleSort('name')} className="px-6 py-4 text-[9px] font-black text-[#023e8a] uppercase tracking-widest cursor-pointer hover:text-[#03045e] transition-colors first:rounded-l-2xl">
                    Service Name {sortField === 'name' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th onClick={() => handleSort('demand')} className="px-6 py-4 text-[9px] font-black text-[#023e8a] uppercase tracking-widest cursor-pointer hover:text-[#03045e] transition-colors">
                    Demand /month {sortField === 'demand' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th onClick={() => handleSort('price')} className="px-6 py-4 text-[9px] font-black text-[#023e8a] uppercase tracking-widest cursor-pointer hover:text-[#03045e] transition-colors">
                    Price {sortField === 'price' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th onClick={() => handleSort('revenue')} className="px-6 py-4 text-[9px] font-black text-[#023e8a] uppercase tracking-widest cursor-pointer hover:text-[#03045e] transition-colors">
                    Rev/30d {sortField === 'revenue' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th onClick={() => handleSort('margin')} className="px-6 py-4 text-[9px] font-black text-[#023e8a] uppercase tracking-widest cursor-pointer hover:text-[#03045e] transition-colors">
                    Margin {sortField === 'margin' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th onClick={() => handleSort('passRate')} className="px-6 py-4 text-[9px] font-black text-[#023e8a] uppercase tracking-widest cursor-pointer hover:text-[#03045e] transition-colors">
                    Pass % {sortField === 'passRate' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th onClick={() => handleSort('status')} className="px-6 py-4 text-[9px] font-black text-[#023e8a] uppercase tracking-widest cursor-pointer hover:text-[#03045e] transition-colors">
                    Status {sortField === 'status' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="px-6 py-4 text-[9px] font-black text-[#023e8a] uppercase tracking-widest text-right last:rounded-r-2xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedServices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-20 text-center">
                      <p className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] opacity-50">No service catalog entries found</p>
                    </td>
                  </tr>
                ) : (
                  paginatedServices.map(service => (
                    <tr key={service.id} className="group cursor-pointer">
                      <td className="px-6 py-4 bg-white border-b border-slate-100 first:rounded-l-[24px] group-hover:bg-[#F9FAFB] transition-all">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-xs font-bold text-[#111827]">{service.name}</p>
                            <p className="text-[8px] font-bold text-[#9CA3AF] uppercase tracking-widest mt-0.5">{service.code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 bg-white border-b border-slate-100 group-hover:bg-[#F9FAFB] transition-all">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-[#111827]">{service.demand}</span>
                          <span className={`text-[9px] font-black tracking-widest flex items-center gap-0.5 ${service.demandTrend >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                            {service.demandTrend >= 0 ? '↑' : '↓'}{Math.abs(service.demandTrend)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 bg-white border-b border-slate-100 group-hover:bg-[#F9FAFB] transition-all">
                        <span className="text-xs font-bold text-[#111827]">${service.price}</span>
                      </td>
                      <td className="px-6 py-4 bg-white border-b border-slate-100 group-hover:bg-[#F9FAFB] transition-all">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-[#111827]">${service.revenue.toLocaleString()}</span>
                          <span className={`text-[9px] font-black tracking-widest flex items-center gap-0.5 ${service.revenueTrend >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                            {service.revenueTrend >= 0 ? '↑' : '↓'}{Math.abs(service.revenueTrend)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 bg-white border-b border-slate-100 group-hover:bg-[#F9FAFB] transition-all">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#111827]">{service.margin}%</span>
                          {service.margin < 30 && <span className="text-[10px]">❌</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 bg-white border-b border-slate-100 group-hover:bg-[#F9FAFB] transition-all">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#111827]">{service.passRate}%</span>
                          {service.passRate < 90 ? <span className="text-[10px]">❌</span> : service.passRate < 95 ? <span className="text-[10px]">⚠️</span> : null}
                        </div>
                      </td>
                      <td className="px-6 py-4 bg-white border-b border-slate-100 group-hover:bg-[#F9FAFB] transition-all">
                        <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-full w-max border border-slate-100">
                          <span className={`w-1.5 h-1.5 rounded-full ${service.status === 'Active' ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`}></span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-[#111827]">{service.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 bg-white border-b border-slate-100 last:rounded-r-[24px] text-right group-hover:bg-[#F9FAFB] transition-all">
                        <div className="flex items-center justify-end gap-1.5">
                          <button className="px-3 py-1.5 bg-slate-50 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#111827] hover:bg-slate-100 border border-slate-200 transition-all shadow-sm">
                            E/D
                          </button>
                          <button className="px-3 py-1.5 bg-slate-50 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#023e8a] hover:bg-blue-50 border border-slate-200 transition-all shadow-sm">
                            Edit Price
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Command Bar */}
          <div className="px-6 pt-6 flex items-center justify-between">
            <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest">
              Displaying {(currentPage - 1) * itemsPerPage + 1} — {Math.min(currentPage * itemsPerPage, filteredServices.length)} of {filteredServices.length} nodes
            </p>
            <div className="flex items-center gap-1 bg-[#F3F4F6] p-1 rounded-full">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="p-2 hover:bg-white rounded-full text-[#9CA3AF] disabled:opacity-30 transition-all"
              >
                <div className="w-4 h-4"><ArrowLeftSymbol /></div>
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-8 h-8 rounded-full text-[9px] font-black transition-all ${currentPage === i + 1 ? 'bg-[#111827] text-white shadow-md' : 'text-[#9CA3AF] hover:text-[#111827]'}`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => handlePageChange(currentPage + 1)}
                className="p-2 hover:bg-white rounded-full text-[#9CA3AF] disabled:opacity-30 transition-all"
              >
                <div className="w-4 h-4"><ArrowRightSymbol /></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <AddServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        existingServices={services}
        onSuccess={(newService) => {
          setServices([newService, ...services]);
        }}
      />
    </div>
  );
}
