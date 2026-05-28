"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// ─── Inline SVG icons ──────────────────────────────────────────────────────────
const Ico = ({ d, size = 18, sw = 1.6 }: { d: string; size?: number; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const EyeIco     = () => <Ico d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0" />;
const EyeOffIco  = () => <Ico d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24 M1 1l22 22" />;
const UserIco    = () => <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />;
const LockIco    = () => <Ico d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4" />;
const MailIco    = () => <Ico d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22,6 12,13 2,6" />;
const PhoneIco   = () => <Ico d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.1 3.37a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />;
const MapPinIco  = () => <Ico d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0" />;
const LinkIco    = () => <Ico d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />;
const BuildingIco= () => <Ico d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />;
const ShieldIco  = () => <Ico d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const CheckIco   = () => <Ico d="M20 6L9 17l-5-5" />;
const AlertIco   = () => <Ico d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01" />;
const UploadIco  = () => <Ico d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12" />;
const BadgeIco   = () => <Ico d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z M9 12l2 2 4-4" />;
const PulseIco   = () => <Ico d="M22 12h-4l-3 9L9 3l-3 9H2" />;
const XCircleIco = () => <Ico d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M15 9l-6 6M9 9l6 6" />;
const ChevronRIco= () => <Ico d="m9 18 6-6-6-6" />;
const IdIco      = () => <Ico d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2a3 3 0 0 1 0 6z M13 7h2 M13 12h2 M13 17h2 M9 7a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1v-10H9z" />;
const FileIco    = () => <Ico d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />;
const BarChartIco= () => <Ico d="M18 20V10M12 20V4M6 20v-6" />;
const ZapIco     = () => <Ico d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />;
const FlaskIco   = () => <Ico d="M10 2v7.5M14 2v7.5M8.5 2h7M12 12c-3.5 0-6 2.5-6 6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3c0-3.5-2.5-6-6-6z" />;


// ─── Input Field ──────────────────────────────────────────────────────────────
const InputField = ({
  label, required, icon, type = "text", placeholder, value, onChange, children, hint
}: {
  label: string; required?: boolean; icon: React.ReactNode; type?: string;
  placeholder: string; value: string; onChange: (v: string) => void;
  children?: React.ReactNode; hint?: string;
}) => (
  <div className="space-y-1.5 group">
    <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-1">
      {label}{required && <span className="text-[#F43F5E]">*</span>}
    </label>
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#6366F1] transition-colors pointer-events-none">
        {icon}
      </div>
      <input
        type={type} placeholder={placeholder} required={required}
        value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-[#0D1829] border border-white/[0.09] rounded-xl pl-10 pr-4 py-3 text-[13px] font-medium text-white placeholder:text-white/20 focus:outline-none focus:border-[#6366F1]/60 focus:ring-2 focus:ring-[#6366F1]/10 transition-all"
      />
      {children}
    </div>
    {hint && <p className="text-[8px] text-white/25 pl-1">{hint}</p>}
  </div>
);

// ─── Password strength ────────────────────────────────────────────────────────
function getStrength(p: string): { score: number; label: string; color: string } {
  if (!p) return { score: 0, label: '', color: '' };
  let s = 0;
  if (p.length >= 8)   s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  const map = ['','Weak','Fair','Strong','Very Strong'];
  const col = ['','#F43F5E','#F59E0B','#6366F1','#10B981'];
  return { score: s, label: map[s], color: col[s] };
}

// ─── File Upload Zone ─────────────────────────────────────────────────────────
const UploadZone = ({ label, required, file, preview, onFile }: {
  label: string; required?: boolean; file: File | null; preview: string | null;
  onFile: (f: File | null, p: string | null) => void;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-1">
        {label}{required && <span className="text-[#F43F5E]">*</span>}
      </label>
      <div
        onClick={() => ref.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all group ${
          file ? 'border-[#10B981]/40 bg-[#10B981]/[0.04]' : 'border-white/[0.08] hover:border-[#6366F1]/40 hover:bg-[#6366F1]/[0.03]'
        }`}
      >
        <input
          ref={ref} type="file" accept="image/*,.pdf" required={required} className="hidden"
          onChange={e => {
            const f = e.target.files?.[0] || null;
            const p = f && f.type.startsWith('image/') ? URL.createObjectURL(f) : null;
            onFile(f, p);
          }}
        />
        {file ? (
          <div className="flex items-center gap-3">
            {preview ? (
              <img src={preview} alt="preview" className="w-12 h-12 rounded-lg object-cover border border-[#10B981]/20" />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981]"><FileIco /></div>
            )}
            <div>
              <p className="text-[12px] font-bold text-[#10B981]">{file.name}</p>
              <p className="text-[9px] text-white/30 mt-0.5">{(file.size / 1024).toFixed(1)} KB · Click to replace</p>
            </div>
            <div className="ml-auto"><span className="w-6 h-6 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[#10B981]"><CheckIco /></span></div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 gap-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/30 group-hover:text-[#6366F1] group-hover:border-[#6366F1]/20 transition-all"><UploadIco /></div>
            <p className="text-[11px] font-bold text-white/50">Click to upload</p>
            <p className="text-[9px] text-white/25">PDF, PNG, JPG · Max 5MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────
export default function AuthPage() {
  const router = useRouter();
  const API_URL = typeof window !== "undefined"
    ? `http://${window.location.hostname}:3000`
    : "http://localhost:3000";

  const [view,    setView]    = useState<"login" | "register">("login");
  const [regStep, setRegStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2,setShowPwd2]= useState(false);
  const [rememberMe,setRememberMe] = useState(false);
  const [confPwd, setConfPwd] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem("ttl_center");
    if (saved) router.push("/dashboard");
  }, [router]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Login state ──────────────────────────────────────────────────────────
  const [loginData, setLoginData] = useState({ id: "", password: "" });
  const lSet = (k: 'id'|'password') => (v: string) => setLoginData(p => ({ ...p, [k]: v }));

  // ── Register state ───────────────────────────────────────────────────────
  const [regData, setRegData] = useState({
    name: "", ownerName: "", address: "", phoneNumber: "", email: "",
    googleMapUrl: "", password: "", isoNumber: "", nablNumber: "",
    gstNumber: "", tradeLicense: "", providesEmergency: false,
  });
  const rSet = (k: keyof typeof regData) => (v: string) => setRegData(p => ({ ...p, [k]: v }));

  const [files,    setFiles]    = useState<{ iso: File | null; nabl: File | null }>({ iso: null, nabl: null });
  const [previews, setPreviews] = useState<{ iso: string | null; nabl: string | null }>({ iso: null, nabl: null });

  const strength = getStrength(regData.password);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/centers/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generatedId: loginData.id, password: loginData.password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("ttl_center", JSON.stringify(data.center));
        if (rememberMe) localStorage.setItem("ttl_remember", loginData.id);
        showToast("✓ Signed in successfully");
        setTimeout(() => router.push("/dashboard"), 800);
      } else {
        showToast(data.error || "Access denied — check your credentials", "error");
      }
    } catch {
      showToast("Connection error — server may be offline", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regStep < 3) { setRegStep(s => s + 1); return; }
    if (regData.password !== confPwd) { showToast("Passwords do not match", "error"); return; }
    setLoading(true);
    const fd = new FormData();
    Object.entries(regData).forEach(([k, v]) => fd.append(k, String(v)));
    if (files.iso)  fd.append("isoCertificate",  files.iso);
    if (files.nabl) fd.append("nablCertificate", files.nabl);
    try {
      const res  = await fetch(`${API_URL}/centers/register`, { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        showToast(`✓ Registration complete! Your Center ID: ${data.generatedId}`);
        setTimeout(() => { setView("login"); setRegStep(1); }, 2000);
      } else {
        showToast(data.error || "Registration failed", "error");
      }
    } catch {
      showToast("Connection error — server may be offline", "error");
    } finally {
      setLoading(false);
    }
  };

  const switchToReg = () => { setView("register"); setRegStep(1); };
  const switchToLog = () => setView("login");

  // ── Animated background orbs ──────────────────────────────────────────────
  const orbs = [
    { c:'#6366F1', x:'15%', y:'20%', s:320, delay:'0s',  dur:'8s'  },
    { c:'#10B981', x:'80%', y:'15%', s:280, delay:'1.5s', dur:'10s' },
    { c:'#6366F1', x:'60%', y:'70%', s:350, delay:'3s',  dur:'12s' },
    { c:'#F43F5E', x:'10%', y:'75%', s:200, delay:'0.5s', dur:'9s'  },
    { c:'#F59E0B', x:'90%', y:'55%', s:180, delay:'2s',  dur:'11s' },
  ];

  const STEPS = [
    { n:1, label:'Center Identity',   icon:<BuildingIco /> },
    { n:2, label:'Compliance Docs',   icon:<BadgeIco />    },
    { n:3, label:'Emergency & Finish',icon:<ShieldIco />   },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden bg-[#0F1629] font-[Montserrat,ui-sans-serif,system-ui,sans-serif]">

      {/* ── Toast ──────────────────────────────────────────────────────────── */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-md text-[12px] font-bold transition-all
          ${toast.type === 'success'
            ? 'bg-[#162035] border-[#10B981]/30 text-[#10B981]'
            : 'bg-[#162035] border-[#F43F5E]/30 text-[#F43F5E]'
          }`}>
          <span className="shrink-0">{toast.type === 'success' ? <CheckIco /> : <AlertIco />}</span>
          <span className="max-w-[280px]">{toast.msg}</span>
        </div>
      )}

      {/* ═══ LEFT BRANDING PANEL ══════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-14 overflow-hidden bg-[#0D1829]">

        {/* Animated orbs */}
        {orbs.map((o, i) => (
          <div key={i} className="absolute rounded-full blur-[80px] opacity-[0.12] animate-pulse pointer-events-none"
            style={{ background:o.c, left:o.x, top:o.y, width:o.s, height:o.s, animationDelay:o.delay, animationDuration:o.dur }} />
        ))}
        {/* Top edge glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6366F1]/40 to-transparent" />
        {/* Right edge separator */}
        <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/[0.08] to-transparent" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/[0.05] border border-white/[0.09] rounded-2xl mb-14">
            <img src="/ttl-final.png" alt="TrueTestLabs Logo" className="w-6 h-6 object-contain" />
            <span className="text-[18px] font-black text-white tracking-tight">
              TrueTest<span className="text-[#10B981]">Labs</span>
            </span>
          </div>

          <h1 className="text-[58px] font-black text-white tracking-[-0.03em] leading-[1] mb-7">
            {view === 'login' ? (
              <>Secure<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#10B981]">Clinical</span><br />Access.</>
            ) : (
              <>Partner<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#6366F1]">Network.</span><br />Grow.</>
            )}
          </h1>

          <p className="text-white/55 text-[15px] leading-[1.7] max-w-[380px]">
            {view === 'login'
              ? 'Access your diagnostic center workstation. Manage patients, reports, staff, and analytics — all in one intelligent platform.'
              : 'Join the TrueTestLabs partner network. Register your diagnostic center and start receiving live patient requests and delivering digital reports.'}
          </p>
        </div>

        {/* Feature pills */}
        <div className="relative z-10 space-y-4">
          <p className="text-[9px] font-black text-white/25 uppercase tracking-[0.25em] mb-4">Platform Capabilities</p>
          {[
            { icon: <FlaskIco />,   color:'text-[#10B981]', bg:'bg-[#10B981]/10 border-[#10B981]/15', label:'AI-Powered Diagnostics', desc:'Machine-learning enhanced report generation' },
            { icon: <ShieldIco />,  color:'text-[#6366F1]', bg:'bg-[#6366F1]/10 border-[#6366F1]/15', label:'HIPAA & NABL Compliant', desc:'Enterprise-grade security & compliance' },
            { icon: <BarChartIco />,color:'text-[#F59E0B]', bg:'bg-[#F59E0B]/10 border-[#F59E0B]/15', label:'Real-Time Analytics',    desc:'Live patient flow & revenue dashboards' },
            { icon: <ZapIco />,     color:'text-[#F43F5E]', bg:'bg-[#F43F5E]/10 border-[#F43F5E]/15', label:'Instant Report Delivery', desc:'Digital reports with verified signatures' },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:bg-white/[0.05] transition-colors group">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${f.bg} ${f.color}`}>{f.icon}</div>
              <div>
                <p className="text-[12px] font-bold text-white">{f.label}</p>
                <p className="text-[10px] text-white/35 mt-0.5">{f.desc}</p>
              </div>
              <div className="ml-auto text-white/10 group-hover:text-white/30 transition-colors"><ChevronRIco /></div>
            </div>
          ))}
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4 mt-6">
          {[
            { v:'2,400+', l:'Registered Centers' },
            { v:'98.9%',  l:'Uptime SLA'          },
            { v:'4.9★',   l:'Partner Rating'      },
          ].map((s, i) => (
            <div key={i} className="text-center p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
              <p className="text-[16px] font-black text-white">{s.v}</p>
              <p className="text-[8px] text-white/30 uppercase tracking-widest mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ RIGHT AUTH PANEL ═════════════════════════════════════════════════ */}
      <div className="w-full lg:w-[55%] min-h-screen flex items-center justify-center p-5 sm:p-10 relative bg-[#0F1629] overflow-y-auto">

        {/* Subtle bg orb on right */}
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#6366F1] rounded-full blur-[120px] opacity-[0.04] pointer-events-none" />

        <div className="w-full max-w-[480px] relative z-10">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <img src="/ttl-final.png" alt="TrueTestLabs Logo" className="w-8 h-8 object-contain" />
            <span className="text-[20px] font-black text-white">TrueTest<span className="text-[#10B981]">Labs</span></span>
          </div>

          {/* Card */}
          <div className="bg-[#162035]/90 backdrop-blur-xl border border-white/[0.08] rounded-[28px] shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6366F1]/40 to-transparent" />

            <div className="p-7 sm:p-9">


              {/* ═══ LOGIN FORM ════════════════════════════════════════════ */}
              {view === 'login' && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-[22px] font-black text-white">Welcome back</h2>
                    <p className="text-[12px] text-white/40 mt-1">Sign in to your diagnostic center portal</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">

                    <InputField label="Center ID" required icon={<IdIco />}
                      placeholder="TTL-XXXX" type="text"
                      value={loginData.id} onChange={lSet('id')}
                      hint="Your unique center identifier issued during registration" />

                    <div className="space-y-1.5 group">
                      <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-1">
                        Password<span className="text-[#F43F5E]">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#6366F1] transition-colors pointer-events-none"><LockIco /></div>
                        <input
                          type={showPwd ? "text" : "password"} required
                          placeholder="Enter your password"
                          value={loginData.password} onChange={e => lSet('password')(e.target.value)}
                          className="w-full bg-[#0D1829] border border-white/[0.09] rounded-xl pl-10 pr-11 py-3 text-[13px] font-medium text-white placeholder:text-white/20 focus:outline-none focus:border-[#6366F1]/60 focus:ring-2 focus:ring-[#6366F1]/10 transition-all"
                        />
                        <button type="button" onClick={() => setShowPwd(s=>!s)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                          {showPwd ? <EyeOffIco /> : <EyeIco />}
                        </button>
                      </div>
                    </div>

                    {/* Remember + Forgot */}
                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2.5 cursor-pointer group">
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${rememberMe ? 'bg-[#6366F1] border-[#6366F1]' : 'border-white/20 bg-[#0D1829]'}`}
                          onClick={() => setRememberMe(s=>!s)}>
                          {rememberMe && <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>}
                        </div>
                        <span className="text-[12px] text-white/55 group-hover:text-white/80 transition-colors">Remember me</span>
                      </label>
                      <button type="button"
                        onClick={() => showToast("Contact your system administrator to reset your password", "error")}
                        className="text-[12px] text-[#6366F1] hover:text-[#A5B4FC] transition-colors font-medium">
                        Forgot password?
                      </button>
                    </div>

                    <button type="submit" disabled={loading}
                      className="w-full py-3.5 rounded-xl text-[14px] font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#10B981] hover:opacity-90 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.45)] transition-all disabled:opacity-60 relative overflow-hidden group mt-2">
                      <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                          Signing In…
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2"><LockIco /> Sign In to Portal</span>
                      )}
                    </button>
                  </form>

                  <p className="text-center text-[12px] text-white/40 mt-5">
                    New diagnostic center?{' '}
                    <button onClick={switchToReg} className="text-[#10B981] hover:text-[#6EE7B7] font-bold transition-colors">
                      Register here →
                    </button>
                  </p>
                </div>
              )}

              {/* ═══ REGISTER FORM ═════════════════════════════════════════ */}
              {view === 'register' && (
                <div>
                  {/* Header */}
                  <div className="mb-6">
                    <h2 className="text-[20px] font-black text-white">Partner Registration</h2>
                    <p className="text-[12px] text-white/40 mt-1">Set up your diagnostic center in 3 steps</p>
                  </div>

                  {/* Step progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      {STEPS.map((s, i) => (
                        <React.Fragment key={s.n}>
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black transition-all ${
                              regStep > s.n  ? 'bg-[#10B981] text-white'
                              : regStep === s.n ? 'bg-gradient-to-br from-[#6366F1] to-[#10B981] text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                              : 'bg-white/[0.05] border border-white/[0.08] text-white/30'
                            }`}>
                              {regStep > s.n ? <CheckIco /> : s.n}
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-widest hidden sm:block transition-colors ${
                              regStep >= s.n ? 'text-white/70' : 'text-white/20'
                            }`}>{s.label}</span>
                          </div>
                          {i < STEPS.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${regStep > s.n ? 'bg-[#10B981]' : 'bg-white/[0.07]'}`} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="flex gap-1.5">
                      {[1,2,3].map(s => (
                        <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                          regStep >= s ? 'bg-gradient-to-r from-[#6366F1] to-[#10B981] shadow-[0_0_6px_rgba(99,102,241,0.4)]' : 'bg-white/[0.07]'
                        }`} />
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-4">

                    {/* ── STEP 1: Identity ─────────────────────────────── */}
                    {regStep === 1 && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <InputField label="Diagnostic Center Name" required icon={<BuildingIco />}
                          placeholder="e.g. Apollo Diagnostics" value={regData.name} onChange={rSet('name')} />
                        <div className="grid grid-cols-2 gap-3">
                          <InputField label="Owner Full Name" required icon={<UserIco />}
                            placeholder="e.g. Dr. Sarah Khan" value={regData.ownerName} onChange={rSet('ownerName')} />
                          <InputField label="Contact Phone" required icon={<PhoneIco />}
                            placeholder="+1 555 000-0000" type="tel" value={regData.phoneNumber} onChange={rSet('phoneNumber')} />
                        </div>
                        <InputField label="Official Email" required icon={<MailIco />}
                          placeholder="admin@yourcenter.com" type="email" value={regData.email} onChange={rSet('email')} />
                        <InputField label="Full Address" required icon={<MapPinIco />}
                          placeholder="Building, Street, City, State, Pincode" value={regData.address} onChange={rSet('address')} />
                        <InputField label="Google Maps URL" required icon={<LinkIco />}
                          placeholder="https://maps.google.com/..." type="url" value={regData.googleMapUrl} onChange={rSet('googleMapUrl')}
                          hint="Share your center location for patient navigation" />

                        {/* Password */}
                        <div className="space-y-1.5 group">
                          <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">
                            Security Password <span className="text-[#F43F5E]">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"><LockIco /></div>
                            <input type={showPwd ? "text" : "password"} required placeholder="Create strong password"
                              value={regData.password} onChange={e => rSet('password')(e.target.value)}
                              className="w-full bg-[#0D1829] border border-white/[0.09] rounded-xl pl-10 pr-11 py-3 text-[13px] font-medium text-white placeholder:text-white/20 focus:outline-none focus:border-[#6366F1]/60 focus:ring-2 focus:ring-[#6366F1]/10 transition-all" />
                            <button type="button" onClick={() => setShowPwd(s=>!s)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                              {showPwd ? <EyeOffIco /> : <EyeIco />}
                            </button>
                          </div>
                          {regData.password && (
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex gap-1 flex-1">
                                {[1,2,3,4].map(i => (
                                  <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                                    style={{ background: i <= strength.score ? strength.color : 'rgba(255,255,255,0.07)' }} />
                                ))}
                              </div>
                              <span className="text-[8px] font-bold" style={{color: strength.color}}>{strength.label}</span>
                            </div>
                          )}
                          <p className="text-[8px] text-white/20 pl-1">Min 8 chars, uppercase, number, symbol</p>
                        </div>

                        {/* Confirm password */}
                        <div className="space-y-1.5 group">
                          <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">
                            Confirm Password <span className="text-[#F43F5E]">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"><LockIco /></div>
                            <input type={showPwd2 ? "text" : "password"} required placeholder="Re-enter password"
                              value={confPwd} onChange={e => setConfPwd(e.target.value)}
                              className={`w-full bg-[#0D1829] border rounded-xl pl-10 pr-11 py-3 text-[13px] font-medium text-white placeholder:text-white/20 focus:outline-none transition-all ${
                                confPwd && confPwd !== regData.password ? 'border-[#F43F5E]/50 focus:border-[#F43F5E]/70' : 'border-white/[0.09] focus:border-[#6366F1]/60 focus:ring-2 focus:ring-[#6366F1]/10'
                              }`} />
                            <button type="button" onClick={() => setShowPwd2(s=>!s)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                              {showPwd2 ? <EyeOffIco /> : <EyeIco />}
                            </button>
                          </div>
                          {confPwd && confPwd !== regData.password && (
                            <p className="text-[9px] text-[#F43F5E] pl-1 flex items-center gap-1"><XCircleIco /> Passwords do not match</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ── STEP 2: Compliance Docs ───────────────────────── */}
                    {regStep === 2 && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="p-4 bg-[#6366F1]/[0.06] border border-[#6366F1]/15 rounded-xl flex items-start gap-3">
                          <span className="text-[#6366F1] shrink-0 mt-0.5"><BadgeIco /></span>
                          <div>
                            <p className="text-[12px] font-bold text-white">Regulatory Compliance</p>
                            <p className="text-[10px] text-white/40 mt-0.5">All certification numbers and documents are securely encrypted and verified by our compliance team.</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <InputField label="ISO Certification No." required icon={<BadgeIco />}
                            placeholder="ISO-9001-2015" value={regData.isoNumber} onChange={rSet('isoNumber')} />
                          <InputField label="NABL Certification No." required icon={<BadgeIco />}
                            placeholder="NABL-MC-2023" value={regData.nablNumber} onChange={rSet('nablNumber')} />
                          <InputField label="GST Registration No." required icon={<FileIco />}
                            placeholder="22AAAAA0000A1Z5" value={regData.gstNumber} onChange={rSet('gstNumber')} />
                          <InputField label="Trade License No." required icon={<FileIco />}
                            placeholder="TL-2023-XYZ" value={regData.tradeLicense} onChange={rSet('tradeLicense')} />
                        </div>
                        <UploadZone label="ISO Certificate" required
                          file={files.iso} preview={previews.iso}
                          onFile={(f, p) => { setFiles(v=>({...v,iso:f})); setPreviews(v=>({...v,iso:p})); }} />
                        <UploadZone label="NABL Certificate" required
                          file={files.nabl} preview={previews.nabl}
                          onFile={(f, p) => { setFiles(v=>({...v,nabl:f})); setPreviews(v=>({...v,nabl:p})); }} />
                      </div>
                    )}

                    {/* ── STEP 3: Emergency & Review ────────────────────── */}
                    {regStep === 3 && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Emergency services toggle */}
                        <div className="p-5 bg-[#F43F5E]/[0.05] border border-[#F43F5E]/15 rounded-xl">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <span className="text-[#F43F5E] mt-0.5 shrink-0"><AlertIco /></span>
                              <div>
                                <p className="text-[13px] font-bold text-white">24/7 Emergency Services</p>
                                <p className="text-[10px] text-white/40 mt-1 leading-relaxed">Enable if your center handles critical/STAT samples round-the-clock. This highlights your center for urgent patient requests.</p>
                              </div>
                            </div>
                            <button type="button" onClick={() => setRegData(r=>({...r,providesEmergency:!r.providesEmergency}))}
                              className="w-12 h-6 rounded-full relative transition-all duration-300 shrink-0 border"
                              style={{
                                background: regData.providesEmergency ? '#F43F5E' : 'rgba(255,255,255,0.08)',
                                borderColor: regData.providesEmergency ? '#F43F5E' : 'rgba(255,255,255,0.12)',
                                boxShadow: regData.providesEmergency ? '0 0 10px #F43F5E50' : 'none',
                              }}>
                              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${regData.providesEmergency ? 'left-[calc(100%-22px)]' : 'left-0.5'}`} />
                            </button>
                          </div>
                        </div>

                        {/* Registration summary */}
                        <div className="p-5 bg-white/[0.02] border border-white/[0.07] rounded-xl space-y-3">
                          <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3">Registration Summary</p>
                          {[
                            { l:'Center Name', v: regData.name || '—' },
                            { l:'Owner',        v: regData.ownerName || '—' },
                            { l:'Email',        v: regData.email || '—' },
                            { l:'Phone',        v: regData.phoneNumber || '—' },
                            { l:'GST Number',   v: regData.gstNumber || '—' },
                            { l:'ISO No.',      v: regData.isoNumber || '—' },
                            { l:'NABL No.',     v: regData.nablNumber || '—' },
                            { l:'Emergency',    v: regData.providesEmergency ? '✓ Enabled' : '✗ Disabled' },
                          ].map((r, i) => (
                            <div key={i} className="flex items-center justify-between text-[11px] border-b border-white/[0.04] pb-2">
                              <span className="text-white/35 font-medium">{r.l}</span>
                              <span className={`font-bold ${r.l==='Emergency'?(regData.providesEmergency?'text-[#10B981]':'text-white/40'):'text-white/70'}`}>{r.v}</span>
                            </div>
                          ))}
                        </div>

                        {/* Terms */}
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <div className="w-4 h-4 rounded border border-white/20 bg-[#0D1829] flex items-center justify-center mt-0.5 shrink-0 group-hover:border-[#6366F1]/50 transition-colors">
                            <input type="checkbox" required className="sr-only" />
                            <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/></svg>
                          </div>
                          <span className="text-[11px] text-white/40 leading-relaxed">
                            I agree to the <span className="text-[#6366F1] cursor-pointer hover:underline">Terms of Service</span> and <span className="text-[#6366F1] cursor-pointer hover:underline">Privacy Policy</span>. I confirm all submitted documents are authentic and valid.
                          </span>
                        </label>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3 pt-2">
                      {regStep > 1 && (
                        <button type="button" onClick={() => setRegStep(s=>s-1)}
                          className="px-5 py-3 rounded-xl text-[12px] font-bold text-white/50 bg-white/[0.04] border border-white/[0.07] hover:text-white hover:bg-white/[0.08] transition-all">
                          ← Back
                        </button>
                      )}
                      <button type="submit" disabled={loading}
                        className="flex-1 py-3 rounded-xl text-[13px] font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#10B981] hover:opacity-90 shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all disabled:opacity-60 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                            Processing…
                          </span>
                        ) : regStep === 3 ? (
                          <span className="flex items-center justify-center gap-2"><CheckIco /> Complete Registration</span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">Continue <ChevronRIco /></span>
                        )}
                      </button>
                    </div>
                  </form>

                  <p className="text-center text-[12px] text-white/40 mt-5">
                    Already registered?{' '}
                    <button onClick={switchToLog} className="text-[#6366F1] hover:text-[#A5B4FC] font-bold transition-colors">
                      Sign In →
                    </button>
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-9 py-4 border-t border-white/[0.05] flex items-center justify-between">
              <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">TrueTestLabs © 2026</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">All systems operational</span>
              </div>
            </div>
          </div>

          {/* Trust badges below card */}
          <div className="flex items-center justify-center gap-5 mt-6">
            {[
              { icon:<LockIco />,    c:'text-[#6366F1]', l:'SSL Encrypted'  },
              { icon:<ShieldIco />,  c:'text-[#10B981]', l:'HIPAA Compliant' },
              { icon:<BadgeIco />,   c:'text-[#F59E0B]', l:'ISO Certified'   },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className={`${b.c} opacity-70`}>{b.icon}</span>
                <span className="text-[9px] font-bold text-white/25">{b.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
