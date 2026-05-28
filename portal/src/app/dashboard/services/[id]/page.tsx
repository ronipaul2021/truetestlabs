"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useDashboard } from '@/context/DashboardContext';

// ── Inline Icons ──────────────────────────────────────────────────────────────
const Ico = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const BackIcon    = () => <Ico d="m15 18-6-6 6-6" />;
const SaveIcon    = () => <Ico d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8" />;
const TrashIcon   = () => <Ico d="M3 6h18 M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6 M10 11v6 M14 11v6 M9 6V4h6v2" />;
const TagIcon     = () => <Ico d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01" />;
const PriceIcon   = () => <Ico d="M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />;
const ClockIcon   = () => <Ico d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2" />;
const DropIcon    = () => <Ico d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />;
const HomeIcon    = () => <Ico d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />;
const StarIcon    = () => <Ico d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />;
const CalIcon     = () => <Ico d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M16 2v4 M8 2v4 M3 10h18" />;
const XIcon       = () => <Ico d="M18 6L6 18M6 6l12 12" size={13} />;

const CATEGORY_MAP: Record<string, string[]> = {
  "Lab Tests":            ["Pathology", "Biochemistry", "Hematology", "Microbiology", "Serology & Immunology", "Histopathology", "Cytology"],
  "Organ Based":          ["Cardiology (Heart)", "Endocrinology (Hormones)", "Gastroenterology (Digestive System)", "Nephrology (Kidney)", "Neurology (Brain & Nerves)", "Pulmonology (Lungs)", "Orthopedics (Bones & Joints)", "Urology (Urinary System)"],
  "Imaging & Radiology":  ["X-ray", "Ultrasound (USG)", "CT Scan", "MRI", "Mammography"],
};

// ── Input Primitives ──────────────────────────────────────────────────────────
const fieldBase = "w-full bg-[#0D1829] border border-white/[0.08] rounded-2xl px-4 py-3.5 text-[13px] font-medium text-white placeholder:text-white/25 focus:outline-none focus:border-[#6366F1]/50 focus:ring-2 focus:ring-[#6366F1]/10 transition-all";
const labelBase = "text-[9px] font-black text-white/40 uppercase tracking-[0.2em]";

