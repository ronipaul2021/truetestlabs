"use client";

import React, { useState } from 'react';
import { Order } from '../page';

interface KanbanBoardProps {
  orders: Order[];
  onOrderClick: (order: Order) => void;
  onStatusChange: (orderId: string, newStatus: Order['status']) => void;
}

const LANES: { id: Order['status']; title: string; color: string; border: string; bg: string }[] = [
  { id: 'pending', title: 'Pending Registration', color: 'text-[#F43F5E]', border: 'border-[#F43F5E]/20', bg: 'bg-[#F43F5E]/10' },
  { id: 'collecting', title: 'Sample Collection', color: 'text-[#F59E0B]', border: 'border-[#F59E0B]/20', bg: 'bg-[#F59E0B]/10' },
  { id: 'processing', title: 'Lab Processing', color: 'text-[#6366F1]', border: 'border-[#6366F1]/20', bg: 'bg-[#6366F1]/10' },
  { id: 'completed', title: 'Completed & Delivered', color: 'text-[#10B981]', border: 'border-[#10B981]/20', bg: 'bg-[#10B981]/10' }
];

export function KanbanBoard({ orders, onOrderClick, onStatusChange }: KanbanBoardProps) {
  const [draggedOrder, setDraggedOrder] = useState<string | null>(null);
  
  // Pagination state: page number per lane
  const [pages, setPages] = useState<Record<string, number>>({
    pending: 1, collecting: 1, processing: 1, completed: 1
  });

  const handleDragStart = (e: React.DragEvent, orderId: string) => {
    setDraggedOrder(orderId);
    e.dataTransfer.setData('orderId', orderId);
    setTimeout(() => {
      const el = document.getElementById(`kanban-card-${orderId}`);
      if (el) el.classList.add('opacity-50');
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent, orderId: string) => {
    setDraggedOrder(null);
    const el = document.getElementById(`kanban-card-${orderId}`);
    if (el) el.classList.remove('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, laneId: Order['status']) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData('orderId');
    if (orderId) {
      onStatusChange(orderId, laneId);
    }
    setDraggedOrder(null);
  };

  return (
    <div className="flex-1 flex gap-6 overflow-x-auto pb-4 scrollbar-none h-full">
      {LANES.map(lane => {
        const laneOrders = orders.filter(o => o.status === lane.id);
        const visibleOrders = laneOrders.slice(0, pages[lane.id] * 10);
        const hasMore = laneOrders.length > pages[lane.id] * 10;
        
        return (
          <div 
            key={lane.id} 
            className="flex-shrink-0 w-[340px] flex flex-col bg-[#162035]/60 backdrop-blur-md rounded-[24px] border border-white/[0.05] p-4 h-full"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, lane.id)}
          >
            {/* Lane Header */}
            <div className={`px-4 py-3.5 rounded-2xl border mb-4 flex items-center justify-between ${lane.bg} ${lane.border}`}>
              <h3 className={`text-[11px] font-black uppercase tracking-widest ${lane.color}`}>{lane.title}</h3>
              <span className={`bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-black ${lane.color}`}>{laneOrders.length}</span>
            </div>

            {/* Lane Cards */}
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1">
              {visibleOrders.map(order => {
                 const isUrgent = order.priority === 'Urgent';
                 const isBreached = new Date(order.expectedCompletion) < new Date() && order.status !== 'completed';
                 
                 return (
                  <div 
                    key={order.id}
                    id={`kanban-card-${order.id}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, order.id)}
                    onDragEnd={(e) => handleDragEnd(e, order.id)}
                    onClick={() => onOrderClick(order)}
                    className={`bg-[#0D1829]/80 rounded-2xl p-5 border cursor-grab active:cursor-grabbing hover:shadow-lg transition-all ${isUrgent ? 'border-[#F43F5E]/40 hover:border-[#F43F5E]/70 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'border-white/[0.08] hover:border-white/[0.15]'}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                       <div>
                         <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{order.id}</p>
                         <p className="text-sm font-black text-white mt-0.5">{order.patientName}</p>
                       </div>
                       {isUrgent && (
                         <div className="w-2 h-2 rounded-full bg-[#F43F5E] animate-pulse shadow-[0_0_8px_#F43F5E]" title="Urgent Priority"></div>
                       )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {order.tests.slice(0, 3).map((test, idx) => (
                        <span key={idx} className="bg-white/[0.03] text-white/60 text-[9px] font-bold px-2 py-1 rounded-md border border-white/[0.05]">
                          {test}
                        </span>
                      ))}
                      {order.tests.length > 3 && (
                        <span className="bg-white/[0.03] text-white/60 text-[9px] font-bold px-2 py-1 rounded-md border border-white/[0.05]">
                          +{order.tests.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between">
                       <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                         <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                         {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </p>
                       {isBreached ? (
                         <span className="text-[9px] font-black text-[#F43F5E] uppercase tracking-widest">Breached</span>
                       ) : (
                         <span className="text-[9px] font-black text-[#10B981] uppercase tracking-widest">On Track</span>
                       )}
                    </div>
                  </div>
                );
              })}
              
              {hasMore && (
                <button 
                  onClick={() => setPages(p => ({ ...p, [lane.id]: p[lane.id] + 1 }))}
                  className="w-full py-3 mt-1 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] rounded-2xl text-[10px] font-black text-white/50 uppercase tracking-widest transition-all"
                >
                  Load More ({laneOrders.length - visibleOrders.length} left)
                </button>
              )}

              {laneOrders.length === 0 && (
                <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/[0.05] rounded-2xl bg-white/[0.01]">
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Drop Here</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
