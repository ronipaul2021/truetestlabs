"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { BarcodeGenerator } from '../components/BarcodeGenerator';

// ─── Inline Icons ──────────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, sw = 1.8 }: { d: string; size?: number; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const BackIco      = () => <Ico d="m15 18-6-6 6-6" />;
const PrintIco     = () => <Ico d="M6 9V2h12v7 M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2 M6 14h12v8H6z" />;
const UserIco      = () => <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />;
const FlaskIco     = () => <Ico d="M10 2v7.5M14 2v7.5M8.5 2h7M12 12c-3.5 0-6 2.5-6 6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3c0-3.5-2.5-6-6-6z" />;
const AlertIco     = () => <Ico d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01" />;
const CheckIco     = () => <Ico d="M20 6L9 17l-5-5" />;
const BarcodeIco   = () => <Ico d="M3 5v14 M7 5v14 M11 5v14 M15 5v14 M19 5v14" />;
const EditIco      = () => <Ico d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />;
const ClockIco     = () => <Ico d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2" />;
const PhoneIco     = () => <Ico d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.1 3.37a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />;
const ShieldIco    = () => <Ico d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const ActivityIco  = () => <Ico d="M22 12h-4l-3 9L9 3l-3 9H2" />;

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  Processing: { bg:'bg-[#6366F1]/10', text:'text-[#6366F1]', border:'border-[#6366F1]/25', dot:'bg-[#6366F1]' },
  Pending:    { bg:'bg-[#F43F5E]/10', text:'text-[#F43F5E]', border:'border-[#F43F5E]/25', dot:'bg-[#F43F5E]' },
  Collecting: { bg:'bg-[#F59E0B]/10', text:'text-[#F59E0B]', border:'border-[#F59E0B]/25', dot:'bg-[#F59E0B]' },
  Completed:  { bg:'bg-[#10B981]/10', text:'text-[#10B981]', border:'border-[#10B981]/25', dot:'bg-[#10B981]' },
};

// ─── Card ──────────────────────────────────────────────────────────────────────
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#162035]/85 backdrop-blur-md border border-white/[0.07] rounded-[22px] shadow-xl relative overflow-hidden ${className}`}>
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    {children}
  </div>
);

