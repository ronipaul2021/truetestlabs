"use client";

import React, { useState, useMemo } from 'react';
import { NewOrderModal } from './components/OrderModals';
import { OrderDetailDrawer } from './components/OrderDetailDrawer';
import { BarcodeGenerator } from './components/BarcodeGenerator';
import { KanbanBoard } from './components/KanbanBoard';
import { useDashboard } from '@/context/DashboardContext';
import Link from 'next/link';

// ─── Inline Icons ──────────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, sw = 1.8 }: { d: string; size?: number; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const PlusIco     = () => <Ico d="M12 5v14M5 12h14" />;
const ViewIco     = () => <Ico d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0" />;
const PrintIco    = () => <Ico d="M6 9V2h12v7 M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2 M6 14h12v8H6z" />;
const BarcodeIco  = () => <Ico d="M3 5v14 M7 5v14 M11 5v14 M15 5v14 M19 5v14 M2 5h2 M2 19h2 M22 5h-2 M22 19h-2" />;
const FilterIco   = () => <Ico d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />;
const ExportIco   = () => <Ico d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />;
const AlertIco    = () => <Ico d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01" />;
const CheckIco    = () => <Ico d="M20 6L9 17l-5-5" />;
const UserIco     = () => <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />;
const FlaskIco    = () => <Ico d="M10 2v7.5M14 2v7.5M8.5 2h7M12 12c-3.5 0-6 2.5-6 6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3c0-3.5-2.5-6-6-6z" />;
const PulseIco    = () => <Ico d="M22 12h-4l-3 9L9 3l-3 9H2" />;
const LinkIco     = () => <Ico d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />;

// ─── Types ────────────────────────────────────────────────────────────────────
type OrderStatus = 'pending' | 'collecting' | 'processing' | 'completed';
type PriorityStatus = 'Urgent' | 'Routine';
type PaymentStatus = 'Settled' | 'Pending';

export interface Order {
  id: string; patientName: string; patientPhone: string;
  tests: string[]; status: OrderStatus; totalAmount: number;
  createdAt: string; priority: PriorityStatus; paymentStatus: PaymentStatus;
  assignedStaff: string; expectedCompletion: string; prescriber: string; flags: string[];
}

// ─── Status Config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string; border: string; dot: string; glow: string }> = {
  pending:    { label: 'Pending',    bg: 'bg-[#F43F5E]/10', text: 'text-[#F43F5E]', border: 'border-[#F43F5E]/25', dot: 'bg-[#F43F5E]', glow: 'shadow-[0_0_5px_#F43F5E]' },
  collecting: { label: 'Collecting', bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', border: 'border-[#F59E0B]/25', dot: 'bg-[#F59E0B]', glow: '' },
  processing: { label: 'Processing', bg: 'bg-[#6366F1]/10', text: 'text-[#6366F1]', border: 'border-[#6366F1]/25', dot: 'bg-[#6366F1]', glow: '' },
  completed:  { label: 'Completed',  bg: 'bg-[#10B981]/10', text: 'text-[#10B981]', border: 'border-[#10B981]/25', dot: 'bg-[#10B981]', glow: 'shadow-[0_0_5px_#10B981]' },
};

// ─── Mini card ────────────────────────────────────────────────────────────────
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#162035]/85 backdrop-blur-md border border-white/[0.07] rounded-[22px] shadow-xl relative overflow-hidden ${className}`}>
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    {children}
  </div>
);

// ─── Status pill ──────────────────────────────────────────────────────────────
const StatusPill = ({ status, onClick }: { status: OrderStatus; onClick?: () => void }) => {
  const c = STATUS_CONFIG[status];
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all ${c.bg} ${c.text} ${c.border} ${onClick ? 'hover:scale-[1.03] cursor-pointer' : 'cursor-default'}`}
      title={onClick ? 'Click to cycle status' : undefined}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot} ${status === 'pending' ? 'animate-pulse' : ''}`} />
      {c.label}
    </button>
  );
};

