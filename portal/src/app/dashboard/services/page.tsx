"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AddServiceModal, ViewServiceModal } from './components/ServiceModals';
import { useDashboard } from '@/context/DashboardContext';

// ── Symbols ──────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const FlaskIcon   = () => <Icon d="M10 2v7.5M14 2v7.5M8.5 2h7M12 12c-3.5 0-6 2.5-6 6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3c0-3.5-2.5-6-6-6z" />;
const PlusIcon    = () => <Icon d="M12 5v14M5 12h14" />;
const FilterIcon  = () => <Icon d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />;
const EditIcon    = () => <Icon d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />;
const EyeIcon     = () => <Icon d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />;
const TrendUpIcon = () => <Icon d="M23 6l-9.5 9.5-5-5L1 18" />;
const ChevIcon    = () => <Icon d="M18 15l-6-6-6 6" size={12} />;
const ExportIcon  = () => <Icon d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />;
const HomeIcon    = () => <Icon d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />;
const CheckIcon   = () => <Icon d="M20 6L9 17l-5-5" size={12} />;
const XIcon       = () => <Icon d="M18 6L6 18M6 6l12 12" size={12} />;

// ── Types ─────────────────────────────────────────────────────────────────────
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
  offerPrice: number | null;
  tat: string;
  specimen: string;
  preparation: string;
  homeCollection: boolean;
  collectionTime: string;
  homeVisitFee: number;
}

// ── Category accent colours ────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  'Lab Tests':          'from-[#6366F1] to-[#818CF8]',
  'Organ Based':        'from-[#10B981] to-[#34D399]',
  'Imaging & Radiology':'from-[#06B6D4] to-[#38BDF8]',
  'Uncategorized':      'from-[#F59E0B] to-[#FCD34D]',
};
const categoryColor = (cat: string) => CATEGORY_COLORS[cat] ?? 'from-[#8B5CF6] to-[#A78BFA]';

