"use client";

import React from 'react';

interface BarcodeGeneratorProps {
  id: string;
  name: string;
}

export function BarcodeGenerator({ id, name }: BarcodeGeneratorProps) {
  // Simple "visual" barcode using varying width rectangles
  const bars = [2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 2, 1, 3, 1, 2, 4, 1, 2, 1];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl max-w-sm mx-auto text-center space-y-4">
      <div className="flex flex-col items-center">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">TrueTest Diagnostics</h3>
        
        {/* SVG Barcode */}
        <div className="flex items-center justify-center h-20 w-full px-4">
          <svg className="h-full w-full" viewBox="0 0 100 40" preserveAspectRatio="none">
            {bars.map((width, i) => (
              <rect 
                key={i} 
                x={i * 3.7} 
                y="0" 
                width={width * 0.8} 
                height="40" 
                fill="black" 
              />
            ))}
          </svg>
        </div>
        
        <p className="mt-3 text-sm font-black text-slate-800 tracking-[0.5em]">{id}</p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
        <div className="text-left">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Patient Name</p>
          <p className="text-[11px] font-bold text-slate-700">{name}</p>
        </div>
        <div className="text-right">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Date</p>
          <p className="text-[11px] font-bold text-slate-700">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="pt-2">
         <button onClick={() => window.print()} className="w-full py-2 bg-[var(--deep-navy)] hover:bg-[var(--deep-navy)] border border-slate-200 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500 transition-colors">
            Confirm & Print Sticker
         </button>
      </div>
    </div>
  );
}