// ─── Priority pill ────────────────────────────────────────────────────────────
const PriorityPill = ({ priority }: { priority: PriorityStatus }) => (
  <span className={`text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${
    priority === 'Urgent'
      ? 'bg-[#F43F5E]/10 border-[#F43F5E]/25 text-[#F43F5E]'
      : 'bg-white/[0.04] border-white/[0.08] text-white/30'
  }`}>{priority}</span>
);

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const { requests, globalSearchQuery, setGlobalSearchQuery } = useDashboard();
  const [isModalOpen,    setIsModalOpen]    = useState(false);
  const [selectedOrder,  setSelectedOrder]  = useState<Order | null>(null);
  const [barcodeOrder,   setBarcodeOrder]   = useState<Order | null>(null);
  const [filterStatus,   setFilterStatus]   = useState<OrderStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<PriorityStatus | 'all'>('all');
  const [filterPayment,  setFilterPayment]  = useState<PaymentStatus | 'all'>('all');
  const [viewMode,       setViewMode]       = useState<'list' | 'kanban'>('list');
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [currentPage,    setCurrentPage]    = useState(1);
  const [toast,          setToast]          = useState<string | null>(null);
  const itemsPerPage = 10;

  React.useEffect(() => { setGlobalSearchQuery(""); }, [setGlobalSearchQuery]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const [orders, setOrders] = useState<Order[]>([
    { id:'TTL-240201', patientName:'Sarah Jenkins',   patientPhone:'+91 98765 43210', tests:['Blood Test (CBC)','Lipid Profile'],            status:'pending',    totalAmount:870,  createdAt:'2026-05-03T10:30:00Z', priority:'Routine', paymentStatus:'Settled', assignedStaff:'Dr. Rahul Sharma',  expectedCompletion:'2026-05-03T18:00:00Z', prescriber:'Dr. Jane Smith',       flags:[] },
    { id:'TTL-240199', patientName:'Robert Wilson',   patientPhone:'+91 88776 65544', tests:['MRI Scan Brain'],                               status:'processing', totalAmount:1450, createdAt:'2026-05-03T09:15:00Z', priority:'Urgent',  paymentStatus:'Pending', assignedStaff:'Dr. Anjali Desai',  expectedCompletion:'2026-05-03T14:00:00Z', prescriber:'Dr. Gregory House',    flags:['Requires Contrast'] },
    { id:'TTL-240195', patientName:'Ananya Sharma',   patientPhone:'+91 77665 54433', tests:['X-Ray Chest'],                                  status:'completed',  totalAmount:450,  createdAt:'2026-05-02T16:45:00Z', priority:'Routine', paymentStatus:'Settled', assignedStaff:'Amit Kumar',         expectedCompletion:'2026-05-02T18:00:00Z', prescriber:'Dr. John Doe',         flags:[] },
    { id:'TTL-240190', patientName:'Michael Brown',   patientPhone:'+91 99001 12233', tests:['Liver Function Test'],                          status:'collecting', totalAmount:550,  createdAt:'2026-05-03T08:20:00Z', priority:'Routine', paymentStatus:'Settled', assignedStaff:'Priya Patel',        expectedCompletion:'2026-05-03T16:00:00Z', prescriber:'Self-Prescribed',      flags:['Fasting 12hr'] },
    { id:'TTL-240188', patientName:'Priya Das',       patientPhone:'+91 88990 01122', tests:['Thyroid Profile','Vitamin D'],                  status:'pending',    totalAmount:1850, createdAt:'2026-05-03T07:45:00Z', priority:'Urgent',  paymentStatus:'Settled', assignedStaff:'Dr. Rahul Sharma',  expectedCompletion:'2026-05-03T12:00:00Z', prescriber:'Dr. Meredith Grey',    flags:['VIP Patient'] },
    { id:'TTL-240185', patientName:'John Doe',        patientPhone:'+91 77889 90011', tests:['ECG'],                                          status:'completed',  totalAmount:350,  createdAt:'2026-05-02T14:30:00Z', priority:'Routine', paymentStatus:'Pending', assignedStaff:'Sunil Rao',          expectedCompletion:'2026-05-02T16:00:00Z', prescriber:'Dr. Derek Shepherd',   flags:[] },
    { id:'TTL-240182', patientName:'Elena Gilbert',   patientPhone:'+91 91234 56789', tests:['CBC','CRP'],                                    status:'processing', totalAmount:620,  createdAt:'2026-05-03T06:15:00Z', priority:'Routine', paymentStatus:'Settled', assignedStaff:'Dr. Anjali Desai',  expectedCompletion:'2026-05-03T18:00:00Z', prescriber:'Self-Prescribed',      flags:['Hemolyzed Sample'] },
    { id:'TTL-240180', patientName:'Damon Salvatore', patientPhone:'+91 82345 67890', tests:['Glucose Fasting'],                              status:'pending',    totalAmount:150,  createdAt:'2026-05-03T05:50:00Z', priority:'Routine', paymentStatus:'Settled', assignedStaff:'Priya Patel',        expectedCompletion:'2026-05-03T11:00:00Z', prescriber:'Dr. Stefan Salvatore', flags:['Fasting Required'] },
    { id:'TTL-240178', patientName:'Stefan Weber',    patientPhone:'+91 73456 78901', tests:['Kidney Function'],                              status:'collecting', totalAmount:750,  createdAt:'2026-05-03T04:40:00Z', priority:'Urgent',  paymentStatus:'Pending', assignedStaff:'Sunil Rao',          expectedCompletion:'2026-05-03T08:00:00Z', prescriber:'Dr. Alaric Saltzman',  flags:[] },
    { id:'TTL-240175', patientName:'Klaus Mikaelson', patientPhone:'+91 64567 89012', tests:['Full Body Checkup'],                            status:'completed',  totalAmount:4999, createdAt:'2026-05-01T12:00:00Z', priority:'Routine', paymentStatus:'Settled', assignedStaff:'Dr. Rahul Sharma',  expectedCompletion:'2026-05-02T12:00:00Z', prescriber:'Self-Prescribed',      flags:[] },
  ]);

  // ── CRUD ──────────────────────────────────────────────────────────────────────
  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const cycleStatus = (e: React.MouseEvent, orderId: string, current: OrderStatus) => {
    e.stopPropagation();
    const cycle: OrderStatus[] = ['pending','collecting','processing','completed'];
    const next = cycle[(cycle.indexOf(current) + 1) % cycle.length];
    handleStatusChange(orderId, next);
    showToast(`✓ Status updated to ${next}`);
  };

  const toggleSelection = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const next = new Set(selectedOrders);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedOrders(next);
  };

  // ── Filters ──────────────────────────────────────────────────────────────────
  const filteredOrders = useMemo(() => orders.filter(o => {
    const q = globalSearchQuery.toLowerCase();
    const matchSearch   = o.patientName.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || o.tests.some(t => t.toLowerCase().includes(q));
    const matchStatus   = filterStatus   === 'all' || o.status        === filterStatus;
    const matchPriority = filterPriority === 'all' || o.priority      === filterPriority;
    const matchPayment  = filterPayment  === 'all' || o.paymentStatus === filterPayment;
    return matchSearch && matchStatus && matchPriority && matchPayment;
  }), [orders, globalSearchQuery, filterStatus, filterPriority, filterPayment]);

  const totalPages      = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ── KPI stats ─────────────────────────────────────────────────────────────────
  const kpi = useMemo(() => ({
    total:       orders.length,
    pending:     orders.filter(o => o.status === 'pending').length,
    processing:  orders.filter(o => o.status === 'processing').length,
    completed:   orders.filter(o => o.status === 'completed').length,
    revenue:     orders.reduce((a, o) => a + o.totalAmount, 0),
    urgent:      orders.filter(o => o.priority === 'Urgent').length,
    unpaid:      orders.filter(o => o.paymentStatus === 'Pending').length,
  }), [orders]);

  const clearFilters = () => { setFilterStatus('all'); setFilterPriority('all'); setFilterPayment('all'); setCurrentPage(1); };
  const isFiltered   = filterStatus !== 'all' || filterPriority !== 'all' || filterPayment !== 'all';

  const CustomSelect = ({ label, value, onChange, opts }: { label: string; value: string; onChange: (v: string) => void; opts: {label: string; value: string}[] }) => {
    const [open, setOpen] = useState(false);
    const selectedLabel = opts.find(o => o.value === value)?.label;
    
    return (
      <div className={`flex flex-col gap-2 relative ${open ? 'z-[100]' : 'z-10'}`}>
        <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.18em] pl-1 leading-none">{label}</span>
        <button 
          onClick={() => setOpen(!open)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          className={`flex items-center justify-between gap-4 px-4 py-2.5 bg-[#0D1829] border ${open ? 'border-[#6366F1]/50' : 'border-white/[0.08]'} rounded-xl text-[12px] font-semibold text-white/80 hover:border-white/20 transition-all min-w-[140px]`}
        >
          <span>{selectedLabel}</span>
          <svg className={`w-3.5 h-3.5 text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        {open && (
          <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-[#162035] border border-white/[0.08] rounded-xl overflow-hidden z-[50]">
            {opts.map(o => (
              <button
                key={o.value}
                onClick={() => { onChange(o.value); setCurrentPage(1); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-[12px] transition-all ${
                  value === o.value ? 'bg-[#6366F1]/10 text-white font-bold' : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-h-full page-transition">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] bg-[#162035] border border-white/[0.12] shadow-2xl rounded-2xl px-5 py-3 text-[12px] font-bold text-white flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />{toast}
        </div>
      )}

      {/* ── Control Panel ─────────────────────────────────────────────────────── */}
      <div className={`p-4 sm:p-6 pb-3 ${barcodeOrder ? 'print:hidden' : ''} relative z-[50]`}>
        <Card className="p-5 sm:p-6 !overflow-visible">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6366F1]/30 to-transparent" />

          {/* Title row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#6366F1]/20 to-[#10B981]/10 border border-[#6366F1]/25 flex items-center justify-center text-[#6366F1] shrink-0">
                <FlaskIco />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-black text-white tracking-tight">Patient Overview</h1>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#10B981]/[0.07] border border-[#10B981]/20 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse shadow-[0_0_5px_#10B981]" />
                    <span className="text-[8px] font-black text-[#10B981] uppercase tracking-widest">Live</span>
                  </div>
                </div>
                <p className="text-[9px] font-medium text-white/35 uppercase tracking-[0.15em] mt-0.5">Central Diagnostics Logistics Hub</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* View toggle */}
              <div className="flex bg-white/[0.04] border border-white/[0.07] rounded-xl p-1 gap-1">
                {(['list','kanban'] as const).map(m => (
                  <button key={m} onClick={() => setViewMode(m)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all ${viewMode===m?'bg-[#6366F1] text-white shadow-sm':'text-white/35 hover:text-white/60'}`}>
                    {m}
                  </button>
                ))}
              </div>
              {/* Export */}
              <button onClick={() => window.print()} className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all">
                <ExportIco />
              </button>
              {/* New Entry */}
              <button onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#6366F1] to-[#10B981] text-white rounded-xl text-[11px] font-bold shadow-[0_0_18px_rgba(99,102,241,0.3)] hover:opacity-90 transition-all relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <PlusIco /> New Entry
              </button>
            </div>
          </div>

          {/* KPI mini-row */}
          <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 mb-4">
            {[
              { l:'Total',      v:kpi.total,                         c:'text-white',      bg:'bg-white/[0.04] border-white/[0.06]' },
              { l:'Pending',    v:kpi.pending,                        c:'text-[#F43F5E]',  bg:'bg-[#F43F5E]/[0.07] border-[#F43F5E]/15' },
              { l:'Collecting', v:orders.filter(o=>o.status==='collecting').length, c:'text-[#F59E0B]', bg:'bg-[#F59E0B]/[0.07] border-[#F59E0B]/15' },
              { l:'Processing', v:kpi.processing,                     c:'text-[#6366F1]',  bg:'bg-[#6366F1]/[0.07] border-[#6366F1]/15' },
              { l:'Completed',  v:kpi.completed,                      c:'text-[#10B981]',  bg:'bg-[#10B981]/[0.07] border-[#10B981]/15' },
              { l:'Urgent',     v:kpi.urgent,                         c:'text-[#F43F5E]',  bg:'bg-[#F43F5E]/[0.04] border-[#F43F5E]/10' },
              { l:'Unpaid',     v:kpi.unpaid,                         c:'text-[#F59E0B]',  bg:'bg-[#F59E0B]/[0.04] border-[#F59E0B]/10' },
            ].map((k,i) => (
              <button key={i} onClick={() => { if(k.l==='Pending') setFilterStatus('pending'); else if(k.l==='Processing') setFilterStatus('processing'); else if(k.l==='Completed') setFilterStatus('completed'); else if(k.l==='Collecting') setFilterStatus('collecting'); else clearFilters(); setCurrentPage(1); }}
                className={`${k.bg} border rounded-[12px] px-3 py-2 text-center hover:brightness-125 transition-all`}>
                <p className="text-[7px] font-black text-white/30 uppercase tracking-[0.15em]">{k.l}</p>
                <p className={`text-[15px] font-black ${k.c}`}>{k.v}</p>
              </button>
            ))}
          </div>

          <div className="h-px bg-white/[0.05] mb-4" />

          {/* Filters */}
          <div className="flex items-start gap-4 flex-wrap mt-2">
            <div className="flex items-center gap-1.5 text-[#6366F1] shrink-0 pt-[2px] pr-2">
              <FilterIco /> 
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.18em] leading-none">Filters</span>
            </div>
            <CustomSelect label="Status" value={filterStatus} onChange={v => setFilterStatus(v as any)}
              opts={[{label:'All Status',value:'all'},{label:'Pending',value:'pending'},{label:'Collecting',value:'collecting'},{label:'Processing',value:'processing'},{label:'Completed',value:'completed'}]} />
            <CustomSelect label="Priority" value={filterPriority} onChange={v => setFilterPriority(v as any)}
              opts={[{label:'All Priority',value:'all'},{label:'Urgent',value:'Urgent'},{label:'Routine',value:'Routine'}]} />
            <CustomSelect label="Payment" value={filterPayment} onChange={v => setFilterPayment(v as any)}
              opts={[{label:'All Payment',value:'all'},{label:'Settled',value:'Settled'},{label:'Pending',value:'Pending'}]} />
            
            {isFiltered && (
              <button onClick={clearFilters} className="mt-[22px] px-4 py-2.5 rounded-xl text-[10px] font-bold text-[#F43F5E] bg-[#F43F5E]/[0.07] border border-[#F43F5E]/20 hover:bg-[#F43F5E]/15 transition-all h-[36px]">
                Clear All
              </button>
            )}
            <div className="ml-auto flex items-center gap-2 text-[9px] font-bold text-white/25 mt-[22px] h-[36px]">
              <PulseIco /> {filteredOrders.length} records
            </div>
          </div>
        </Card>
      </div>

      {/* ── Bulk Action Bar ────────────────────────────────────────────────────── */}
      {selectedOrders.size > 0 && (
        <div className="mx-4 sm:mx-6 mb-3">
          <div className="bg-[#6366F1]/10 border border-[#6366F1]/25 rounded-2xl px-5 py-3 flex items-center gap-4 flex-wrap">
            <span className="text-[10px] font-black text-[#A5B4FC] uppercase tracking-widest">{selectedOrders.size} Selected</span>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex gap-2 flex-wrap">
              {[
                { l:'Export CSV',      fn: () => showToast('✓ CSV exported') },
                { l:'Mark Collected',  fn: () => { selectedOrders.forEach(id => handleStatusChange(id, 'collecting')); setSelectedOrders(new Set()); showToast('✓ Marked as collecting'); } },
                { l:'Mark Completed',  fn: () => { selectedOrders.forEach(id => handleStatusChange(id, 'completed'));  setSelectedOrders(new Set()); showToast('✓ Marked as completed'); } },
                { l:'Print Barcodes',  fn: () => showToast('✓ Sending to printer…') },
              ].map((a, i) => (
                <button key={i} onClick={a.fn} className={`px-3.5 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all border ${
                  i === 0 ? 'bg-white/[0.05] border-white/[0.09] text-white/50 hover:text-white' :
                  i === 3 ? 'bg-[#F59E0B]/10 border-[#F59E0B]/25 text-[#F59E0B] hover:bg-[#F59E0B]/20' :
                  'bg-[#10B981]/10 border-[#10B981]/25 text-[#10B981] hover:bg-[#10B981]/20'
                }`}>{a.l}</button>
              ))}
            </div>
            <button onClick={() => setSelectedOrders(new Set())} className="ml-auto text-white/30 hover:text-white text-[9px]">✕ Deselect</button>
          </div>
        </div>
      )}

      {/* ── Content ─────────────────────────────────────────────────────────────── */}
      <div className={`flex-1 px-4 sm:px-6 pb-12 flex flex-col overflow-hidden ${barcodeOrder ? 'print:hidden' : ''}`}>
        {viewMode === 'kanban' ? (
          <KanbanBoard orders={filteredOrders} onOrderClick={setSelectedOrder} onStatusChange={handleStatusChange} />
        ) : (
          <Card className="flex-1 overflow-hidden flex flex-col">

            {/* Empty */}
            {paginatedOrders.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 bg-white/[0.04] border border-white/[0.06] rounded-2xl flex items-center justify-center text-white/20">
                  <FlaskIco />
                </div>
                <p className="text-[12px] font-bold text-white/30">No records match your filters</p>
                <button onClick={clearFilters} className="px-4 py-2 rounded-xl text-[10px] font-bold bg-white/[0.04] border border-white/[0.07] text-white/40 hover:text-white hover:bg-white/[0.08] transition-all">Clear Filters</button>
              </div>
            )}

            {/* Table */}
            {paginatedOrders.length > 0 && (
              <div className="flex-1 overflow-auto scrollbar-none">
                <table className="w-full text-left min-w-[820px]">
                  <thead className="sticky top-0 z-10 bg-[#0D1829]/95 backdrop-blur-md border-b border-white/[0.06]">
                    <tr>
                      <th className="px-5 py-3.5 w-10">
                        <input type="checkbox" className="w-4 h-4 rounded accent-[#6366F1] cursor-pointer bg-white/10 border-white/20"
                          checked={selectedOrders.size === paginatedOrders.length && paginatedOrders.length > 0}
                          onChange={e => e.target.checked ? setSelectedOrders(new Set(paginatedOrders.map(o => o.id))) : setSelectedOrders(new Set())} />
                      </th>
                      {['Order ID','Patient','Tests','Status','Priority','Billing','Actions'].map(h => (
                        <th key={h} className="px-5 py-3.5 text-[8px] font-black text-white/30 uppercase tracking-widest whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map(order => (
                      <tr key={order.id}
                        className="group border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors cursor-pointer"
                        onClick={() => setSelectedOrder(order)}>

                        {/* Checkbox */}
                        <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                          <input type="checkbox" className="w-4 h-4 rounded accent-[#6366F1] cursor-pointer"
                            checked={selectedOrders.has(order.id)} onChange={() => {}} onClick={e => toggleSelection(e, order.id)} />
                        </td>

                        {/* Order ID */}
                        <td className="px-5 py-4">
                          <p className="text-[12px] font-bold text-white">{order.id}</p>
                          <p className="text-[8px] font-bold text-white/25 mt-0.5">
                            {new Date(order.createdAt).toLocaleString('en-IN',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'short'})}
                          </p>
                        </td>

                        {/* Patient */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#818CF8] flex items-center justify-center text-white text-[9px] font-black shrink-0">
                              {order.patientName.split(' ').map(n=>n[0]).slice(0,2).join('')}
                            </div>
                            <div>
                              <p className="text-[12px] font-semibold text-white">{order.patientName}</p>
                              <p className="text-[9px] text-white/35">{order.patientPhone}</p>
                            </div>
                          </div>
                        </td>

                        {/* Tests */}
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {order.tests.slice(0,2).map(t => (
                              <span key={t} className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.07] text-white/60 whitespace-nowrap">{t}</span>
                            ))}
                            {order.tests.length > 2 && (
                              <span className="text-[8px] font-bold text-white/30">+{order.tests.length-2}</span>
                            )}
                          </div>
                          {order.flags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {order.flags.slice(0,1).map(f => (
                                <span key={f} className="text-[7px] font-black px-1.5 py-0.5 rounded-full bg-[#F43F5E]/10 border border-[#F43F5E]/20 text-[#F43F5E]">⚑ {f}</span>
                              ))}
                            </div>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                          <StatusPill status={order.status} onClick={() => {
                            const cycle: OrderStatus[] = ['pending','collecting','processing','completed'];
                            const next = cycle[(cycle.indexOf(order.status) + 1) % cycle.length];
                            handleStatusChange(order.id, next);
                            showToast(`✓ Status updated to ${next}`);
                          }} />
                        </td>

                        {/* Priority */}
                        <td className="px-5 py-4">
                          <PriorityPill priority={order.priority} />
                        </td>

                        {/* Billing */}
                        <td className="px-5 py-4">
                          <p className="text-[13px] font-bold text-white">₹{order.totalAmount.toLocaleString()}</p>
                          <span className={`text-[8px] font-black ${order.paymentStatus==='Settled'?'text-[#10B981]':'text-[#F59E0B]'}`}>
                            {order.paymentStatus}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setSelectedOrder(order)} title="Quick View"
                              className="w-8 h-8 rounded-xl bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center text-[#6366F1] hover:bg-[#6366F1]/20 transition-all"><ViewIco /></button>
                            <Link href={`/dashboard/orders/${order.id}`} title="Full Detail"
                              className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.10] transition-all"><LinkIco /></Link>
                            <button onClick={() => setBarcodeOrder(order)} title="Print Barcode"
                              className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.10] transition-all"><BarcodeIco /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {filteredOrders.length > itemsPerPage && (
              <div className="px-5 py-4 border-t border-white/[0.05] flex items-center justify-between shrink-0">
                <p className="text-[9px] font-bold text-white/25 uppercase tracking-widest">
                  {(currentPage-1)*itemsPerPage+1}–{Math.min(currentPage*itemsPerPage, filteredOrders.length)} of {filteredOrders.length}
                </p>
                <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] p-1 rounded-xl">
                  <button disabled={currentPage===1} onClick={() => setCurrentPage(p=>p-1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 transition-all">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
                  </button>
                  {[...Array(Math.min(totalPages, 6))].map((_, i) => (
                    <button key={i} onClick={() => setCurrentPage(i+1)}
                      className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all ${currentPage===i+1?'bg-[#6366F1] text-white':'text-white/30 hover:text-white hover:bg-white/[0.06]'}`}>
                      {i+1}
                    </button>
                  ))}
                  <button disabled={currentPage===totalPages||totalPages===0} onClick={() => setCurrentPage(p=>p+1)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 transition-all">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────────── */}
      <NewOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={() => showToast('✓ New order created')} />
      <OrderDetailDrawer order={selectedOrder} isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} />

      {barcodeOrder && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setBarcodeOrder(null)} />
          <div className="relative z-10">
            <BarcodeGenerator order={barcodeOrder} />
          </div>
        </div>
      )}
    </div>
  );
}