const SelectFilter = ({ label, value, onChange, opts }: { label: string; value: string; onChange: (v: string) => void; opts: string[] }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <div className={`flex flex-col gap-1.5 relative ${open ? 'z-[100]' : 'z-10'}`}>
      <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.18em] leading-none">{label}</span>
      <button 
        type="button"
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        className={`flex items-center justify-between gap-2 px-3 py-2 bg-[#0D1829] border ${open ? 'border-[#6366F1]/50' : 'border-white/[0.08]'} rounded-xl text-[11px] font-semibold text-white/80 hover:border-white/20 transition-all text-left w-full`}
      >
        <span className="truncate">{value}</span>
        <svg className={`w-3.5 h-3.5 text-white/40 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
      </button>
      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 min-w-full bg-[#162035] border border-white/[0.08] rounded-xl overflow-y-auto max-h-[220px] custom-scrollbar z-[100]">
          {opts.map(o => (
            <button
              key={o}
              type="button"
              onClick={() => { onChange(o); setOpen(false); }}
              className={`w-full text-left px-3 py-2.5 text-[11px] font-semibold transition-colors ${value === o ? 'bg-[#6366F1]/20 text-[#6366F1]' : 'text-white/70 hover:bg-white/[0.04] hover:text-white'}`}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function ServicesPage() {
  const router = useRouter();
  const { currentCenter, globalSearchQuery, setGlobalSearchQuery } = useDashboard();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingService, setViewingService] = useState<Service | null>(null);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter]     = useState('All');
  const [demandFilter, setDemandFilter]     = useState('All');
  const [marginFilter, setMarginFilter]     = useState('All');
  const [qualityFilter, setQualityFilter]   = useState('All');
  const [trendFilter, setTrendFilter]       = useState('All');
  const [acceptanceFilter, setAcceptanceFilter] = useState('All');
  const [riskFilter, setRiskFilter]         = useState('All');
  const [revenueFilter, setRevenueFilter]   = useState('All');
  const [priceFilter, setPriceFilter]       = useState('All');
  const [viewMode, setViewMode]             = useState<'table' | 'grid'>('table');

  type SortField = 'name' | 'demand' | 'price' | 'revenue' | 'margin' | 'passRate' | 'status' | null;
  const [sortField, setSortField]         = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === 'grid' ? 9 : 10;

  const [services, setServices]   = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => { setGlobalSearchQuery(""); }, [setGlobalSearchQuery]);

  React.useEffect(() => {
    const centerId = currentCenter?.id || 1;
    const API_URL  = typeof window !== "undefined" ? `http://${window.location.hostname}:3000` : "http://localhost:3000";
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_URL}/centers/${centerId}/services`);
        if (res.ok) {
          const data = await res.json();
          setServices(data.map((d: any) => ({
            id: d.id,
            name: d.name,
            code: d.code || `SVC-${d.id}`,
            category: d.category || 'Uncategorized',
            price: (d.offerPrice && d.offerPrice > 0) ? d.offerPrice : (d.price || 0),
            demand: d.demand || 0,
            demandTrend: Math.floor(Math.random() * 20) - 10,
            revenue: (d.price || 0) * (d.demand || 0),
            revenueTrend: Math.floor(Math.random() * 20) - 10,
            margin: d.profitMargin || 0,
            passRate: parseFloat((98.0 + Math.random() * 1.9).toFixed(2)),
            status: d.status || 'Active',
            acceptanceRate: Math.floor(Math.random() * 50) + 10,
            equipment: 'Standard Equipment',
            offerPrice: d.offerPrice || null,
            tat: d.tat || 'N/A',
            specimen: d.specimen || 'N/A',
            preparation: d.preparation || 'N/A',
            homeCollection: d.homeCollection || false,
            collectionTime: 'Any',
            homeVisitFee: d.homeVisitFee || 0
          })));
        }
      } catch (err) {
        console.error("Failed to load services:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [currentCenter]);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDirection(p => p === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('desc'); }
  };

  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) || s.code.toLowerCase().includes(globalSearchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
      if (!matchesSearch || !matchesCategory) return false;
      if (statusFilter !== 'All' && s.status !== statusFilter.split(' ')[0]) return false;
      if (demandFilter !== 'All') {
        if (demandFilter === 'High (100+/mo)'   && s.demand < 100) return false;
        if (demandFilter === 'Medium (30-100)'  && (s.demand < 30  || s.demand >= 100)) return false;
        if (demandFilter === 'Low (10-30)'      && (s.demand < 10  || s.demand >= 30))  return false;
        if (demandFilter === 'Minimal (<10)'    && s.demand >= 10)  return false;
      }
      if (marginFilter !== 'All') {
        if (marginFilter === 'Excellent (55%+)' && s.margin < 55) return false;
        if (marginFilter === 'Good (40-55%)'    && (s.margin < 40 || s.margin >= 55)) return false;
        if (marginFilter === 'Fair (25-40%)'    && (s.margin < 25 || s.margin >= 40)) return false;
        if (marginFilter === 'Poor (<25%)'      && s.margin >= 25) return false;
      }
      if (qualityFilter !== 'All') {
        if (qualityFilter === 'Excellent (95%+)' && s.passRate < 95) return false;
        if (qualityFilter === 'Good (90-95%)'    && (s.passRate < 90 || s.passRate >= 95)) return false;
        if (qualityFilter === 'Fair (85-90%)'    && (s.passRate < 85 || s.passRate >= 90)) return false;
        if (qualityFilter === 'Poor (<85%)'      && s.passRate >= 85) return false;
      }
      if (trendFilter !== 'All') {
        if (trendFilter === 'Growing'  && s.demandTrend < 10)  return false;
        if (trendFilter === 'Stable'   && (s.demandTrend < -5 || s.demandTrend > 5)) return false;
        if (trendFilter === 'Declining' && s.demandTrend > -10) return false;
      }
      if (acceptanceFilter !== 'All') {
        if (acceptanceFilter === 'Winning'     && s.acceptanceRate <= 30) return false;
        if (acceptanceFilter === 'Competitive' && (s.acceptanceRate <= 20 || s.acceptanceRate > 30)) return false;
        if (acceptanceFilter === 'Struggling'  && s.acceptanceRate >= 20) return false;
      }
      if (riskFilter !== 'All') {
        const isAtRisk  = s.margin < 25 || s.passRate < 90 || s.demandTrend < -15 || s.acceptanceRate < 20;
        const isCritical = (s.margin < 20 && s.demandTrend < -20) || s.passRate < 80;
        if (riskFilter === 'Healthy'  && isAtRisk)   return false;
        if (riskFilter === 'At-Risk'  && !isAtRisk)  return false;
        if (riskFilter === 'Critical' && !isCritical) return false;
      }
      if (revenueFilter !== 'All') {
        if (revenueFilter === 'High'   && s.revenue < 50000) return false;
        if (revenueFilter === 'Medium' && (s.revenue < 20000 || s.revenue >= 50000)) return false;
        if (revenueFilter === 'Low'    && (s.revenue < 5000  || s.revenue >= 20000)) return false;
        if (revenueFilter === 'Minimal' && s.revenue >= 5000) return false;
      }
      if (priceFilter !== 'All') {
        if (priceFilter === 'Premium'    && s.price <= 1000) return false;
        if (priceFilter === 'Mid-Market' && (s.price < 200 || s.price > 1000)) return false;
        if (priceFilter === 'Affordable' && s.price >= 200)  return false;
      }
      return true;
    });
  }, [services, globalSearchQuery, selectedCategory, statusFilter, demandFilter, marginFilter, qualityFilter, trendFilter, acceptanceFilter, riskFilter, revenueFilter, priceFilter]);

  const sortedServices = useMemo(() => {
    if (!sortField) return filteredServices;
    return [...filteredServices].sort((a, b) => {
      const av = a[sortField]; const bv = b[sortField];
      if (typeof av === 'string' && typeof bv === 'string')
        return sortDirection === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      return sortDirection === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
  }, [filteredServices, sortField, sortDirection]);

  const uniqueCategories = useMemo(() => ['All', ...Array.from(new Set(services.map(s => s.category).filter(Boolean)))], [services]);
  const totalPages        = Math.ceil(sortedServices.length / itemsPerPage);
  const paginatedServices = sortedServices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleToggleStatus = async (id: number, currentStatus: Service['status']) => {
    const newStatus: Service['status'] = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setServices(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    const API_URL = typeof window !== "undefined" ? `http://${window.location.hostname}:3000` : "http://localhost:3000";
    try {
      await fetch(`${API_URL}/services/${id}/status`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch { setServices(prev => prev.map(s => s.id === id ? { ...s, status: currentStatus } : s)); }
  };

  const clearFilters = () => {
    setStatusFilter('All'); setDemandFilter('All'); setMarginFilter('All'); setQualityFilter('All');
    setTrendFilter('All'); setAcceptanceFilter('All'); setRiskFilter('All'); setRevenueFilter('All');
    setSelectedCategory('All'); setPriceFilter('All'); setCurrentPage(1);
  };

  // ── KPI Stats ────────────────────────────────────────────────────────────────
  const activeCount   = services.filter(s => s.status === 'Active').length;
  const totalRevenue  = services.reduce((a, s) => a + (s.revenue || 0), 0);
  const avgMargin     = services.length ? Math.round(services.reduce((a, s) => a + s.margin, 0) / services.length) : 0;
  const homeEnabled   = services.filter(s => s.homeCollection).length;

  const SortTh = ({ field, label }: { field: SortField; label: string }) => (
    <th onClick={() => handleSort(field)} className="px-5 py-3.5 text-left text-[9px] font-black text-white/40 uppercase tracking-widest cursor-pointer hover:text-[#10B981] transition-colors whitespace-nowrap select-none group">
      <span className="flex items-center gap-1.5">
        {label}
        <span className={`transition-opacity ${sortField === field ? 'opacity-100 text-[#10B981]' : 'opacity-0 group-hover:opacity-50'}`}>
          {sortField === field ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </span>
    </th>
  );



  return (
    <div className="flex-1 flex flex-col min-h-full page-transition">

      {/* ── Control Panel ──────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-6 pb-3">
        <div className="bg-[#162035]/90 backdrop-blur-md border border-white/[0.07] rounded-[24px] p-5 sm:p-6 relative overflow-hidden shadow-2xl">
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#10B981]/40 to-transparent" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Title */}
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#10B981]/20 to-[#6366F1]/10 border border-[#10B981]/25 flex items-center justify-center text-[#10B981] shrink-0">
                <FlaskIcon />
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight">Managed Services</h1>
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-[0.2em] mt-0.5">Comprehensive Diagnostic Catalog & Inventory</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* View Toggle */}
              <div className="flex bg-white/[0.04] border border-white/[0.07] rounded-xl p-1 gap-1">
                <button
                  onClick={() => { setViewMode('table'); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${viewMode === 'table' ? 'bg-[#6366F1] text-white shadow-sm' : 'text-white/40 hover:text-white/70'}`}
                >
                  Table
                </button>
                <button
                  onClick={() => { setViewMode('grid'); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${viewMode === 'grid' ? 'bg-[#6366F1] text-white shadow-sm' : 'text-white/40 hover:text-white/70'}`}
                >
                  Grid
                </button>
              </div>

              {/* Export */}
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-white/[0.04] border border-white/[0.07] rounded-xl text-[10px] font-bold text-white/60 hover:text-white hover:bg-white/[0.08] transition-all"
              >
                <ExportIcon /><span className="hidden sm:inline">Export</span>
              </button>

              {/* Add New */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#10B981] to-[#059669] text-white rounded-xl text-[11px] font-bold tracking-wide hover:opacity-90 transition-all shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_28px_rgba(16,185,129,0.4)] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <PlusIcon /><span>New Service</span>
              </button>
            </div>
          </div>

          {/* ── KPI Row ──────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {[
              { label: 'Total Services', value: services.length.toString(),       color: 'text-[#6366F1]', bg: 'bg-[#6366F1]/10 border-[#6366F1]/20' },
              { label: 'Active',          value: activeCount.toString(),           color: 'text-[#10B981]', bg: 'bg-[#10B981]/10 border-[#10B981]/20' },
              { label: 'Avg Margin',      value: `${avgMargin}%`,                 color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10 border-[#F59E0B]/20' },
              { label: 'Home Enabled',    value: homeEnabled.toString(),           color: 'text-[#06B6D4]', bg: 'bg-[#06B6D4]/10 border-[#06B6D4]/20' },
            ].map((kpi, i) => (
              <div key={i} className={`${kpi.bg} border rounded-[16px] px-4 py-3 flex flex-col gap-1`}>
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${kpi.color}/70`}>{kpi.label}</span>
                <span className={`text-xl font-black ${kpi.color}`}>{kpi.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filters Panel ──────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 pb-3 relative z-[60]">
        <div className="bg-[#162035]/70 backdrop-blur-md border border-white/[0.06] rounded-[20px] p-4 sm:p-5 overflow-visible">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-white/70 font-bold text-[11px] uppercase tracking-widest">
              <span className="text-[#6366F1]"><FilterIcon /></span>
              Smart Filters
              {filteredServices.length < services.length && (
                <span className="ml-2 px-2 py-0.5 bg-[#6366F1]/15 border border-[#6366F1]/25 text-[#6366F1] rounded-full text-[8px] font-black uppercase tracking-widest">
                  {filteredServices.length} / {services.length}
                </span>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="text-[9px] font-black uppercase tracking-widest text-[#F43F5E]/70 hover:text-[#F43F5E] hover:bg-[#F43F5E]/10 px-3 py-1.5 rounded-lg transition-all border border-transparent hover:border-[#F43F5E]/20"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-10 gap-3">
            <SelectFilter label="Status"     value={statusFilter}     onChange={v => { setStatusFilter(v); setCurrentPage(1); }}
              opts={['All', 'Active', 'Inactive', 'Archived']} />
            <SelectFilter label="Category"   value={selectedCategory} onChange={v => { setSelectedCategory(v); setCurrentPage(1); }}
              opts={uniqueCategories} />
            <SelectFilter label="Demand"     value={demandFilter}     onChange={v => { setDemandFilter(v); setCurrentPage(1); }}
              opts={['All', 'High (100+/mo)', 'Medium (30-100)', 'Low (10-30)', 'Minimal (<10)']} />
            <SelectFilter label="Margin"     value={marginFilter}     onChange={v => { setMarginFilter(v); setCurrentPage(1); }}
              opts={['All', 'Excellent (55%+)', 'Good (40-55%)', 'Fair (25-40%)', 'Poor (<25%)']} />
            <SelectFilter label="Quality"    value={qualityFilter}    onChange={v => { setQualityFilter(v); setCurrentPage(1); }}
              opts={['All', 'Excellent (95%+)', 'Good (90-95%)', 'Fair (85-90%)', 'Poor (<85%)']} />
            <SelectFilter label="Trend"      value={trendFilter}      onChange={v => { setTrendFilter(v); setCurrentPage(1); }}
              opts={['All', 'Growing', 'Stable', 'Declining']} />
            <SelectFilter label="Acceptance" value={acceptanceFilter} onChange={v => { setAcceptanceFilter(v); setCurrentPage(1); }}
              opts={['All', 'Winning', 'Competitive', 'Struggling']} />
            <SelectFilter label="Risk"       value={riskFilter}       onChange={v => { setRiskFilter(v); setCurrentPage(1); }}
              opts={['All', 'Healthy', 'At-Risk', 'Critical']} />
            <SelectFilter label="Revenue"    value={revenueFilter}    onChange={v => { setRevenueFilter(v); setCurrentPage(1); }}
              opts={['All', 'High', 'Medium', 'Low', 'Minimal']} />
            <SelectFilter label="Price Band" value={priceFilter}      onChange={v => { setPriceFilter(v); setCurrentPage(1); }}
              opts={['All', 'Premium', 'Mid-Market', 'Affordable']} />
          </div>
        </div>
      </div>

      {/* ── Table / Grid ───────────────────────────────────────────────────── */}
      <div className="flex-1 px-4 sm:px-6 pb-12 flex flex-col overflow-hidden">
        <div className="flex-1 bg-[#162035]/80 backdrop-blur-md rounded-[24px] border border-white/[0.07] shadow-2xl overflow-hidden flex flex-col relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6366F1]/25 to-transparent" />

          {/* Loading */}
          {isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-10 h-10 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
              <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Loading catalog…</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && services.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center py-24 gap-5">
              <div className="w-16 h-16 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 2v7.5M14 2v7.5M8.5 2h7M12 12c-3.5 0-6 2.5-6 6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3c0-3.5-2.5-6-6-6z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-[15px] font-black text-white/70 mb-1">No services in catalog</p>
                <p className="text-[11px] text-white/30">Click "New Service" to add your first diagnostic service</p>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-[#10B981] text-white rounded-xl text-[11px] font-bold hover:opacity-90 transition-all">
                <PlusIcon /> Add First Service
              </button>
            </div>
          )}

          {/* No-results state */}
          {!isLoading && services.length > 0 && filteredServices.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B]">
                <FilterIcon />
              </div>
              <div className="text-center">
                <p className="text-[13px] font-black text-white/60 mb-1">No matches for current filters</p>
                <p className="text-[10px] text-white/30">Try adjusting or clearing the filters above</p>
              </div>
              <button onClick={clearFilters} className="px-4 py-2 bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] rounded-xl text-[10px] font-bold hover:bg-[#F59E0B]/20 transition-all">
                Clear Filters
              </button>
            </div>
          )}

          {/* ── TABLE VIEW ──────────────────────────────────────────────────── */}
          {!isLoading && paginatedServices.length > 0 && viewMode === 'table' && (
            <div className="flex-1 overflow-auto scrollbar-none">
              <table className="w-full text-left min-w-[900px]">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[#0D1829]/95 backdrop-blur-md border-b border-white/[0.06]">
                    <SortTh field="name"     label="Service" />
                    <SortTh field="demand"   label="Demand /mo" />
                    <SortTh field="price"    label="Price" />
                    <SortTh field="revenue"  label="Rev / 30d" />
                    <SortTh field="margin"   label="Margin" />
                    <SortTh field="passRate" label="Pass %" />
                    <SortTh field="status"   label="Status" />
                    <th className="px-5 py-3.5 text-right text-[9px] font-black text-white/40 uppercase tracking-widest pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedServices.map((s, idx) => {
                    const isAtRisk = s.margin < 25 || s.passRate < 90 || s.demandTrend < -15;
                    return (
                      <tr
                        key={s.id}
                        className="group border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors cursor-pointer"
                        onClick={() => router.push(`/dashboard/services/${s.id}`)}
                      >
                        {/* Service Name */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${categoryColor(s.category)} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                              <span className="text-[9px] font-black">{s.name.substring(0, 2).toUpperCase()}</span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13px] font-semibold text-white truncate max-w-[180px]">{s.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[8px] font-bold text-white/35 uppercase tracking-widest">{s.code}</span>
                                <span className="text-[7px] font-bold text-white/25">•</span>
                                <span className="text-[8px] font-medium text-white/35">{s.category}</span>
                                {s.homeCollection && (
                                  <span className="text-[7px] font-black px-1.5 py-0.5 bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20 rounded-full uppercase tracking-widest">Home</span>
                                )}
                                {isAtRisk && (
                                  <span className="text-[7px] font-black px-1.5 py-0.5 bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 rounded-full uppercase tracking-widest">At-Risk</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Demand */}
                        <td className="px-5 py-4">
                          <p className="text-[13px] font-bold text-white">{s.demand}</p>
                          <p className={`text-[10px] font-bold flex items-center gap-0.5 mt-0.5 ${s.demandTrend >= 0 ? 'text-[#10B981]' : 'text-[#F43F5E]'}`}>
                            {s.demandTrend >= 0 ? '↑' : '↓'}{Math.abs(s.demandTrend)}%
                          </p>
                        </td>

                        {/* Price */}
                        <td className="px-5 py-4">
                          <p className="text-[13px] font-bold text-white">₹{s.price.toLocaleString()}</p>
                          {s.homeCollection && (
                            <p className="text-[9px] font-medium text-[#06B6D4] mt-0.5">+₹{s.homeVisitFee} home</p>
                          )}
                        </td>

                        {/* Revenue */}
                        <td className="px-5 py-4">
                          <p className="text-[13px] font-bold text-white">₹{s.revenue.toLocaleString()}</p>
                          <p className={`text-[10px] font-bold flex items-center gap-0.5 mt-0.5 ${s.revenueTrend >= 0 ? 'text-[#10B981]' : 'text-[#F43F5E]'}`}>
                            {s.revenueTrend >= 0 ? '↑' : '↓'}{Math.abs(s.revenueTrend)}%
                          </p>
                        </td>

                        {/* Margin */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1.5">
                            <span className={`text-[13px] font-bold ${s.margin >= 55 ? 'text-[#10B981]' : s.margin >= 40 ? 'text-[#F59E0B]' : 'text-[#F43F5E]'}`}>{s.margin}%</span>
                            <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${s.margin >= 55 ? 'bg-[#10B981]' : s.margin >= 40 ? 'bg-[#F59E0B]' : 'bg-[#F43F5E]'}`} style={{ width: `${Math.min(s.margin, 100)}%` }} />
                            </div>
                          </div>
                        </td>

                        {/* Pass Rate */}
                        <td className="px-5 py-4">
                          <span className={`text-[13px] font-bold ${s.passRate >= 95 ? 'text-[#10B981]' : s.passRate >= 90 ? 'text-[#F59E0B]' : 'text-[#F43F5E]'}`}>
                            {Number(s.passRate).toFixed(1)}%
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => handleToggleStatus(s.id, s.status)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all hover:scale-[1.03] ${
                              s.status === 'Active'
                                ? 'bg-[#10B981]/10 border-[#10B981]/25 text-[#10B981] hover:bg-[#10B981]/20'
                                : 'bg-[#F43F5E]/10 border-[#F43F5E]/25 text-[#F43F5E] hover:bg-[#F43F5E]/20'
                            }`}
                            title={`Click to set ${s.status === 'Active' ? 'Inactive' : 'Active'}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'Active' ? 'bg-[#10B981] shadow-[0_0_5px_#10B981]' : 'bg-[#F43F5E]'}`} />
                            {s.status}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => router.push(`/dashboard/services/${s.id}`)}
                              className="w-8 h-8 rounded-xl bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center text-[#6366F1] hover:bg-[#6366F1]/20 transition-all"
                              title="Edit Service"
                            >
                              <EditIcon />
                            </button>
                            <button
                              onClick={() => setViewingService(s)}
                              className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] transition-all"
                              title="View Details"
                            >
                              <EyeIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ── GRID VIEW ──────────────────────────────────────────────────── */}
          {!isLoading && paginatedServices.length > 0 && viewMode === 'grid' && (
            <div className="flex-1 overflow-y-auto p-5 scrollbar-none">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {paginatedServices.map(s => (
                  <div
                    key={s.id}
                    onClick={() => router.push(`/dashboard/services/${s.id}`)}
                    className="group bg-[#0D1829]/60 border border-white/[0.06] rounded-[20px] p-4 cursor-pointer hover:border-[#6366F1]/30 hover:bg-[#0D1829]/90 hover:-translate-y-1 transition-all relative overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${categoryColor(s.category)} opacity-60`} />

                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${categoryColor(s.category)} flex items-center justify-center text-white text-[10px] font-black shadow-sm`}>
                        {s.name.substring(0, 2).toUpperCase()}
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); handleToggleStatus(s.id, s.status); }}
                        className={`text-[8px] font-black px-2 py-1 rounded-full border flex items-center gap-1 transition-all ${
                          s.status === 'Active' ? 'bg-[#10B981]/10 border-[#10B981]/25 text-[#10B981]' : 'bg-[#F43F5E]/10 border-[#F43F5E]/25 text-[#F43F5E]'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'Active' ? 'bg-[#10B981]' : 'bg-[#F43F5E]'}`} />
                        {s.status}
                      </button>
                    </div>

                    <p className="text-[13px] font-semibold text-white mb-0.5 leading-snug line-clamp-2">{s.name}</p>
                    <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-3">{s.category} • {s.code}</p>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-white/[0.04] rounded-xl px-3 py-2">
                        <p className="text-[7px] font-black text-white/30 uppercase tracking-widest mb-1">Price</p>
                        <p className="text-[12px] font-bold text-white">₹{s.price.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/[0.04] rounded-xl px-3 py-2">
                        <p className="text-[7px] font-black text-white/30 uppercase tracking-widest mb-1">Demand</p>
                        <div className="flex items-center gap-1.5">
                          <p className="text-[12px] font-bold text-white">{s.demand}</p>
                          <span className={`text-[9px] font-bold ${s.demandTrend >= 0 ? 'text-[#10B981]' : 'text-[#F43F5E]'}`}>
                            {s.demandTrend >= 0 ? '↑' : '↓'}{Math.abs(s.demandTrend)}%
                          </span>
                        </div>
                      </div>
                      <div className="bg-white/[0.04] rounded-xl px-3 py-2">
                        <p className="text-[7px] font-black text-white/30 uppercase tracking-widest mb-1">Margin</p>
                        <p className={`text-[12px] font-bold ${s.margin >= 55 ? 'text-[#10B981]' : s.margin >= 40 ? 'text-[#F59E0B]' : 'text-[#F43F5E]'}`}>{s.margin}%</p>
                      </div>
                      <div className="bg-white/[0.04] rounded-xl px-3 py-2">
                        <p className="text-[7px] font-black text-white/30 uppercase tracking-widest mb-1">Pass %</p>
                        <p className={`text-[12px] font-bold ${s.passRate >= 95 ? 'text-[#10B981]' : s.passRate >= 90 ? 'text-[#F59E0B]' : 'text-[#F43F5E]'}`}>{Number(s.passRate).toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
                      <div className="flex gap-1.5">
                        {s.homeCollection && <span className="text-[7px] font-black px-1.5 py-0.5 bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20 rounded-full uppercase">Home</span>}
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); router.push(`/dashboard/services/${s.id}`); }}
                        className="text-[9px] font-bold text-[#6366F1] hover:text-white flex items-center gap-1 group-hover:gap-2 transition-all"
                      >
                        Edit Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Pagination ──────────────────────────────────────────────────── */}
          {!isLoading && sortedServices.length > itemsPerPage && (
            <div className="px-5 py-4 border-t border-white/[0.05] flex items-center justify-between shrink-0">
              <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
                {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredServices.length)} of {filteredServices.length} services
              </p>
              <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] p-1 rounded-xl">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 transition-all"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all ${currentPage === page ? 'bg-[#6366F1] text-white shadow-sm' : 'text-white/40 hover:text-white hover:bg-white/[0.06]'}`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 transition-all"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Service Modal */}
      <AddServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        existingServices={services}
        centerId={currentCenter?.id || 1}
        onSuccess={(newService) => setServices([newService, ...services])}
      />
      
      {/* View Service Details Modal */}
      <ViewServiceModal 
        service={viewingService} 
        onClose={() => setViewingService(null)} 
      />
    </div>
  );
}
