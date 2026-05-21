"use client";

import React, { useState, useMemo } from 'react';
import { NewOrderModal } from './components/OrderModals';
import { OrderDetailDrawer } from './components/OrderDetailDrawer';
import { BarcodeGenerator } from './components/BarcodeGenerator';
import { KanbanBoard } from './components/KanbanBoard';
import { useDashboard } from '@/context/DashboardContext';
import { OrdersSymbol, ViewSymbol, PrintSymbol, PlusSymbol, PulseSymbol, ArrowLeftSymbol, ArrowRightSymbol } from '../components/Symbols';

type OrderStatus = 'pending' | 'collecting' | 'processing' | 'completed';

type PriorityStatus = 'Urgent' | 'Routine';
type PaymentStatus = 'Settled' | 'Pending';

export interface Order {
  id: string;
  patientName: string;
  patientPhone: string;
  tests: string[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  priority: PriorityStatus;
  paymentStatus: PaymentStatus;
  assignedStaff: string;
  expectedCompletion: string;
  prescriber: string;
  flags: string[];
}

export default function OrdersPage() {
  const { requests, globalSearchQuery, setGlobalSearchQuery } = useDashboard();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [barcodeOrder, setBarcodeOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [filterPriority, setFilterPriority] = useState<PriorityStatus | 'all'>('all');
  const [filterPayment, setFilterPayment] = useState<PaymentStatus | 'all'>('all');
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

  // Handle Drag-and-Drop Kanban Status Updates
  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const toggleSelection = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const next = new Set(selectedOrders);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedOrders(next);
  };

  // Clear search on mount to ensure contextual search
  React.useEffect(() => {
    setGlobalSearchQuery("");
  }, [setGlobalSearchQuery]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock orders
  const [orders, setOrders] = useState<Order[]>([
    { id: 'TTL-240201', patientName: 'Sarah Jenkins', patientPhone: '+91 98765 43210', tests: ['Blood Test (CBC)', 'Lipid Profile'], status: 'pending', totalAmount: 870, createdAt: '2026-05-03T10:30:00Z', priority: 'Routine', paymentStatus: 'Settled', assignedStaff: 'Dr. Rahul Sharma', expectedCompletion: '2026-05-03T18:00:00Z', prescriber: 'Dr. Jane Smith', flags: [] },
    { id: 'TTL-240199', patientName: 'Robert Wilson', patientPhone: '+91 88776 65544', tests: ['MRI Scan Brain'], status: 'processing', totalAmount: 1450, createdAt: '2026-05-03T09:15:00Z', priority: 'Urgent', paymentStatus: 'Pending', assignedStaff: 'Dr. Anjali Desai', expectedCompletion: '2026-05-03T14:00:00Z', prescriber: 'Dr. Gregory House', flags: ['Requires Contrast'] },
    { id: 'TTL-240195', patientName: 'Ananya Sharma', patientPhone: '+91 77665 54433', tests: ['X-Ray Chest'], status: 'completed', totalAmount: 450, createdAt: '2026-05-02T16:45:00Z', priority: 'Routine', paymentStatus: 'Settled', assignedStaff: 'Amit Kumar', expectedCompletion: '2026-05-02T18:00:00Z', prescriber: 'Dr. John Doe', flags: [] },
    { id: 'TTL-240190', patientName: 'Michael Brown', patientPhone: '+91 99001 12233', tests: ['Liver Function Test'], status: 'collecting', totalAmount: 550, createdAt: '2026-05-03T08:20:00Z', priority: 'Routine', paymentStatus: 'Settled', assignedStaff: 'Priya Patel', expectedCompletion: '2026-05-03T16:00:00Z', prescriber: 'Self-Prescribed', flags: ['Fasting 12hr'] },
    { id: 'TTL-240188', patientName: 'Priya Das', patientPhone: '+91 88990 01122', tests: ['Thyroid Profile', 'Vitamin D'], status: 'pending', totalAmount: 1850, createdAt: '2026-05-03T07:45:00Z', priority: 'Urgent', paymentStatus: 'Settled', assignedStaff: 'Dr. Rahul Sharma', expectedCompletion: '2026-05-03T12:00:00Z', prescriber: 'Dr. Meredith Grey', flags: ['VIP Patient'] },
    { id: 'TTL-240185', patientName: 'John Doe', patientPhone: '+91 77889 90011', tests: ['ECG'], status: 'completed', totalAmount: 350, createdAt: '2026-05-02T14:30:00Z', priority: 'Routine', paymentStatus: 'Pending', assignedStaff: 'Sunil Rao', expectedCompletion: '2026-05-02T16:00:00Z', prescriber: 'Dr. Derek Shepherd', flags: [] },
    { id: 'TTL-240182', patientName: 'Elena Gilbert', patientPhone: '+91 91234 56789', tests: ['CBC', 'CRP'], status: 'processing', totalAmount: 620, createdAt: '2026-05-03T06:15:00Z', priority: 'Routine', paymentStatus: 'Settled', assignedStaff: 'Dr. Anjali Desai', expectedCompletion: '2026-05-03T18:00:00Z', prescriber: 'Self-Prescribed', flags: ['Hemolyzed Sample Warning'] },
    { id: 'TTL-240180', patientName: 'Damon Salvatore', patientPhone: '+91 82345 67890', tests: ['Glucose Fasting'], status: 'pending', totalAmount: 150, createdAt: '2026-05-03T05:50:00Z', priority: 'Routine', paymentStatus: 'Settled', assignedStaff: 'Priya Patel', expectedCompletion: '2026-05-03T11:00:00Z', prescriber: 'Dr. Stefan Salvatore', flags: ['Fasting Required'] },
    { id: 'TTL-240178', patientName: 'Stefan Weber', patientPhone: '+91 73456 78901', tests: ['Kidney Function'], status: 'collecting', totalAmount: 750, createdAt: '2026-05-03T04:40:00Z', priority: 'Urgent', paymentStatus: 'Pending', assignedStaff: 'Sunil Rao', expectedCompletion: '2026-05-03T08:00:00Z', prescriber: 'Dr. Alaric Saltzman', flags: [] },
    { id: 'TTL-240175', patientName: 'Klaus Mikaelson', patientPhone: '+91 64567 89012', tests: ['Full Body Checkup'], status: 'completed', totalAmount: 4999, createdAt: '2026-05-01T12:00:00Z', priority: 'Routine', paymentStatus: 'Settled', assignedStaff: 'Dr. Rahul Sharma', expectedCompletion: '2026-05-02T12:00:00Z', prescriber: 'Self-Prescribed', flags: [] },
  ]);

  // Filtering Logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.patientName.toLowerCase().includes(globalSearchQuery.toLowerCase()) || order.id.toLowerCase().includes(globalSearchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || order.priority === filterPriority;
      const matchesPayment = filterPayment === 'all' || order.paymentStatus === filterPayment;
      return matchesSearch && matchesStatus && matchesPriority && matchesPayment;
    });
  }, [orders, globalSearchQuery, filterStatus, filterPriority, filterPayment]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-[#FEE2E2] text-[#DC3545] border-[#FEE2E2]';
      case 'collecting': return 'bg-[#FEF3C7] text-[#D97706] border-[#FEF3C7]';
      case 'processing': return 'bg-[#DBEAFE] text-[#2563EB] border-[#DBEAFE]';
      case 'completed': return 'bg-[#E2F3E9] text-[#10B981] border-[#E2F3E9]';
    }
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
                    <OrdersSymbol />
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[#023e8a]">
                  Patient Orders
                </h1>
                <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.2em] mt-0.5">Central Diagnostics Logistics Hub</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-slate-100 p-1 rounded-full mr-4">
                <button 
                  onClick={() => setViewMode('list')}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-white text-[#023e8a] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  List View
                </button>
                <button 
                  onClick={() => setViewMode('kanban')}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'kanban' ? 'bg-white text-[#023e8a] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Kanban Board
                </button>
              </div>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#03045e] text-white px-7 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center gap-2.5"
              >
                <div className="w-4 h-4"><PlusSymbol color="white" /></div>
                New Entry
              </button>
            </div>
          </header>

          <div className="h-px bg-[#F3F4F6] w-full"></div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Advanced Filters Container */}
            <div className="flex items-center gap-3">
              {/* Custom Status Dropdown */}
              <div className="relative inline-block">
                <button
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-[#023e8a] hover:bg-slate-100 transition-colors shadow-sm"
                >
                  Status: {filterStatus}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                {isStatusDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-40">
                    {['all', 'pending', 'collecting', 'processing', 'completed'].map(status => (
                      <button
                        key={status}
                        onClick={() => {
                          setFilterStatus(status as any);
                          setCurrentPage(1);
                          setIsStatusDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === status ? 'bg-[#023e8a] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-[#023e8a]'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            
               <select 
                 value={filterPriority}
                 onChange={(e) => setFilterPriority(e.target.value as any)}
                 className="bg-slate-50 border border-slate-200 text-[#023e8a] text-[10px] font-black uppercase tracking-widest rounded-full px-4 py-2 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
               >
                 <option value="all">Priority: All</option>
                 <option value="Urgent">Priority: Urgent</option>
                 <option value="Routine">Priority: Routine</option>
               </select>

               <select 
                 value={filterPayment}
                 onChange={(e) => setFilterPayment(e.target.value as any)}
                 className="bg-slate-50 border border-slate-200 text-[#023e8a] text-[10px] font-black uppercase tracking-widest rounded-full px-4 py-2 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
               >
                 <option value="all">Payment: All</option>
                 <option value="Settled">Payment: Settled</option>
                 <option value="Pending">Payment: Pending</option>
               </select>
            </div>

            <div className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest flex items-center gap-2 pr-2 ml-auto">
              <div className="w-4 h-4"><PulseSymbol /></div>
              Live Hub: {filteredOrders.length} active records
            </div>
          </div>
        </div>
      </div>

      {/* 2. Precision Orders View */}
      <div className="flex-1 px-6 pb-12 flex flex-col overflow-hidden mt-4">
        {viewMode === 'kanban' ? (
           <KanbanBoard orders={filteredOrders} onOrderClick={setSelectedOrder} onStatusChange={handleStatusChange} />
        ) : (
          <div className="flex-1 bg-white rounded-[32px] p-6 overflow-hidden flex flex-col relative transition-all">
            
            {/* Bulk Actions Floating Bar */}
            {selectedOrders.size > 0 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#023e8a] text-white px-6 py-3 rounded-full flex items-center gap-6 shadow-xl z-20 animate-in slide-in-from-top-4">
                <span className="text-[10px] font-black uppercase tracking-widest">{selectedOrders.size} Selected</span>
                <div className="h-4 w-px bg-white/20"></div>
                <div className="flex gap-2">
                  <button className="text-[9px] font-bold uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full transition-colors">Export CSV</button>
                  <button className="text-[9px] font-bold uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full transition-colors">Mark Collected</button>
                  <button className="text-[9px] font-bold uppercase tracking-widest bg-[#10B981] hover:bg-emerald-400 px-4 py-1.5 rounded-full transition-colors shadow-sm">Assign Staff</button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto flex-1 scrollbar-none overflow-y-auto">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr>
                    <th className="px-6 pb-4 text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest w-12">
                      <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300 cursor-pointer" onChange={(e) => {
                        if (e.target.checked) setSelectedOrders(new Set(paginatedOrders.map(o => o.id)));
                        else setSelectedOrders(new Set());
                      }} checked={selectedOrders.size === paginatedOrders.length && paginatedOrders.length > 0} />
                    </th>
                    <th className="px-6 pb-4 text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest">Diagnostic ID</th>
                    <th className="px-6 pb-4 text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest">Patient Flow</th>
                    <th className="px-6 pb-4 text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest">Clinical Protocol</th>
                    <th className="px-6 pb-4 text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest">Current Status</th>
                    <th className="px-6 pb-4 text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest">Billing</th>
                    <th className="px-6 pb-4 text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-20 text-center">
                         <p className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] opacity-50">No diagnostic records found</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map(order => (
                      <tr key={order.id} className="group cursor-pointer" onClick={() => setSelectedOrder(order)}>
                        <td className="px-6 py-4 bg-[#F3F4F6] first:rounded-l-full group-hover:bg-[#111827] group-hover:text-white transition-all w-12">
                          <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-slate-300 cursor-pointer" checked={selectedOrders.has(order.id)} onClick={(e) => toggleSelection(e, order.id)} />
                        </td>
                        <td className="px-6 py-4 bg-[#F3F4F6] group-hover:bg-[#111827] group-hover:text-white transition-all">
                        <p className="text-xs font-bold">{order.id}</p>
                        <p className="text-[8px] font-bold text-[#9CA3AF] uppercase mt-0.5 group-hover:text-[#9CA3AF]">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </td>
                      <td className="px-6 py-4 bg-[#F3F4F6] group-hover:bg-[#111827] group-hover:text-white transition-all">
                        <p className="text-xs font-bold">{order.patientName}</p>
                        <p className="text-[9px] text-[#9CA3AF] font-bold group-hover:text-[#9CA3AF]">{order.patientPhone}</p>
                      </td>
                      <td className="px-6 py-4 bg-[#F3F4F6] group-hover:bg-[#111827] group-hover:text-white transition-all">
                        <div className="flex flex-wrap gap-1">
                          {order.tests.slice(0, 2).map(test => (
                            <span key={test} className="bg-white/50 text-[#111827] text-[8px] font-bold uppercase px-2 py-0.5 rounded-full border border-white/20 group-hover:bg-white/10 group-hover:text-white">
                              {test}
                            </span>
                          ))}
                          {order.tests.length > 2 && (
                            <span className="text-[8px] font-bold text-[#9CA3AF] uppercase px-1">+ {order.tests.length - 2} more</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 bg-[#F3F4F6] group-hover:bg-[#111827] group-hover:text-white transition-all">
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 bg-[#F3F4F6] group-hover:bg-[#111827] group-hover:text-white transition-all">
                        <p className="text-xs font-bold">₹{order.totalAmount}</p>
                        <p className="text-[8px] font-bold text-[#10B981] uppercase tracking-widest">Settled</p>
                      </td>
                      <td className="px-6 py-4 bg-[#F3F4F6] last:rounded-r-full text-right group-hover:bg-[#111827] group-hover:text-white transition-all">
                        <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="w-8 h-8 p-1.5 bg-white rounded-full hover:bg-[#111827] hover:text-white shadow-sm transition-all flex items-center justify-center group-hover:bg-white/10 group-hover:border group-hover:border-white/20" title="Analysis View"
                          >
                            <ViewSymbol />
                          </button>
                          <button 
                            onClick={() => setBarcodeOrder(order)}
                            className="w-8 h-8 p-1.5 bg-white rounded-full hover:bg-[#111827] hover:text-white shadow-sm transition-all flex items-center justify-center group-hover:bg-white/10 group-hover:border group-hover:border-white/20" title="Print Protocol"
                          >
                            <PrintSymbol />
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
               Displaying {(currentPage - 1) * itemsPerPage + 1} — {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} nodes
             </p>
             <div className="flex items-center gap-1 bg-[#F3F4F6] p-1 rounded-full">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="p-2 hover:bg-white rounded-full text-[#9CA3AF] disabled:opacity-30 transition-all"
                >
                  <div className="w-4 h-4"><ArrowLeftSymbol /></div>
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-full text-[9px] font-black transition-all ${currentPage === i + 1 ? 'bg-[#111827] text-white shadow-md' : 'text-[#9CA3AF] hover:text-[#111827]'}`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="p-2 hover:bg-white rounded-full text-[#9CA3AF] disabled:opacity-30 transition-all"
                >
                  <div className="w-4 h-4"><ArrowRightSymbol /></div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals & Technical Drawers */}
      <NewOrderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => { console.log("System Order Logged."); }}
      />

      <OrderDetailDrawer 
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      {barcodeOrder && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#111827]/40 backdrop-blur-sm" onClick={() => setBarcodeOrder(null)}></div>
          <div className="relative animate-in fade-in zoom-in duration-300">
            <BarcodeGenerator id={barcodeOrder.id} name={barcodeOrder.patientName} />
          </div>
        </div>
      )}
    </div>
  );
}
