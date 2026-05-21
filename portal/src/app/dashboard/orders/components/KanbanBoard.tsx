"use client";

import React, { useState } from 'react';
import { Order } from '../page';

interface KanbanBoardProps {
  orders: Order[];
  onOrderClick: (order: Order) => void;
  onStatusChange: (orderId: string, newStatus: Order['status']) => void;
}

const LANES: { id: Order['status']; title: string; color: string }[] = [
  { id: 'pending', title: 'Pending Registration', color: 'bg-rose-50 border-rose-200 text-rose-700' },
  { id: 'collecting', title: 'Sample Collection', color: 'bg-amber-50 border-amber-200 text-amber-700' },
  { id: 'processing', title: 'Lab Processing', color: 'bg-sky-50 border-sky-200 text-sky-700' },
  { id: 'completed', title: 'Completed & Delivered', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' }
];

export function KanbanBoard({ orders, onOrderClick, onStatusChange }: KanbanBoardProps) {
  const [draggedOrder, setDraggedOrder] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, orderId: string) => {
    setDraggedOrder(orderId);
    e.dataTransfer.setData('orderId', orderId);
    // Slight delay to allow the drag image to generate before adding opacity
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
        
        return (
          <div 
            key={lane.id} 
            className="flex-shrink-0 w-80 flex flex-col bg-slate-50/50 rounded-[24px] border border-slate-100 p-4 h-full"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, lane.id)}
          >
            {/* Lane Header */}
            <div className={`px-4 py-3 rounded-2xl border mb-4 flex items-center justify-between ${lane.color}`}>
              <h3 className="text-[11px] font-black uppercase tracking-widest">{lane.title}</h3>
              <span className="bg-white/50 px-2 py-0.5 rounded-full text-[10px] font-black">{laneOrders.length}</span>
            </div>

            {/* Lane Cards */}
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto scrollbar-none pr-1">
              {laneOrders.map(order => {
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
                    className={`bg-white rounded-2xl p-5 border cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${isUrgent ? 'border-rose-200' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                       <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.id}</p>
                         <p className="text-sm font-black text-[#023e8a] mt-0.5">{order.patientName}</p>
                       </div>
                       {isUrgent && (
                         <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Urgent Priority"></div>
                       )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {order.tests.slice(0, 2).map((test, idx) => (
                        <span key={idx} className="bg-slate-50 text-slate-600 text-[9px] font-bold px-2 py-1 rounded-md border border-slate-100">
                          {test}
                        </span>
                      ))}
                      {order.tests.length > 2 && (
                        <span className="bg-slate-50 text-slate-600 text-[9px] font-bold px-2 py-1 rounded-md border border-slate-100">
                          +{order.tests.length - 2}
                        </span>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                         <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                         {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </p>
                       {isBreached ? (
                         <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Breached</span>
                       ) : (
                         <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">On Track</span>
                       )}
                    </div>
                  </div>
                );
              })}
              
              {laneOrders.length === 0 && (
                <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Drop Here</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