// ─── Info Field ────────────────────────────────────────────────────────────────
const InfoField = ({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) => (
  <div>
    <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">{label}</p>
    <p className={`text-[13px] font-semibold ${accent ? 'text-[#6EE7B7]' : 'text-white/80'}`}>{value}</p>
  </div>
);

// ─── Timeline Step ─────────────────────────────────────────────────────────────
const TimelineStep = ({ step, label, time, done, active }: { step: number; label: string; time: string; done: boolean; active: boolean }) => (
  <div className="flex items-start gap-3 group">
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 transition-all ${
      done   ? 'bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981]' :
      active ? 'bg-[#6366F1]/20 border border-[#6366F1]/30 text-[#6366F1] shadow-[0_0_12px_rgba(99,102,241,0.2)]' :
               'bg-white/[0.04] border border-white/[0.07] text-white/25'
    }`}>
      {done ? <CheckIco /> : step}
    </div>
    <div className="flex-1 pb-5">
      <p className={`text-[12px] font-semibold ${done?'text-white/60':active?'text-white':'text-white/30'}`}>{label}</p>
      <p className={`text-[9px] mt-0.5 ${done?'text-[#10B981]':active?'text-[#6366F1]':'text-white/20'} font-bold uppercase tracking-widest`}>{time}</p>
    </div>
  </div>
);

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const [showBarcode, setShowBarcode] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const order = {
    id:                 resolvedParams.id,
    patientName:        'Sarah Jenkins',
    patientPhone:       '+91 98765 43210',
    patientEmail:       'sarah.jenkins@email.com',
    tests:              ['Blood Test (CBC)', 'Lipid Profile', 'Thyroid Profile', 'HbA1c'],
    status:             'Processing',
    totalAmount:        870,
    createdAt:          new Date().toISOString(),
    priority:           'Routine',
    paymentStatus:      'Settled',
    assignedStaff:      'Dr. Rahul Sharma',
    expectedCompletion: new Date(Date.now() + 86400000).toISOString(),
    prescriber:         'Dr. Jane Smith',
    flags:              ['Fasting 12hr', 'VIP Patient'],
    gender:             'Female',
    age:                42,
    bloodGroup:         'O+',
    address:            'D-204, Sunrise Apartments, Mumbai, MH 400001',
    department:         'Core Lab',
    collectionType:     'Home Collection',
    collectionTime:     '2026-05-27 10:30 AM',
    reportEstimation:   '2026-05-28 02:00 PM',
    notes:              'Patient is diabetic. Ensure fasting compliance before collection.',
  };

  const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG['Processing'];

  const testStatus = ['Logged', 'Logged', 'Processing', 'Pending'];
  const testColors = ['text-[#10B981]', 'text-[#10B981]', 'text-[#6366F1]', 'text-[#F59E0B]'];
  const testBg     = ['bg-[#10B981]/10 border-[#10B981]/20', 'bg-[#10B981]/10 border-[#10B981]/20', 'bg-[#6366F1]/10 border-[#6366F1]/20', 'bg-[#F59E0B]/10 border-[#F59E0B]/20'];

  const stepsConfig = [
    { label:'Order Registered',       time: new Date(order.createdAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})+' – Registered', done:true, active:false },
    { label:'Sample Collection',      time:'10:30 AM – Completed',  done:true, active:false },
    { label:'Lab Processing',         time:'Ongoing – ~4h remaining', done:false, active:true  },
    { label:'Quality Control Review', time:'Awaiting Lab',           done:false, active:false },
    { label:'Report Generation',      time:'Est. '+new Date(order.expectedCompletion).toLocaleString('en-IN',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'short'}), done:false, active:false },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-full page-transition">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] bg-[#162035] border border-white/[0.12] shadow-2xl rounded-2xl px-5 py-3 text-[12px] font-bold text-white flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />{toast}
        </div>
      )}

      {/* ── Header ────────────────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-6 pb-3 print:hidden">
        <Card className="p-5">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6366F1]/30 to-transparent" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/orders"
                className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.10] transition-all shrink-0">
                <BackIco />
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-[17px] font-black text-white">Order Detail</h1>
                  <span className="text-[11px] font-bold text-white/30">·</span>
                  <span className="text-[13px] font-bold text-white/50">{order.id}</span>
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${sc.bg} ${sc.text} ${sc.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} animate-pulse`} />
                    {order.status}
                  </span>
                </div>
                <p className="text-[9px] font-medium text-white/30 uppercase tracking-[0.15em] mt-0.5">Comprehensive Diagnostic Record</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setShowBarcode(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#A5B4FC] hover:bg-[#6366F1]/20 transition-all">
                <BarcodeIco /> Barcode
              </button>
              <button onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold bg-[#10B981]/10 border border-[#10B981]/20 text-[#6EE7B7] hover:bg-[#10B981]/20 transition-all">
                <PrintIco /> Print Record
              </button>
              <button onClick={() => showToast('✓ Status updated to Completed')}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-[11px] font-bold bg-gradient-to-r from-[#6366F1] to-[#10B981] text-white hover:opacity-90 transition-all relative overflow-hidden group shadow-[0_0_14px_rgba(99,102,241,0.25)]">
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <EditIco /> Update Status
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div className="flex-1 px-4 sm:px-6 pb-12 overflow-y-auto scrollbar-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* ── Left / Main (8 cols) ────────────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-4">

            {/* Patient Info */}
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-xl bg-[#6366F1]/15 border border-[#6366F1]/25 flex items-center justify-center text-[#6366F1]"><UserIco /></div>
                <div>
                  <h3 className="text-[13px] font-black text-white">Patient Demographics</h3>
                  <p className="text-[8px] font-bold text-white/25 uppercase tracking-widest mt-0.5">Personal & Contact Information</p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-5 p-4 bg-[#0D1829]/60 rounded-xl border border-white/[0.05]">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#818CF8] flex items-center justify-center text-white text-[18px] font-black shrink-0">
                  {order.patientName.split(' ').map(n=>n[0]).slice(0,2).join('')}
                </div>
                <div>
                  <p className="text-[17px] font-black text-white">{order.patientName}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-white/40">{order.age} Yrs · {order.gender}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full ${
                      order.priority === 'Urgent' ? 'bg-[#F43F5E]/10 border border-[#F43F5E]/25 text-[#F43F5E]' : 'bg-white/[0.05] border border-white/[0.08] text-white/30'
                    } uppercase`}>{order.priority}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <InfoField label="Blood Group"       value={order.bloodGroup} accent />
                <InfoField label="Phone"             value={order.patientPhone} />
                <InfoField label="Email"             value={order.patientEmail} />
                <InfoField label="Referring Doctor"  value={order.prescriber} />
                <InfoField label="Collection Type"   value={order.collectionType} />
                <InfoField label="Collection Time"   value={order.collectionTime} />
                <div className="col-span-2 sm:col-span-3">
                  <InfoField label="Address"         value={order.address} />
                </div>
                {order.notes && (
                  <div className="col-span-2 sm:col-span-3 p-3.5 bg-[#F59E0B]/[0.06] border border-[#F59E0B]/15 rounded-xl">
                    <p className="text-[8px] font-black text-[#F59E0B] uppercase tracking-widest mb-1.5">Clinical Notes</p>
                    <p className="text-[11px] text-white/60">{order.notes}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Prescribed Tests */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#10B981]/15 border border-[#10B981]/25 flex items-center justify-center text-[#10B981]"><FlaskIco /></div>
                  <div>
                    <h3 className="text-[13px] font-black text-white">Prescribed Investigations</h3>
                    <p className="text-[8px] font-bold text-white/25 uppercase tracking-widest mt-0.5">{order.tests.length} tests ordered</p>
                  </div>
                </div>
                <button onClick={() => showToast('✓ Results submitted')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[9px] font-bold bg-[#10B981]/10 border border-[#10B981]/20 text-[#6EE7B7] hover:bg-[#10B981]/20 transition-all">
                  <CheckIco /> Submit Results
                </button>
              </div>
              <div className="overflow-x-auto scrollbar-none">
                <table className="w-full text-left min-w-[480px]">
                  <thead className="border-b border-white/[0.06]">
                    <tr>
                      {['#','Test Name','Department','TAT','Status'].map(h => (
                        <th key={h} className="px-4 py-3 text-[8px] font-black text-white/25 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {order.tests.map((test, idx) => (
                      <tr key={idx} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3.5 text-[10px] font-bold text-white/25">{idx+1}</td>
                        <td className="px-4 py-3.5">
                          <p className="text-[12px] font-semibold text-white/80">{test}</p>
                        </td>
                        <td className="px-4 py-3.5 text-[10px] text-white/35">Pathology</td>
                        <td className="px-4 py-3.5 text-[10px] text-white/35">
                          {[4,6,8,24][idx] || 8}h
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border ${testBg[idx] || testBg[0]} ${testColors[idx] || testColors[0]}`}>
                            {testStatus[idx] || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Billing */}
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/25 flex items-center justify-center text-[#F59E0B]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <div>
                  <h3 className="text-[13px] font-black text-white">Billing & Payment</h3>
                  <p className="text-[8px] font-bold text-white/25 uppercase tracking-widest mt-0.5">Invoice breakdown</p>
                </div>
              </div>
              <div className="space-y-2.5 mb-4">
                {order.tests.map((t, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/[0.04]">
                    <div>
                      <p className="text-[12px] font-medium text-white/70">{t}</p>
                      <p className="text-[8px] text-white/25 uppercase tracking-widest mt-0.5">Test #{String(i+1).padStart(3,'0')}</p>
                    </div>
                    <p className="text-[12px] font-bold text-white">₹{[350,220,180,120][i] || 200}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between p-4 bg-[#10B981]/[0.06] border border-[#10B981]/15 rounded-xl">
                <div>
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-0.5">Total Amount</p>
                  <p className="text-[22px] font-black text-white">₹{order.totalAmount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl border ${
                    order.paymentStatus === 'Settled'
                      ? 'bg-[#10B981]/15 border-[#10B981]/25 text-[#10B981]'
                      : 'bg-[#F59E0B]/15 border-[#F59E0B]/25 text-[#F59E0B]'
                  } uppercase tracking-widest`}>{order.paymentStatus}</span>
                  <p className="text-[8px] text-white/25 mt-1.5">Via UPI / Cash</p>
                </div>
              </div>
            </Card>
          </div>

          {/* ── Right Sidebar (4 cols) ──────────────────────────────────────── */}
          <div className="lg:col-span-4 space-y-4">

            {/* Order Status Timeline */}
            <Card className="p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-xl bg-[#6366F1]/15 border border-[#6366F1]/25 flex items-center justify-center text-[#6366F1]"><ActivityIco /></div>
                <div>
                  <h3 className="text-[13px] font-black text-white">Order Progress</h3>
                  <p className="text-[8px] font-bold text-white/25 uppercase tracking-widest mt-0.5">Live pipeline tracking</p>
                </div>
              </div>
              <div className="relative border-l-2 border-white/[0.07] ml-4">
                {stepsConfig.map((s, i) => (
                  <TimelineStep key={i} step={i+1} label={s.label} time={s.time} done={s.done} active={s.active} />
                ))}
              </div>
            </Card>

            {/* Key Info */}
            <Card className="p-5">
              <h3 className="text-[13px] font-black text-white mb-4">Order Summary</h3>
              <div className="space-y-3">
                {[
                  { l:'Assigned Staff',     v:order.assignedStaff,   c:'text-[#A5B4FC]' },
                  { l:'Expected Report',    v:new Date(order.expectedCompletion).toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}), c:'text-[#6EE7B7]' },
                  { l:'Department',         v:order.department,       c:'text-white/70' },
                  { l:'Order Placed',       v:new Date(order.createdAt).toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}), c:'text-white/50' },
                ].map((f, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-white/[0.04] pb-3">
                    <p className="text-[9px] font-black text-white/25 uppercase tracking-widest">{f.l}</p>
                    <p className={`text-[11px] font-bold ${f.c}`}>{f.v}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Clinical Flags */}
            {order.flags.length > 0 && (
              <Card className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-[#F43F5E]/15 border border-[#F43F5E]/25 flex items-center justify-center text-[#F43F5E]"><AlertIco /></div>
                  <h3 className="text-[13px] font-black text-white">Clinical Flags</h3>
                </div>
                <div className="space-y-2">
                  {order.flags.map((flag, i) => (
                    <div key={i} className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#F43F5E]/[0.07] border border-[#F43F5E]/15">
                      <span className="w-2 h-2 rounded-full bg-[#F43F5E] animate-pulse shrink-0" />
                      <p className="text-[11px] font-bold text-[#FB7185]">{flag}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Barcode Preview */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-black text-white">Specimen Tag</h3>
                <button onClick={() => setShowBarcode(true)} className="text-[9px] font-bold text-[#6366F1] hover:text-[#A5B4FC] transition-colors">View Full</button>
              </div>
              <div className="scale-90 origin-top">
                <BarcodeGenerator id={order.id} name={order.patientName} />
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-5">
              <h3 className="text-[13px] font-black text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { l:'Mark as Completed',     fn:() => showToast('✓ Marked as completed'),   c:'bg-[#10B981]/10 border-[#10B981]/20 text-[#6EE7B7] hover:bg-[#10B981]/20' },
                  { l:'Send SMS to Patient',   fn:() => showToast('✓ SMS dispatched'),         c:'bg-[#6366F1]/10 border-[#6366F1]/20 text-[#A5B4FC] hover:bg-[#6366F1]/20' },
                  { l:'Assign to Another Lab', fn:() => showToast('✓ Reassignment initiated'), c:'bg-white/[0.04] border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.08]' },
                  { l:'Flag for QC Review',    fn:() => showToast('✓ Flagged for QC'),         c:'bg-[#F59E0B]/10 border-[#F59E0B]/20 text-[#FCD34D] hover:bg-[#F59E0B]/20' },
                ].map((a, i) => (
                  <button key={i} onClick={a.fn}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-bold border transition-all ${a.c}`}>
                    {a.l}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">
            TrueTest Labs · Central Diagnostics Logistics Hub · Authorized Personnel Only
          </p>
        </div>
      </div>

      {/* Barcode Modal */}
      {showBarcode && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBarcode(false)} />
          <div className="relative z-10">
            <BarcodeGenerator order={{ id: order.id, patientName: order.patientName } as any} />
          </div>
        </div>
      )}
    </div>
  );
}