const SectionCard = ({ title, subtitle, accentColor, children }: { title: string; subtitle?: string; accentColor: string; children: React.ReactNode }) => (
  <div className="bg-[#162035]/80 backdrop-blur-md border border-white/[0.07] rounded-[24px] p-6 sm:p-8 relative overflow-hidden">
    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${accentColor} opacity-60`} />
    <div className="mb-6">
      <h2 className="text-[11px] font-black text-white/70 uppercase tracking-[0.25em]">{title}</h2>
      {subtitle && <p className="text-[10px] text-white/30 mt-0.5">{subtitle}</p>}
    </div>
    {children}
  </div>
);

export default function EditServicePage() {
  const router    = useRouter();
  const params    = useParams();
  const serviceId = params.id as string;
  const { currentCenter } = useDashboard();

  const [categoriesMap, setCategoriesMap] = useState(CATEGORY_MAP);
  const [isCustomMain, setIsCustomMain]   = useState(false);
  const [isCustomSub,  setIsCustomSub]    = useState(false);
  const [loading, setLoading]             = useState(true);
  const [saving,  setSaving]              = useState(false);
  const [saved,   setSaved]              = useState(false);
  const [paramInput,   setParamInput]   = useState('');
  const [symptomInput, setSymptomInput] = useState('');

  const [formData, setFormData] = useState({
    name: '', code: '', mainCategory: 'Lab Tests', subCategory: 'Pathology',
    basePrice: '', costPrice: '', discountPercent: '0', homeVisitFee: '50',
    tat: 'Standard TAT: 4 hours', specimen: 'Blood',
    preparation: '12-hour fasting required', preTestInstructions: '',
    description: '', homeCollection: false, geofence: '5 km radius',
    homeCollectionHours: '6 AM - 8 PM, Mon-Fri', collectionTime: 'Morning',
    status: 'Active', parameterCount: '', parameters: [] as string[],
    symptoms: [] as string[],
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    timeSlots: { morning: { max: '50' }, afternoon: { max: '30' }, evening: { max: '10' } }
  });

  useEffect(() => {
    (async () => {
      const API_URL = typeof window !== "undefined" ? `http://${window.location.hostname}:3000` : "http://localhost:3000";
      try {
        const res = await fetch(`${API_URL}/services/${serviceId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const d = await res.json();
        setFormData({
          name: d.name || '', code: d.code || '',
          mainCategory: d.category || 'Lab Tests', subCategory: d.subCategory || 'Pathology',
          basePrice: d.price?.toString() || '', costPrice: d.costPrice?.toString() || '',
          discountPercent: d.discountPercent?.toString() || '0',
          homeVisitFee: d.homeVisitFee?.toString() || '50',
          tat: d.tat || 'Standard TAT: 4 hours', specimen: d.specimen || 'Blood',
          preparation: d.preparation || '12-hour fasting required',
          preTestInstructions: d.preTestInstructions || '',
          description: d.description || '', homeCollection: d.homeCollection || false,
          geofence: d.geofence || '5 km radius',
          homeCollectionHours: d.homeCollectionHours || '6 AM - 8 PM, Mon-Fri',
          collectionTime: d.collectionTime || 'Morning', status: d.status || 'Active',
          parameterCount: d.parameterCount?.toString() || '0',
          parameters: d.parameters || [], symptoms: d.symptoms || [],
          availableDays: d.availableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          timeSlots: (d.timeSlots && Object.keys(d.timeSlots).length > 0) ? d.timeSlots : { morning: { max: '50' }, afternoon: { max: '30' }, evening: { max: '10' } }
        });
      } catch (err) {
        console.error(err);
        alert("Could not load service details.");
      } finally { setLoading(false); }
    })();
  }, [serviceId]);

  const finalPrice = useMemo(() => {
    const base = parseFloat(formData.basePrice) || 0;
    const disc = parseFloat(formData.discountPercent) || 0;
    return base * (1 - (disc / 100));
  }, [formData.basePrice, formData.discountPercent]);

  const profitMargin = useMemo(() => {
    const cost = parseFloat(formData.costPrice) || 0;
    if (finalPrice <= 0 || cost <= 0) return 0;
    return Math.round(((finalPrice - cost) / finalPrice) * 100);
  }, [finalPrice, formData.costPrice]);

  const handleMainCategoryChange = (cat: string) => {
    setFormData({ ...formData, mainCategory: cat, subCategory: categoriesMap[cat]?.[0] || '' });
  };

  const handleAddTag = (field: 'parameters' | 'symptoms', value: string) => {
    if (!value.trim()) return;
    setFormData(prev => ({ ...prev, [field]: [...prev[field], value.trim()] }));
    field === 'parameters' ? setParamInput('') : setSymptomInput('');
  };

  const handleRemoveTag = (field: 'parameters' | 'symptoms', index: number) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const API_URL = typeof window !== "undefined" ? `http://${window.location.hostname}:3000` : "http://localhost:3000";
    try {
      const res = await fetch(`${API_URL}/services/${serviceId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, offerPrice: finalPrice })
      });
      if (res.ok) { setSaved(true); setTimeout(() => router.push('/dashboard/services'), 900); }
      else alert("Failed to update service");
    } catch { alert("Error saving service"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${formData.name}"? This cannot be undone.`)) return;
    setSaving(true);
    const API_URL = typeof window !== "undefined" ? `http://${window.location.hostname}:3000` : "http://localhost:3000";
    try {
      const res = await fetch(`${API_URL}/services/${serviceId}`, { method: 'DELETE' });
      if (res.ok) router.push('/dashboard/services');
      else alert("Failed to delete service");
    } catch { alert("Error deleting service"); }
    finally { setSaving(false); }
  };

  const set = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }));

  if (loading) return (
    <div className="flex-1 flex items-center justify-center min-h-screen flex-col gap-4">
      <div className="w-10 h-10 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
      <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest">Loading service…</p>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden page-transition">

      {/* ── Sticky Header ───────────────────────────────────────────────────── */}
      <div className="shrink-0 px-4 sm:px-6 pt-5 pb-3 z-20">
        <div className="bg-[#162035]/90 backdrop-blur-md border border-white/[0.07] rounded-[20px] px-5 py-3.5 flex items-center justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6366F1]/30 to-transparent" />

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard/services')}
              className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.10] transition-all"
            >
              <BackIcon />
            </button>
            <div>
              <h1 className="text-[15px] font-black text-white tracking-tight">Edit Service</h1>
              <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-0.5 truncate max-w-[220px]">
                {formData.name || `Service #${serviceId}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-bold text-[#F43F5E] bg-[#F43F5E]/[0.08] border border-[#F43F5E]/20 hover:bg-[#F43F5E]/15 transition-all disabled:opacity-50"
            >
              <TrashIcon /> <span className="hidden sm:inline">Delete</span>
            </button>
            <button
              onClick={() => router.push('/dashboard/services')}
              className="px-4 py-2 rounded-xl text-[10px] font-bold text-white/50 bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.08] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-bold transition-all disabled:opacity-60 relative overflow-hidden group ${
                saved
                  ? 'bg-[#10B981] text-white'
                  : 'bg-gradient-to-r from-[#6366F1] to-[#10B981] text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_28px_rgba(99,102,241,0.5)]'
              }`}
            >
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <SaveIcon />
              <span>{saved ? '✓ Saved!' : saving ? 'Saving…' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Scroll Area ─────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 sm:px-6 pb-16 space-y-4 scrollbar-none">

        {/* ── 01. Core Identity ──────────────────────────────────────────────── */}
        <SectionCard title="01 · Core Identity" subtitle="Service name, code, category and status" accentColor="from-[#6366F1] to-[#818CF8]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="sm:col-span-2 space-y-2">
              <label className={labelBase}>Service Name <span className="text-[#F43F5E]">*</span></label>
              <input
                required type="text" placeholder="e.g. Full Body Executive Checkup"
                className={fieldBase} value={formData.name}
                onChange={e => set('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className={labelBase}>Service Code <span className="text-white/20">(auto)</span></label>
              <input readOnly className={`${fieldBase} opacity-40 cursor-not-allowed`} value={formData.code} />
            </div>
            <div className="space-y-2">
              <label className={labelBase}>Status</label>
              <select className={fieldBase} value={formData.status} onChange={e => set('status', e.target.value)}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Main Category */}
            <div className="space-y-2">
              <label className={labelBase}>Main Category</label>
              {isCustomMain ? (
                <div className="relative">
                  <input
                    type="text" placeholder="Custom Category" className={fieldBase} required
                    value={formData.mainCategory} onChange={e => set('mainCategory', e.target.value)}
                  />
                  <button type="button" onClick={() => { setIsCustomMain(false); setIsCustomSub(false); handleMainCategoryChange('Lab Tests'); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-white/40 hover:text-[#F43F5E] transition-colors"><XIcon /></button>
                </div>
              ) : (
                <select className={fieldBase} value={formData.mainCategory}
                  onChange={e => {
                    if (e.target.value === 'ADD_NEW') { setIsCustomMain(true); setIsCustomSub(true); set('mainCategory', ''); set('subCategory', ''); }
                    else handleMainCategoryChange(e.target.value);
                  }}>
                  {Object.keys(categoriesMap).map(c => <option key={c} value={c}>{c}</option>)}
                  <option value="ADD_NEW">＋ Add Custom Category…</option>
                </select>
              )}
            </div>

            {/* Sub Category */}
            <div className="space-y-2">
              <label className={labelBase}>Sub Category</label>
              {isCustomSub ? (
                <div className="relative">
                  <input
                    type="text" placeholder="Custom Sub Category" className={fieldBase} required
                    value={formData.subCategory} onChange={e => set('subCategory', e.target.value)}
                  />
                  <button type="button" onClick={() => { setIsCustomSub(false); set('subCategory', categoriesMap[formData.mainCategory]?.[0] || ''); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-white/40 hover:text-[#F43F5E] transition-colors"><XIcon /></button>
                </div>
              ) : (
                <select className={fieldBase} value={formData.subCategory}
                  onChange={e => { if (e.target.value === 'ADD_NEW') setIsCustomSub(true); else set('subCategory', e.target.value); }}>
                  {(categoriesMap[formData.mainCategory] || []).map(s => <option key={s} value={s}>{s}</option>)}
                  <option value="ADD_NEW">＋ Add Custom Sub-Category…</option>
                </select>
              )}
            </div>
          </div>
        </SectionCard>

        {/* ── 02. Pricing & Margins ───────────────────────────────────────────── */}
        <SectionCard title="02 · Pricing & Margins" subtitle="Base price, cost, discount and auto-calculated margin" accentColor="from-[#10B981] to-[#34D399]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-5">
            <div className="space-y-2">
              <label className={labelBase}>Base Price (₹) <span className="text-[#F43F5E]">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#10B981] font-bold text-[13px]">₹</span>
                <input required type="number" placeholder="220" className={`${fieldBase} pl-8`} value={formData.basePrice} onChange={e => set('basePrice', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className={labelBase}>Cost per Test (₹) <span className="text-[#F43F5E]">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F43F5E] font-bold text-[13px]">₹</span>
                <input required type="number" placeholder="85" className={`${fieldBase} pl-8`} value={formData.costPrice} onChange={e => set('costPrice', e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className={labelBase}>Discount %</label>
              <div className="relative">
                <input type="number" placeholder="0" min="0" max="100" className={`${fieldBase} pr-8`} value={formData.discountPercent} onChange={e => set('discountPercent', e.target.value)} />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F59E0B] font-bold text-[13px]">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className={labelBase}>Profit Margin</label>
              <div className={`${fieldBase} flex items-center justify-between`}>
                <span className={`text-[15px] font-black ${profitMargin >= 55 ? 'text-[#10B981]' : profitMargin >= 40 ? 'text-[#F59E0B]' : 'text-[#F43F5E]'}`}>
                  {profitMargin}%
                </span>
                <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${profitMargin >= 55 ? 'bg-[#10B981]' : profitMargin >= 40 ? 'bg-[#F59E0B]' : 'bg-[#F43F5E]'}`}
                    style={{ width: `${Math.min(profitMargin, 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gradient-to-r from-[#10B981]/[0.08] to-[#6366F1]/[0.06] border border-[#10B981]/20 rounded-[18px] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Final Patient Price (Auto-Calculated)</p>
              <p className="text-2xl font-black text-[#10B981]">₹{finalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            </div>
            {formData.homeCollection && (
              <div className="text-right">
                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Total incl. Home Visit</p>
                <p className="text-xl font-black text-[#06B6D4]">₹{(finalPrice + parseFloat(formData.homeVisitFee || '0')).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              </div>
            )}
          </div>
        </SectionCard>

        {/* ── 03. Operational Details ─────────────────────────────────────────── */}
        <SectionCard title="03 · Operational Details" subtitle="Turnaround time, preparation and instructions" accentColor="from-[#6366F1] to-[#06B6D4]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div className="space-y-2">
              <label className={labelBase}>Turnaround Time <span className="text-[#F43F5E]">*</span></label>
              <select className={fieldBase} value={formData.tat} onChange={e => set('tat', e.target.value)}>
                <option value="Standard TAT: 4 hours">Standard TAT: 4 hours</option>
                <option value="Express TAT: 2 hours">Express TAT: 2 hours (Premium)</option>
                <option value="Overnight TAT: Next morning">Overnight: Next morning</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelBase}>Patient Preparation <span className="text-[#F43F5E]">*</span></label>
              <select className={fieldBase} value={formData.preparation} onChange={e => set('preparation', e.target.value)}>
                <option value="12-hour fasting required">12-hour fasting required</option>
                <option value="8-hour fasting required">8-hour fasting required</option>
                <option value="No fasting required">No fasting required</option>
                <option value="Full bladder required">Full bladder required</option>
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className={labelBase}>Pre-Test Instructions</label>
              <input type="text" placeholder="e.g. Do not consume alcohol 24 hours prior…"
                className={fieldBase} value={formData.preTestInstructions} onChange={e => set('preTestInstructions', e.target.value)} />
            </div>
          </div>

          {/* Home Collection Toggle */}
          <div className={`rounded-[20px] border p-5 transition-all duration-500 ${formData.homeCollection ? 'bg-[#7C3AED]/[0.08] border-[#7C3AED]/25' : 'bg-white/[0.02] border-white/[0.06]'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center transition-all ${formData.homeCollection ? 'bg-[#7C3AED]/20 text-[#A78BFA]' : 'bg-white/[0.05] text-white/30'}`}>
                  <HomeIcon />
                </div>
                <div>
                  <p className={`text-[14px] font-bold ${formData.homeCollection ? 'text-[#C4B5FD]' : 'text-white/60'}`}>Home Collection Available</p>
                  <p className={`text-[10px] font-medium ${formData.homeCollection ? 'text-[#7C3AED]' : 'text-white/30'}`}>Enable phlebotomist dispatch to patient location</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => set('homeCollection', !formData.homeCollection)}
                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${formData.homeCollection ? 'bg-[#7C3AED]' : 'bg-white/10'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-sm ${formData.homeCollection ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>

            {formData.homeCollection && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-[#7C3AED]/15">
                <div className="space-y-2">
                  <label className={labelBase}>Geofence Radius</label>
                  <input type="text" placeholder="e.g. 5 km radius" className={fieldBase} value={formData.geofence} onChange={e => set('geofence', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className={labelBase}>Collection Hours</label>
                  <input type="text" placeholder="6 AM - 8 PM, Mon-Fri" className={fieldBase} value={formData.homeCollectionHours} onChange={e => set('homeCollectionHours', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className={labelBase}>Visit Fee (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A78BFA] font-bold">₹</span>
                    <input type="number" placeholder="50" className={`${fieldBase} pl-8`} value={formData.homeVisitFee} onChange={e => set('homeVisitFee', e.target.value)} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </SectionCard>

        {/* ── 04. Clinical Specifications ─────────────────────────────────────── */}
        <SectionCard title="04 · Clinical Specifications" subtitle="Specimen, parameters, description and relevant symptoms" accentColor="from-[#06B6D4] to-[#38BDF8]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div className="space-y-2">
              <label className={labelBase}>Specimen Matrix <span className="text-[#F43F5E]">*</span></label>
              <input required type="text" placeholder="e.g. Blood (Plasma), Urine" className={fieldBase} value={formData.specimen} onChange={e => set('specimen', e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelBase}>Parameter Count <span className="text-[#F43F5E]">*</span></label>
              <input required type="number" min="0" placeholder="0" className={fieldBase}
                value={formData.parameterCount}
                onChange={e => setFormData(prev => ({ ...prev, parameterCount: e.target.value, parameters: [] }))}
              />
            </div>
          </div>

          {/* Parameter Tags */}
          <div className="space-y-2 mb-5">
            <label className={labelBase}>
              Mapped Parameters ({formData.parameters.length} / {formData.parameterCount || '0'})
            </label>
            <div className={`flex flex-wrap gap-2 p-3.5 border rounded-2xl min-h-[56px] transition-all ${
              formData.parameterCount && formData.parameters.length === parseInt(formData.parameterCount)
                ? 'bg-[#06B6D4]/[0.06] border-[#06B6D4]/25' : 'bg-[#0D1829] border-white/[0.08]'
            }`}>
              {formData.parameters.map((tag, i) => (
                <span key={i} className="bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/25 px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-2">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag('parameters', i)} className="hover:text-[#F43F5E] transition-colors"><XIcon /></button>
                </span>
              ))}
              <input
                type="text"
                disabled={!formData.parameterCount || formData.parameters.length >= parseInt(formData.parameterCount)}
                placeholder={!formData.parameterCount ? "Set count first" : formData.parameters.length >= parseInt(formData.parameterCount) ? "Limit reached" : "Type & press Enter…"}
                className="bg-transparent border-none focus:ring-0 text-[12px] font-medium flex-1 min-w-[140px] text-white/60 placeholder:text-white/20 outline-none disabled:opacity-30"
                value={paramInput} onChange={e => setParamInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag('parameters', paramInput); } }}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 mb-5">
            <label className={labelBase}>Scientific Description <span className="text-[#F43F5E]">*</span></label>
            <textarea required rows={3} placeholder="Brief clinical significance and methodology details…"
              className={`${fieldBase} resize-none`} value={formData.description} onChange={e => set('description', e.target.value)} />
          </div>

          {/* Symptom Tags */}
          <div className="space-y-2">
            <label className={labelBase}>Relevant Symptoms / Indicators</label>
            <div className="flex flex-wrap gap-2 p-3.5 bg-[#0D1829] border border-white/[0.08] rounded-2xl min-h-[56px]">
              {formData.symptoms.map((tag, i) => (
                <span key={i} className="bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/25 px-3 py-1 rounded-xl text-[11px] font-bold flex items-center gap-2">
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag('symptoms', i)} className="hover:text-[#F43F5E] transition-colors"><XIcon /></button>
                </span>
              ))}
              <input type="text" placeholder="Type a symptom & press Enter…"
                className="bg-transparent border-none focus:ring-0 text-[12px] font-medium flex-1 min-w-[140px] text-white/60 placeholder:text-white/20 outline-none"
                value={symptomInput} onChange={e => setSymptomInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag('symptoms', symptomInput); } }}
              />
            </div>
          </div>
        </SectionCard>

        {/* ── 05. Availability ────────────────────────────────────────────────── */}
        <SectionCard title="05 · Availability" subtitle="Operating days and daily slot capacity" accentColor="from-[#F59E0B] to-[#FCD34D]">
          <div className="space-y-2 mb-6">
            <label className={labelBase}>Available Days</label>
            <div className="flex flex-wrap gap-2">
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => {
                const isOn = formData.availableDays.includes(day);
                return (
                  <button
                    key={day} type="button"
                    onClick={() => {
                      const newDays = isOn ? formData.availableDays.filter(d => d !== day) : [...formData.availableDays, day];
                      set('availableDays', newDays);
                    }}
                    className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                      isOn ? 'bg-[#F59E0B]/20 border border-[#F59E0B]/40 text-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.15)]' : 'bg-white/[0.04] border border-white/[0.07] text-white/40 hover:text-white/70 hover:bg-white/[0.07]'
                    }`}
                  >
                    {isOn && <span className="mr-1.5">✓</span>}{day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelBase}>Daily Slot Capacity</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {([
                { key: 'morning',   label: 'Morning',   time: '6 AM – 12 PM',  color: 'text-[#F59E0B]', border: 'border-[#F59E0B]/20', bg: 'bg-[#F59E0B]/[0.06]' },
                { key: 'afternoon', label: 'Afternoon', time: '12 PM – 5 PM',  color: 'text-[#06B6D4]', border: 'border-[#06B6D4]/20', bg: 'bg-[#06B6D4]/[0.06]' },
                { key: 'evening',   label: 'Evening',   time: '5 PM – 8 PM',   color: 'text-[#A78BFA]', border: 'border-[#A78BFA]/20', bg: 'bg-[#A78BFA]/[0.06]' },
              ] as const).map(({ key, label, time, color, border, bg }) => (
                <div key={key} className={`${bg} border ${border} rounded-[18px] p-4`}>
                  <p className={`text-[9px] font-black uppercase tracking-widest ${color} mb-0.5`}>{label}</p>
                  <p className="text-[8px] text-white/30 mb-3">{time}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-white/30">0 /</span>
                    <input
                      type="number"
                      className="w-16 bg-[#0D1829] border border-white/[0.08] rounded-xl px-3 py-2 text-[13px] font-black text-white text-center focus:outline-none focus:border-[#6366F1]/40 transition-all"
                      value={(formData.timeSlots as any)[key].max}
                      onChange={e => setFormData(prev => ({
                        ...prev,
                        timeSlots: { ...prev.timeSlots, [key]: { ...prev.timeSlots[key as keyof typeof prev.timeSlots], max: e.target.value } }
                      }))}
                    />
                    <span className="text-[9px] text-white/30">slots</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>



      </form>
    </div>
  );
}
