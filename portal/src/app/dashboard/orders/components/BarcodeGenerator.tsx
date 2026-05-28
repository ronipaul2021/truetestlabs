"use client";

import React from 'react';

interface BarcodeGeneratorProps {
  order?: {
    id: string;
    patientName: string;
    tests?: string[];
    age?: number;
    gender?: string;
  };
  id?: string; // Fallback for backward compatibility
  name?: string; // Fallback for backward compatibility
}

export function BarcodeGenerator({ order, id, name }: BarcodeGeneratorProps) {
  const displayId = order?.id || id || '';
  const displayName = order?.patientName || name || '';
  
  // Simple "visual" barcode using varying width rectangles
  const bars = [2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 2, 1, 3, 1, 2, 4, 1, 2, 1];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl max-w-sm mx-auto text-center space-y-4">
      <div className="flex flex-col items-center">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Biswas Medicare</h3>
        
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
        
        <p className="mt-3 text-sm font-black text-white tracking-[0.5em]">{displayId}</p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-between items-start text-left">
        <div>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Patient Name</p>
          <p className="text-[11px] font-bold text-white">{displayName}</p>
        </div>
        <div className="text-right">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Date</p>
          <p className="text-[11px] font-bold text-white">{new Date().toLocaleDateString()}</p>
        </div>
      </div>
      
      {order?.tests && order.tests.length > 0 && (
        <div className="pt-2 text-left">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Investigations</p>
          <div className="flex flex-wrap gap-1">
            {order.tests.map((test, i) => (
              <span key={i} className="text-[9px] font-bold bg-[#F9FAFB] border border-slate-200 px-2 py-0.5 rounded-md text-slate-600">
                {test}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 print:hidden">
         <button onClick={() => window.print()} className="w-full py-2 bg-[#023e8a] hover:bg-[#03045e] border border-slate-200 rounded-lg text-[9px] font-black uppercase tracking-widest text-white transition-colors shadow-sm">
            Confirm & Print Sticker
         </button>
      </div>
    </div>
  );
}
