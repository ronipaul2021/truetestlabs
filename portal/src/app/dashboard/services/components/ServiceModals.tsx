"use client";

import React, { useState, useMemo } from 'react';
import { LogisticsSymbol } from '../../components/Symbols';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingServices: any[];
  onSuccess: (newService: any) => void;
  centerId?: number;
}

const CATEGORY_MAP: Record<string, string[]> = {
  "Lab Tests": ["Pathology", "Biochemistry", "Hematology", "Microbiology", "Serology & Immunology", "Histopathology", "Cytology"],
  "Organ Based": ["Cardiology (Heart)", "Endocrinology (Hormones)", "Gastroenterology (Digestive System)", "Nephrology (Kidney)", "Neurology (Brain & Nerves)", "Pulmonology (Lungs)", "Orthopedics (Bones & Joints)", "Urology (Urinary System)"],
  "Imaging & Radiology": ["X-ray", "Ultrasound (USG)", "CT Scan", "MRI", "Mammography"]
};

export function AddServiceModal({ isOpen, onClose, existingServices, onSuccess, centerId }: AddServiceModalProps) {
  const [categoriesMap, setCategoriesMap] = useState(CATEGORY_MAP);
  const [isCustomMain, setIsCustomMain] = useState(false);
  const [isCustomSub, setIsCustomSub] = useState(false);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    mainCategory: 'Lab Tests',
    subCategory: 'Pathology',
    basePrice: '',
    costPrice: '',
    discountPercent: '0',
    homeVisitFee: '50',
    tat: 'Standard TAT: 4 hours',
    specimen: 'Blood',
    preparation: '12-hour fasting required',
    preTestInstructions: '',
    description: '',
    homeCollection: false,
    geofence: '5 km radius',
    homeCollectionHours: '6 AM - 8 PM, Mon-Fri',
    collectionTime: 'Morning',
    parameterCount: '',
    parameters: [] as string[],
    symptoms: [] as string[],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    timeSlots: {
      morning: { max: '50' },
      afternoon: { max: '30' },
      evening: { max: '10' }
    }
  });

  // 1. Logic for Duplicate Check
  const isDuplicate = useMemo(() => {
    if (!formData.name.trim()) return false;
    return existingServices.some(s => s.name.toLowerCase() === formData.name.toLowerCase().trim());
  }, [formData.name, existingServices]);

  // 2. Logic for Auto-Generation of Service Code
  React.useEffect(() => {
    if (!formData.name.trim()) {
      setFormData(prev => ({ ...prev, code: '' }));
      return;
    }

    const sub = formData.subCategory.replace(/[^A-Za-z]/g, '');
    const prefix = sub.substring(0, 3).toUpperCase() || 'SVC';
    const lettersOnly = formData.name.replace(/[^A-Za-z]/g, '');
    const initials = lettersOnly.toUpperCase().substring(0, 2) || 'XX';
    const random = Math.floor(100 + Math.random() * 899);
    setFormData(prev => ({ ...prev, code: `${prefix}-${initials}-${random}` }));
  }, [formData.name, formData.subCategory]);

  const finalPrice = useMemo(() => {
    const base = parseFloat(formData.basePrice) || 0;
    const disc = parseFloat(formData.discountPercent) || 0;
    return Math.max(0, base - (base * disc / 100));
  }, [formData.basePrice, formData.discountPercent]);

  const profitMargin = useMemo(() => {
    const base = parseFloat(formData.basePrice) || 0;
    const cost = parseFloat(formData.costPrice) || 0;
    if (base <= 0) return 0;
    return Math.max(0, Math.round(((base - cost) / base) * 100));
  }, [formData.basePrice, formData.costPrice]);

  const [paramInput, setParamInput] = useState('');
  const [symptomInput, setSymptomInput] = useState('');

  if (!isOpen) return null;

  const handleMainCategoryChange = (val: string) => {
    const firstSub = categoriesMap[val]?.[0] || '';
    setFormData({ ...formData, mainCategory: val, subCategory: firstSub });
  };

  const handleAddTag = (type: 'parameters' | 'symptoms', value: string) => {
    if (!value.trim()) return;
    if (type === 'parameters' && formData.parameterCount) {
      if (formData.parameters.length >= parseInt(formData.parameterCount)) return;
    }
    if (formData[type].includes(value.trim())) return;
    setFormData({ ...formData, [type]: [...formData[type], value.trim()] });
    if (type === 'parameters') setParamInput('');
    else setSymptomInput('');
  };

  const handleRemoveTag = (type: 'parameters' | 'symptoms', index: number) => {
    const newList = [...formData[type]];
    newList.splice(index, 1);
    setFormData({ ...formData, [type]: newList });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Default to center 1 if not provided (for local dev)
    const cid = centerId || 1;
    const API_URL = typeof window !== "undefined"
      ? `http://${window.location.hostname}:3000`
      : "http://localhost:3000";

    try {
      const res = await fetch(`${API_URL}/centers/${cid}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          offerPrice: finalPrice
        })
      });
      
      if (res.ok) {
        const dbService = await res.json();
        // Transform backend structure slightly for frontend table if needed,
        // or just pass it up since frontend now expects the db structure
        onSuccess({
          ...dbService,
          // Merge in local state fields for immediate UI display if needed
          acceptanceRate: Math.floor(Math.random() * 50) + 10,
          equipment: 'Standard Equipment',
          passRate: parseFloat((98.0 + Math.random() * 1.9).toFixed(2)),
          demandTrend: Math.floor(Math.random() * 20) - 10,
          revenue: (dbService.price || 0) * (dbService.demand || 0),
          revenueTrend: Math.floor(Math.random() * 20) - 10,
          margin: dbService.profitMargin || 0,
        });
        onClose();
      } else {
        alert("Failed to add service");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div
        className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-[6px] transition-opacity duration-500 animate-in fade-in"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-[40px] w-full max-w-5xl max-h-[90vh] overflow-hidden border border-slate-200 animate-in zoom-in-95 slide-in-from-bottom-8 duration-600 ease-out flex flex-col">
        {/* Header Section */}
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-medium text-white tracking-tight leading-none">
                New <span className="bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">Service Node</span>
              </h2>
              <p className="text-[10px] font-medium text-slate-400 mt-2.5 uppercase tracking-[0.25em]">Clinical Spec Configuration & Inventory Sync</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all group"
          >
            <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 px-10 py-8 overflow-y-auto custom-scrollbar space-y-12 bg-white">
          {/* Section 1: Identity */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-px bg-slate-100 flex-1"></div>
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">01. Core Identity</h3>
              <div className="h-px bg-slate-100 flex-1"></div>
            </div>

            {isDuplicate && (
              <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-300">
                <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-black text-rose-600 uppercase tracking-widest">Duplicate Conflict Detected</p>
                  <p className="text-[10px] text-rose-400/80 font-black mt-0.5 tracking-wide">This service name already exists in your diagnostic catalog.</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-3">
                <label className="text-[13px] font-medium text-white ml-1">Service Name <span className="text-red-500">*</span></label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Full Body Executive Checkup"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium text-white placeholder:text-white/50 focus:outline-none focus:border-cyan-500/50 focus:bg-white transition-all"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <label className="text-[13px] font-medium text-white ml-1">Service Code (Auto)</label>
                <input
                  readOnly
                  type="text"
                  placeholder="GEN-CODE"
                  className="w-full bg-slate-100 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium text-slate-500 cursor-not-allowed tracking-widest"
                  value={formData.code}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[13px] font-medium text-white ml-1">Main Category</label>
                {isCustomMain ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Custom Main Category"
                      className="flex-1 bg-white border border-cyan-300 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-cyan-500 shadow-sm"
                      value={formData.mainCategory}
                      onChange={e => setFormData({ ...formData, mainCategory: e.target.value })}
                    />
                    <button type="button" onClick={() => { setIsCustomMain(false); setIsCustomSub(false); handleMainCategoryChange('Lab Tests'); }} className="px-4 bg-slate-100 rounded-2xl text-slate-500 hover:bg-slate-200 hover:text-rose-500 transition-colors">✕</button>
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white transition-all appearance-none cursor-pointer"
                      value={formData.mainCategory}
                      onChange={e => {
                        if (e.target.value === 'ADD_NEW') {
                          setIsCustomMain(true);
                          setFormData({ ...formData, mainCategory: '', subCategory: '' });
                          setIsCustomSub(true);
                        } else {
                          handleMainCategoryChange(e.target.value);
                        }
                      }}
                    >
                      {Object.keys(categoriesMap).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      <option value="ADD_NEW" className="font-bold text-cyan-600 bg-cyan-50">➕ Add Custom Category...</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-[13px] font-medium text-white ml-1">Sub-Category</label>
                {isCustomSub || isCustomMain ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Custom Sub-Category"
                      className="flex-1 bg-white border border-cyan-300 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-cyan-500 shadow-sm"
                      value={formData.subCategory}
                      onChange={e => setFormData({ ...formData, subCategory: e.target.value })}
                    />
                    {!isCustomMain && (
                      <button type="button" onClick={() => { setIsCustomSub(false); setFormData({ ...formData, subCategory: categoriesMap[formData.mainCategory]?.[0] || '' }); }} className="px-4 bg-slate-100 rounded-2xl text-slate-500 hover:bg-slate-200 hover:text-rose-500 transition-colors">✕</button>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white transition-all appearance-none cursor-pointer"
                      value={formData.subCategory}
                      onChange={e => {
                        if (e.target.value === 'ADD_NEW') setIsCustomSub(true);
                        else setFormData({ ...formData, subCategory: e.target.value });
                      }}
                    >
                      {(categoriesMap[formData.mainCategory] || []).map(sub => <option key={sub} value={sub}>{sub}</option>)}
                      <option value="ADD_NEW" className="font-bold text-cyan-600 bg-cyan-50">➕ Add Custom Sub-Category...</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </section>

          {/* Section 2: Pricing & Margins */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-px bg-slate-100 flex-1"></div>
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">02. Pricing & Margins</h3>
              <div className="h-px bg-slate-100 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <label className="text-[13px] font-medium text-white ml-1">Base Price (₹) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-600 font-medium">₹</span>
                  <input required type="number" placeholder="220" className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium text-emerald-600 focus:outline-none focus:border-emerald-500 transition-all" value={formData.basePrice} onChange={e => setFormData({ ...formData, basePrice: e.target.value })} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[13px] font-medium text-white ml-1">Cost per Test (₹) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-rose-600 font-medium">₹</span>
                  <input required type="number" placeholder="85" className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium text-rose-600 focus:outline-none focus:border-rose-500 transition-all" value={formData.costPrice} onChange={e => setFormData({ ...formData, costPrice: e.target.value })} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[13px] font-medium text-white ml-1">Profit Margin</label>
                <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-black text-white flex items-center justify-between">
                  <span>{profitMargin}%</span>
                  <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[13px] font-medium text-white ml-1">Discount %</label>
                <div className="relative">
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-amber-600 font-medium">%</span>
                  <input type="number" placeholder="0" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium text-amber-600 focus:outline-none focus:border-amber-500 transition-all" value={formData.discountPercent} onChange={e => setFormData({ ...formData, discountPercent: e.target.value })} />
                </div>
              </div>
              <div className="space-y-3 lg:col-span-4 bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">Final Patient Price (Auto-calculated)</span>
                <span className="text-lg font-black text-emerald-700">₹{finalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </section>

          {/* Section 3: Operational Details */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-px bg-slate-100 flex-1"></div>
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">03. Operational Details</h3>
              <div className="h-px bg-slate-100 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[13px] font-medium text-white ml-1">Turnaround Time <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white transition-all appearance-none cursor-pointer"
                    value={formData.tat}
                    onChange={e => setFormData({ ...formData, tat: e.target.value })}
                  >
                    <option value="Standard TAT: 4 hours">Standard TAT: 4 hours (Base Price)</option>
                    <option value="Express TAT: 2 hours">Express TAT: 2 hours (Premium)</option>
                    <option value="Overnight TAT: Next morning">Overnight TAT: Next morning (Discounted)</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[13px] font-medium text-white ml-1">Patient Preparation <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium text-white focus:outline-none focus:border-cyan-500/50 focus:bg-white transition-all appearance-none cursor-pointer"
                    value={formData.preparation}
                    onChange={e => setFormData({ ...formData, preparation: e.target.value })}
                  >
                    <option value="12-hour fasting required">12-hour fasting required</option>
                    <option value="8-hour fasting required">8-hour fasting required</option>
                    <option value="No fasting required">No fasting required</option>
                    <option value="Full bladder required">Full bladder required</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 md:col-span-2">
                <label className="text-[13px] font-medium text-white ml-1">Pre-test Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Do not consume alcohol 24 hours prior..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium text-white placeholder:text-white/50 focus:outline-none focus:border-cyan-500/50 focus:bg-white transition-all"
                  value={formData.preTestInstructions}
                  onChange={e => setFormData({ ...formData, preTestInstructions: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col gap-6 bg-slate-50 border border-slate-200 p-8 rounded-[32px] transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${formData.homeCollection ? 'bg-purple-600 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}>
                    <div className="w-5 h-5"><LogisticsSymbol color={formData.homeCollection ? "white" : "currentColor"} /></div>
                  </div>
                  <div>
                    <p className="text-[15px] font-medium text-white tracking-tight">Home Collection Available</p>
                    <p className="text-[11px] text-slate-500 font-medium mt-1 tracking-wide leading-relaxed">Enable phlebotomist dispatch</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, homeCollection: !formData.homeCollection })}
                  className={`w-16 h-8 rounded-full transition-all duration-200 relative ${formData.homeCollection ? 'bg-purple-600' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-200 ease-out ${formData.homeCollection ? 'left-9' : 'left-1'}`}></div>
                </button>
              </div>

              {formData.homeCollection && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200 animate-in fade-in slide-in-from-top-4">
                  <div className="space-y-3">
                    <label className="text-[13px] font-medium text-white ml-1">Geofence</label>
                    <input type="text" placeholder="e.g. 5 km radius" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium text-white focus:outline-none focus:border-purple-500 transition-all" value={formData.geofence} onChange={e => setFormData({ ...formData, geofence: e.target.value })} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[13px] font-medium text-white ml-1">Hours</label>
                    <input type="text" placeholder="e.g. 6 AM - 8 PM, Mon-Fri" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium text-white focus:outline-none focus:border-purple-500 transition-all" value={formData.homeCollectionHours} onChange={e => setFormData({ ...formData, homeCollectionHours: e.target.value })} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[13px] font-medium text-white ml-1">Additional Fee (₹)</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-600 font-medium">₹</span>
                      <input type="number" placeholder="50" className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium text-purple-600 focus:outline-none focus:border-purple-500 transition-all" value={formData.homeVisitFee} onChange={e => setFormData({ ...formData, homeVisitFee: e.target.value })} />
                    </div>
                    <p className="text-[9px] text-slate-400 font-medium ml-2">* if location under 5km no delivery charge</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Section 4: Clinical Specifications */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-px bg-slate-100 flex-1"></div>
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">04. Clinical Specifications</h3>
              <div className="h-px bg-slate-100 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[13px] font-medium text-white ml-1">Specimen Matrix <span className="text-red-500">*</span></label>
                <input required type="text" placeholder="e.g. Blood (Plasma), Urine" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium text-white placeholder:text-white/50 focus:outline-none focus:border-cyan-500/50 focus:bg-white transition-all" value={formData.specimen} onChange={e => setFormData({ ...formData, specimen: e.target.value })} />
              </div>
              <div className="space-y-3">
                <label className="text-[13px] font-medium text-white ml-1">Parameter Count <span className="text-red-500">*</span></label>
                <input required type="number" min="0" placeholder="0" className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium text-cyan-600 focus:outline-none focus:border-cyan-500 transition-all" value={formData.parameterCount} onChange={e => setFormData({ ...formData, parameterCount: e.target.value, parameters: [] })} />
              </div>

              <div className="space-y-3 md:col-span-2">
                <label className="text-[13px] font-medium text-white ml-1">Mapped Parameters ({formData.parameters.length} / {formData.parameterCount || '0'})</label>
                <div className={`flex flex-wrap gap-2.5 p-3.5 border rounded-2xl min-h-[64px] transition-all duration-400 ${formData.parameterCount && formData.parameters.length === parseInt(formData.parameterCount) ? 'bg-cyan-50 border-cyan-200' : 'bg-slate-50 border-slate-200'}`}>
                  {formData.parameters.map((tag, i) => (
                    <span key={i} className="bg-white text-cyan-700 border border-cyan-100 px-3.5 py-1.5 rounded-xl text-[10px] font-medium flex items-center gap-2.5 transition-all group animate-in zoom-in-90">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag('parameters', i)} className="text-cyan-300 hover:text-rose-500 transition-colors">×</button>
                    </span>
                  ))}
                  <input type="text" disabled={!formData.parameterCount || formData.parameters.length >= parseInt(formData.parameterCount)} placeholder={!formData.parameterCount ? "Set count first" : formData.parameters.length >= parseInt(formData.parameterCount) ? "Limit reached" : "Enter node..."} className="bg-transparent border-none focus:ring-0 text-[11px] font-medium flex-1 min-w-[140px] text-white placeholder:text-white/50 disabled:opacity-40 disabled:cursor-not-allowed" value={paramInput} onChange={e => setParamInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag('parameters', paramInput); } }} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[13px] font-medium text-white ml-1">Scientific Description <span className="text-red-500">*</span></label>
              <textarea required rows={3} placeholder="Brief clinical significance and methodology details..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium text-white placeholder:text-white/50 focus:outline-none focus:border-cyan-500/50 focus:bg-white transition-all resize-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>

            <div className="space-y-3">
              <label className="text-[13px] font-medium text-white ml-1">Relevant Symptoms / Indicators</label>
              <div className="flex flex-wrap gap-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl min-h-[64px]">
                {formData.symptoms.map((tag, i) => (
                  <span key={i} className="bg-white text-blue-700 border border-blue-100 px-3.5 py-1.5 rounded-xl text-[10px] font-medium flex items-center gap-2.5 transition-all group animate-in zoom-in-90">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag('symptoms', i)} className="text-blue-300 hover:text-rose-500 transition-colors">×</button>
                  </span>
                ))}
                <input type="text" placeholder="Enter keywords..." className="bg-transparent border-none focus:ring-0 text-[11px] font-medium flex-1 min-w-[140px] text-white placeholder:text-white/50" value={symptomInput} onChange={e => setSymptomInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag('symptoms', symptomInput); } }} />
              </div>
            </div>
          </section>

          {/* Section 10: Availability */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-px bg-slate-100 flex-1"></div>
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">10. Availability</h3>
              <div className="h-px bg-slate-100 flex-1"></div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[13px] font-medium text-white ml-1">Available Days</label>
                <div className="flex flex-wrap gap-3">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
                    const isSelected = formData.availableDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          const newDays = isSelected ? formData.availableDays.filter(d => d !== day) : [...formData.availableDays, day];
                          setFormData({ ...formData, availableDays: newDays });
                        }}
                        className={`px-6 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${isSelected ? 'bg-[#023e8a] text-white shadow-md' : 'bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100'}`}
                      >
                        {isSelected && <span className="mr-2">✓</span>}{day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[13px] font-medium text-white ml-1">Time Slots (Daily Capacity)</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 border border-slate-200 p-6 rounded-[32px]">
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Morning (6 AM - 12 PM)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-400">0 /</span>
                      <input type="number" className="w-20 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-blue-500" value={formData.timeSlots.morning.max} onChange={e => setFormData({ ...formData, timeSlots: { ...formData.timeSlots, morning: { ...formData.timeSlots.morning, max: e.target.value } } })} />
                      <span className="text-[10px] text-slate-400">slots</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Afternoon (12 PM - 5 PM)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-400">0 /</span>
                      <input type="number" className="w-20 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-blue-500" value={formData.timeSlots.afternoon.max} onChange={e => setFormData({ ...formData, timeSlots: { ...formData.timeSlots, afternoon: { ...formData.timeSlots.afternoon, max: e.target.value } } })} />
                      <span className="text-[10px] text-slate-400">slots</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Evening (5 PM - 8 PM)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-400">0 /</span>
                      <input type="number" className="w-20 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-blue-500" value={formData.timeSlots.evening.max} onChange={e => setFormData({ ...formData, timeSlots: { ...formData.timeSlots, evening: { ...formData.timeSlots.evening, max: e.target.value } } })} />
                      <span className="text-[10px] text-slate-400">slots</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </form>

        {/* Action Bar */}
        <div className="px-10 py-8 border-t border-slate-100 bg-slate-50/50 flex gap-6 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-10 py-5 rounded-[24px] text-xs font-black uppercase tracking-[0.25em] text-slate-500 bg-white border border-slate-200 hover:bg-slate-100 hover:text-white transition-all active:scale-95"
          >
            Discard
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              loading ||
              isDuplicate ||
              !formData.name ||
              !formData.tat ||
              !formData.specimen ||
              !formData.preparation ||
              !formData.description ||
              !formData.basePrice ||
              !formData.costPrice ||
              formData.parameterCount === '' ||
              (formData.parameterCount !== '0' && formData.parameters.length !== parseInt(formData.parameterCount))
            }
            className="flex-1 py-5 rounded-[24px] text-xs font-black uppercase tracking-[0.25em] text-white bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 transition-all disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-4 relative overflow-hidden group active:scale-[0.98]"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span className="relative">Processing Engine...</span>
              </>
            ) : (
              <>
                <span className="relative">Deploy Service</span>
                <svg className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ViewServiceModal({ service, onClose, onEdit }: { service: any | null, onClose: () => void, onEdit?: () => void }) {
  if (!service) return null;

  const isActive = service.status === 'Active';
  const marginColor = service.margin >= 55 ? 'text-[#10B981]' : service.margin >= 40 ? 'text-[#F59E0B]' : 'text-[#F43F5E]';
  const marginBg = service.margin >= 55 ? 'bg-[#10B981]' : service.margin >= 40 ? 'bg-[#F59E0B]' : 'bg-[#F43F5E]';
  const passColor = service.passRate >= 95 ? 'text-[#10B981]' : service.passRate >= 90 ? 'text-[#F59E0B]' : 'text-[#F43F5E]';

  const CATEGORY_GRAD: Record<string, string> = {
    'Lab Tests': 'from-[#6366F1] to-[#818CF8]',
    'Organ Based': 'from-[#10B981] to-[#34D399]',
    'Imaging & Radiology': 'from-[#06B6D4] to-[#38BDF8]',
  };
  const grad = CATEGORY_GRAD[service.category] ?? 'from-[#8B5CF6] to-[#A78BFA]';

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#050D1A]/85 backdrop-blur-[8px] animate-in fade-in duration-300" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-[#0F1629] border border-white/[0.07] rounded-[32px] w-full max-w-[660px] max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">

        {/* Rainbow top bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#6366F1] via-[#06B6D4] to-[#10B981] rounded-t-[32px]" />

        {/* ── HEADER ──────────────────────────────────────────────────── */}
        <div className="px-8 pt-8 pb-6 shrink-0">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-white text-[14px] font-black shrink-0 shadow-lg`}>
              {service.name?.substring(0, 2).toUpperCase() || 'SV'}
            </div>

            {/* Title block */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-[22px] font-black text-white leading-none tracking-tight truncate">{service.name}</h2>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                  isActive
                    ? 'bg-[#10B981]/10 border-[#10B981]/25 text-[#10B981]'
                    : 'bg-[#F43F5E]/10 border-[#F43F5E]/25 text-[#F43F5E]'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#10B981] shadow-[0_0_5px_#10B981]' : 'bg-[#F43F5E]'} ${isActive ? 'animate-pulse' : ''}`} />
                  {service.status || 'Active'}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-[10px] font-bold text-white/30 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/[0.06] uppercase tracking-widest">{service.code}</span>
                <span className="text-white/15">•</span>
                <span className="text-[11px] font-semibold text-white/40">{service.category}</span>
                {service.homeCollection && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/20 rounded-full uppercase tracking-widest">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    Home
                  </span>
                )}
                {(service.margin < 25 || service.passRate < 90) && (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 rounded-full uppercase tracking-widest">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    At-Risk
                  </span>
                )}
              </div>
            </div>

            {/* Close */}
            <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.08] transition-all shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent mx-8" />

        {/* ── SCROLLABLE BODY ─────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-6 space-y-6">

          {/* ── SECTION HELPER ── */}
          {/* Section: Pricing */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-6 rounded-lg bg-[#10B981]/15 border border-[#10B981]/20 flex items-center justify-center text-[#10B981]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <span className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.2em]">Pricing & Revenue</span>
              <div className="flex-1 h-px bg-white/[0.05]" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Patient Price', value: `₹${service.price?.toLocaleString() || '0'}`, color: 'text-[#10B981]' },
                { label: 'Offer Price', value: service.offerPrice ? `₹${Number(service.offerPrice).toLocaleString()}` : '—', color: 'text-[#F59E0B]' },
                { label: 'Est. Revenue / mo', value: `₹${service.revenue?.toLocaleString() || '0'}`, color: 'text-[#6366F1]' },
                { label: 'Revenue Trend', value: service.revenueTrend >= 0 ? `↑ ${service.revenueTrend}%` : `↓ ${Math.abs(service.revenueTrend)}%`, color: service.revenueTrend >= 0 ? 'text-[#10B981]' : 'text-[#F43F5E]' },
              ].map((f, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3">
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1.5">{f.label}</p>
                  <p className={`text-[15px] font-black ${f.color} leading-none`}>{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Performance */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-6 rounded-lg bg-[#6366F1]/15 border border-[#6366F1]/20 flex items-center justify-center text-[#6366F1]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <span className="text-[10px] font-black text-[#6366F1] uppercase tracking-[0.2em]">Performance & Demand</span>
              <div className="flex-1 h-px bg-white/[0.05]" />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Margin bar */}
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.18em]">Profit Margin</p>
                  <span className={`text-[15px] font-black ${service.margin >= 55 ? 'text-[#10B981]' : service.margin >= 40 ? 'text-[#F59E0B]' : 'text-[#F43F5E]'}`}>{service.margin || 0}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${service.margin >= 55 ? 'bg-[#10B981]' : service.margin >= 40 ? 'bg-[#F59E0B]' : 'bg-[#F43F5E]'}`} style={{ width: `${Math.min(service.margin || 0, 100)}%` }} />
                </div>
                <p className="text-[8px] text-white/20 mt-1.5">{service.margin >= 55 ? 'Excellent' : service.margin >= 40 ? 'Good' : service.margin >= 25 ? 'Fair' : 'Needs Attention'}</p>
              </div>
              {/* Pass Rate bar */}
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.18em]">Pass Rate</p>
                  <span className={`text-[15px] font-black ${service.passRate >= 95 ? 'text-[#10B981]' : service.passRate >= 90 ? 'text-[#F59E0B]' : 'text-[#F43F5E]'}`}>{Number(service.passRate || 0).toFixed(1)}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${service.passRate >= 95 ? 'bg-[#10B981]' : service.passRate >= 90 ? 'bg-[#F59E0B]' : 'bg-[#F43F5E]'}`} style={{ width: `${Math.min(service.passRate || 0, 100)}%` }} />
                </div>
                <p className="text-[8px] text-white/20 mt-1.5">{service.passRate >= 95 ? 'Excellent' : service.passRate >= 90 ? 'Good' : service.passRate >= 85 ? 'Fair' : 'Needs Attention'}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Demand / mo', value: `${service.demand || 0}`, sub: service.demandTrend >= 0 ? `↑ ${service.demandTrend}% growth` : `↓ ${Math.abs(service.demandTrend)}% decline`, subColor: service.demandTrend >= 0 ? 'text-[#10B981]' : 'text-[#F43F5E]' },
                { label: 'Acceptance Rate', value: `${service.acceptanceRate || 0}%`, sub: service.acceptanceRate > 30 ? 'Winning' : service.acceptanceRate > 20 ? 'Competitive' : 'Struggling', subColor: service.acceptanceRate > 30 ? 'text-[#10B981]' : service.acceptanceRate > 20 ? 'text-[#F59E0B]' : 'text-[#F43F5E]' },
                { label: 'Equipment', value: service.equipment || 'N/A', sub: '', subColor: '' },
              ].map((f, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3">
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">{f.label}</p>
                  <p className="text-[13px] font-bold text-white/90 leading-snug">{f.value}</p>
                  {f.sub && <p className={`text-[9px] font-bold mt-0.5 ${f.subColor}`}>{f.sub}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Section: Clinical */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-6 rounded-lg bg-[#8B5CF6]/15 border border-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.5M14 2v7.5M8.5 2h7M12 12c-3.5 0-6 2.5-6 6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3c0-3.5-2.5-6-6-6z"/></svg>
              </div>
              <span className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-[0.2em]">Clinical Details</span>
              <div className="flex-1 h-px bg-white/[0.05]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl px-5 py-4">
                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2">Turnaround Time</p>
                <p className="text-[13px] font-semibold text-white/90">{service.tat || 'N/A'}</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl px-5 py-4">
                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2">Specimen Matrix</p>
                <p className="text-[13px] font-semibold text-white/90">{service.specimen || 'N/A'}</p>
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl px-5 py-4 col-span-2">
                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2">Patient Preparation</p>
                <p className="text-[13px] font-semibold text-white/90">{service.preparation || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Section: Logistics */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-6 rounded-lg bg-[#06B6D4]/15 border border-[#06B6D4]/20 flex items-center justify-center text-[#06B6D4]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <span className="text-[10px] font-black text-[#06B6D4] uppercase tracking-[0.2em]">Logistics & Collection</span>
              <div className="flex-1 h-px bg-white/[0.05]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl px-5 py-4 flex items-center justify-between col-span-2">
                <div>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Home Collection</p>
                  <p className="text-[13px] font-semibold text-white/90">
                    {service.homeCollection ? `Available · ₹${service.homeVisitFee || 0} visit fee` : 'Centre visit required'}
                  </p>
                </div>
                {service.homeCollection ? (
                  <span className="px-3 py-1.5 bg-[#06B6D4]/10 border border-[#06B6D4]/20 text-[#06B6D4] text-[9px] font-black rounded-xl uppercase tracking-widest">Enabled</span>
                ) : (
                  <span className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.07] text-white/25 text-[9px] font-black rounded-xl uppercase tracking-widest">Disabled</span>
                )}
              </div>
              <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl px-5 py-4">
                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2">Collection Time</p>
                <p className="text-[13px] font-semibold text-white/90">{service.collectionTime || 'Any'}</p>
              </div>
              {service.homeCollection && (
                <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl px-5 py-4">
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2">Visit Fee</p>
                  <p className="text-[13px] font-semibold text-[#06B6D4]">₹{service.homeVisitFee || 0}</p>
                </div>
              )}
            </div>
          </div>

          {/* Section: Identity */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-6 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/40">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </div>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Service Identity</span>
              <div className="flex-1 h-px bg-white/[0.05]" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Service ID', value: `#${service.id}` },
                { label: 'Service Code', value: service.code || 'N/A' },
                { label: 'Category', value: service.category || 'N/A' },
              ].map((f, i) => (
                <div key={i} className="bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3">
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">{f.label}</p>
                  <p className="text-[12px] font-bold text-white/80 font-mono">{f.value}</p>
                </div>
              ))}
            </div>
          </div>

        </div>


        {/* ── FOOTER ──────────────────────────────────────────────────── */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent mx-8" />
        <div className="px-8 py-5 shrink-0 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07] text-[11px] font-bold text-white/50 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            Close
          </button>
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white text-[11px] font-bold hover:opacity-90 transition-all shadow-[0_0_20px_rgba(99,102,241,0.25)] flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit Service
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

