"use client";

import React, { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';

// ─── Inline Icons ──────────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, sw = 1.8 }: { d: string; size?: number; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const SettingsIco  = () => <Ico d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M4.93 19.07l1.41-1.41 M17.66 6.34l1.41-1.41" />;
const IdentityIco  = () => <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />;
const AppearIco    = () => <Ico d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />;
const OpsIco       = () => <Ico d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const ClinicalIco  = () => <Ico d="M8 2v4 M16 2v4 M3 10h18 M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z M12 14h4 M12 18h2 M8 14v4" />;
const BillingIco   = () => <Ico d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />;
const ShieldIco    = () => <Ico d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const BellIco      = () => <Ico d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0" />;
const CheckIco     = () => <Ico d="M20 6L9 17l-5-5" />;
const SaveIco      = () => <Ico d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8" />;
const PlusIco      = () => <Ico d="M12 5v14M5 12h14" />;
const TrashIco     = () => <Ico d="M3 6h18 M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6 M10 11v6 M14 11v6 M9 6V4h6v2" />;
const EditIco      = () => <Ico d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />;
const AlertIco     = () => <Ico d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01" />;
const XIco         = () => <Ico d="M18 6L6 18M6 6l12 12" />;
const KeyIco       = () => <Ico d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />;
const ClockIco     = () => <Ico d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2" />;
const GlobeIco     = () => <Ico d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />;
const CopyIco      = () => <Ico d="M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 0 2 2v1" />;
const RefreshIco   = () => <Ico d="M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />;

// ─── Types ─────────────────────────────────────────────────────────────────────
type SettingsTab = 'general' | 'appearance' | 'operations' | 'clinical' | 'billing' | 'security' | 'notifications';

interface AdminUser {
  id: number; name: string; email: string; role: string; status: 'active' | 'inactive'; lastLogin: string;
}

// ─── Shared field base styles ──────────────────────────────────────────────────
const FB = "w-full bg-[#0D1829] border border-white/[0.09] rounded-2xl px-4 py-3 text-[13px] font-medium text-white placeholder:text-white/20 focus:outline-none focus:border-[#6366F1]/50 focus:ring-2 focus:ring-[#6366F1]/10 transition-all";
const LB = "text-[8px] font-black text-white/35 uppercase tracking-[0.2em]";

// ─── Card ──────────────────────────────────────────────────────────────────────
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#0D1829]/60 border border-white/[0.07] rounded-2xl relative overflow-hidden ${className}`}>
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    {children}
  </div>
);

// ─── Toggle ────────────────────────────────────────────────────────────────────
const Toggle = ({ on, onChange, accent = '#10B981' }: { on: boolean; onChange: () => void; accent?: string }) => (
  <button onClick={onChange}
    className="w-12 h-6 rounded-full relative transition-all duration-300 shrink-0 border"
    style={{ background: on ? accent : 'rgba(255,255,255,0.08)', borderColor: on ? accent : 'rgba(255,255,255,0.12)', boxShadow: on ? `0 0 10px ${accent}50` : 'none' }}>
    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${on ? 'left-[calc(100%-22px)]' : 'left-0.5'}`} />
  </button>
);

// ─── Section Header ────────────────────────────────────────────────────────────
const SectionHeader = ({ title, subtitle, icon, iconBg = 'bg-[#6366F1]/15', iconText = 'text-[#6366F1]', iconBorder = 'border-[#6366F1]/25' }: {
  title: string; subtitle: string; icon: React.ReactNode; iconBg?: string; iconText?: string; iconBorder?: string;
}) => (
  <div className="flex items-center gap-3 mb-5">
    <div className={`w-9 h-9 rounded-xl ${iconBg} border ${iconBorder} flex items-center justify-center ${iconText} shrink-0`}>{icon}</div>
    <div>
      <h3 className="text-[14px] font-black text-white">{title}</h3>
      <p className="text-[8px] font-bold text-white/25 uppercase tracking-widest mt-0.5">{subtitle}</p>
    </div>
  </div>
);

// ─── Setting Row ───────────────────────────────────────────────────────────────
const SettingRow = ({ label, description, on, onChange, accent }: { label: string; description: string; on: boolean; onChange: () => void; accent?: string }) => (
  <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
    <div>
      <p className="text-[12px] font-bold text-white/80">{label}</p>
      <p className="text-[9px] text-white/35 mt-0.5">{description}</p>
    </div>
    <Toggle on={on} onChange={onChange} accent={accent} />
  </div>
);

// ─── Field ────────────────────────────────────────────────────────────────────
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className={LB}>{label}</label>
    {children}
  </div>
);

// ══════════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════════
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [isSaving,  setIsSaving]  = useState(false);
  const [toast,     setToast]     = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => { setIsSaving(false); showToast('✓ Configuration saved successfully'); }, 1500);
  };

  // ── General ────────────────────────────────────────────────────────────────
  const [centerName,  setCenterName]  = useState('TrueTestLabs HQ');
  const [centerCode,  setCenterCode]  = useState('TTL-NY-001');
  const [address,     setAddress]     = useState('12th Floor, Biotech Tower, Science Park, New York, NY 10001');
  const [timezone,    setTimezone]    = useState('America/New_York');
  const [language,    setLanguage]    = useState('en-US');
  const [supportEmail,setSupportEmail]= useState('support@truetest.com');
  const [phone,       setPhone]       = useState('+1 (212) 555-0190');

  // ── Operations ────────────────────────────────────────────────────────────
  const [remoteCollection, setRemoteCollection] = useState(true);
  const [opsRadius,        setOpsRadius]        = useState('25');
  const [slotInterval,     setSlotInterval]     = useState('30');
  const [alwaysOn,         setAlwaysOn]         = useState(false);
  const [autoAssign,       setAutoAssign]       = useState(true);
  const [smsOnPickup,      setSmsOnPickup]      = useState(true);
  const [homeCollectionFee,setHomeCollectionFee]= useState('150');
  const [urgentFee,        setUrgentFee]        = useState('200');

  // ── Clinical ──────────────────────────────────────────────────────────────
  const [autoDispatch, setAutoDispatch]   = useState(true);
  const [nablHeader,   setNablHeader]     = useState(false);
  const [dualSign,     setDualSign]       = useState(true);
  const [qcRequired,   setQcRequired]     = useState(true);
  const [reportExpiry, setReportExpiry]   = useState('90');
  const [sampleRetain, setSampleRetain]   = useState('7');

  // ── Billing ───────────────────────────────────────────────────────────────
  const [gstRate,      setGstRate]       = useState('18');
  const [gstNo,        setGstNo]         = useState('27AAXCS1234F1ZS');
  const [panNo,        setPanNo]         = useState('AAXCS1234F');
  const [upiId,        setUpiId]         = useState('truetest@paytm');
  const [autoInvoice,  setAutoInvoice]   = useState(true);
  const [creditEnabled,setCreditEnabled] = useState(false);
  const [creditLimit,  setCreditLimit]   = useState('10000');

  // ── Security ─────────────────────────────────────────────────────────────
  const [mfaEnabled,   setMfaEnabled]    = useState(true);
  const [sessionTimeout,setSessionTimeout]= useState('30');
  const [tokenLife,    setTokenLife]     = useState('7-Day Clinical Window');
  const [auditLog,     setAuditLog]      = useState(true);
  const [ipWhitelist,  setIpWhitelist]   = useState(false);
  const [dataEncryption,setDataEncryption]=useState(true);

  // ── Notifications ─────────────────────────────────────────────────────────
  const [reportReady,  setReportReady]   = useState(true);
  const [newOrder,     setNewOrder]      = useState(true);
  const [urgentAlert,  setUrgentAlert]   = useState(true);
  const [staffAbsent,  setStaffAbsent]   = useState(false);
  const [paymentDue,   setPaymentDue]    = useState(true);
  const [certExpiry,   setCertExpiry]    = useState(true);
  const [emailChannel, setEmailChannel]  = useState(true);
  const [smsChannel,   setSmsChannel]    = useState(true);
  const [pushChannel,  setPushChannel]   = useState(false);

  // ── Admin Users ──────────────────────────────────────────────────────────
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    { id:1, name:'Dr. Rahul Sharma',  email:'rahul.s@truetest.com',  role:'Super Admin', status:'active',   lastLogin:'2026-05-27 14:02' },
    { id:2, name:'Amit Patel',         email:'amit.p@truetest.com',   role:'Lab Manager', status:'active',   lastLogin:'2026-05-27 09:15' },
    { id:3, name:'Priya Mehta',        email:'priya.m@truetest.com',  role:'Operator',    status:'active',   lastLogin:'2026-05-26 18:30' },
    { id:4, name:'Dr. Sarah Smith',   email:'sarah.s@truetest.com',  role:'Pathologist', status:'inactive', lastLogin:'2026-05-20 11:00' },
    { id:5, name:'Suresh Raina',       email:'suresh.r@truetest.com', role:'Operator',    status:'active',   lastLogin:'2026-05-27 07:45' },
  ]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail,setNewUserEmail]= useState('');
  const [newUserRole, setNewUserRole] = useState('Operator');

  const ROLE_COLORS: Record<string,string> = {
    'Super Admin': 'bg-[#F43F5E]/10 text-[#F43F5E] border-[#F43F5E]/25',
    'Lab Manager': 'bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/25',
    'Pathologist': 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/25',
    'Operator':    'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/25',
  };

  const addUser = () => {
    if (!newUserName || !newUserEmail) return showToast('⚠ Fill in all fields');
    setAdminUsers(prev => [...prev, { id:Date.now(), name:newUserName, email:newUserEmail, role:newUserRole, status:'active', lastLogin:'Just now' }]);
    setNewUserName(''); setNewUserEmail(''); setShowAddUser(false);
    showToast('✓ Admin user added');
  };
  const removeUser = (id: number) => { setAdminUsers(prev => prev.filter(u => u.id !== id)); showToast('User removed'); };
  const toggleUser = (id: number) => {
    setAdminUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  // ── Tabs config ───────────────────────────────────────────────────────────
  const TABS: { id: SettingsTab; label: string; icon: React.ReactNode; accent: string }[] = [
    { id:'general',       label:'General Identity',     icon:<IdentityIco />,  accent:'#6366F1' },
    { id:'appearance',    label:'Interface & Themes',   icon:<AppearIco />,    accent:'#F59E0B' },
    { id:'operations',    label:'Ops & Logistics',      icon:<OpsIco />,       accent:'#10B981' },
    { id:'clinical',      label:'Clinical Governance',  icon:<ClinicalIco />,  accent:'#06B6D4' },
    { id:'billing',       label:'Tax & Revenue',        icon:<BillingIco />,   accent:'#F59E0B' },
    { id:'security',      label:'Security & Access',    icon:<ShieldIco />,    accent:'#F43F5E' },
    { id:'notifications', label:'Notifications',        icon:<BellIco />,      accent:'#8B5CF6' },
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  // TAB CONTENT
  // ─────────────────────────────────────────────────────────────────────────────

  const renderGeneral = () => (
    <div className="space-y-6">
      <SectionHeader title="Center Identity" subtitle="Global branding & metadata" icon={<IdentityIco />} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Center Designation *">
          <input type="text" className={FB} value={centerName} onChange={e => setCenterName(e.target.value)} />
        </Field>
        <Field label="System Identity Code *">
          <input type="text" className={FB} value={centerCode} onChange={e => setCenterCode(e.target.value)} />
        </Field>
        <Field label="Support Email">
          <input type="email" className={FB} value={supportEmail} onChange={e => setSupportEmail(e.target.value)} />
        </Field>
        <Field label="Phone Number">
          <input type="tel" className={FB} value={phone} onChange={e => setPhone(e.target.value)} />
        </Field>
        <Field label="Timezone">
          <select className={FB} value={timezone} onChange={e => setTimezone(e.target.value)}>
            {['America/New_York','America/Chicago','America/Los_Angeles','Asia/Kolkata','Asia/Dubai','Europe/London'].map(tz => <option key={tz} value={tz}>{tz}</option>)}
          </select>
        </Field>
        <Field label="Portal Language">
          <select className={FB} value={language} onChange={e => setLanguage(e.target.value)}>
            {['en-US','en-GB','hi-IN','ar-AE','fr-FR'].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Headquarters Address">
            <textarea rows={2} className={`${FB} resize-none`} value={address} onChange={e => setAddress(e.target.value)} />
          </Field>
        </div>
      </div>

      {/* Logo upload */}
      <Card className="p-5">
        <p className={`${LB} mb-3`}>Portal Logo / Branding</p>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center text-2xl shrink-0">🏷️</div>
          <div>
            <button onClick={() => showToast('✓ File picker opened')}
              className="px-4 py-2 rounded-xl text-[10px] font-bold bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#A5B4FC] hover:bg-[#6366F1]/20 transition-all">
              Upload Logo
            </button>
            <p className="text-[9px] text-white/25 mt-1.5">SVG, PNG, or JPEG — Max 5MB. Transparent background recommended.</p>
          </div>
        </div>
      </Card>

      {/* Admin User Table */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <SectionHeader title="Admin User Management" subtitle="Roles & portal access control" icon={<IdentityIco />} />
          <button onClick={() => setShowAddUser(s => !s)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-bold bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#A5B4FC] hover:bg-[#6366F1]/20 transition-all shrink-0">
            <PlusIco /> Add User
          </button>
        </div>

        {showAddUser && (
          <div className="bg-[#0D1829]/80 border border-[#6366F1]/20 rounded-xl p-4 mb-4 space-y-3">
            <p className="text-[10px] font-black text-[#A5B4FC] uppercase tracking-widest">New Admin User</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input type="text" placeholder="Full Name" className={FB} value={newUserName} onChange={e => setNewUserName(e.target.value)} />
              <input type="email" placeholder="Email Address" className={FB} value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} />
              <select className={FB} value={newUserRole} onChange={e => setNewUserRole(e.target.value)}>
                {['Operator','Pathologist','Lab Manager','Super Admin'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={addUser} className="px-4 py-2 rounded-xl text-[10px] font-bold bg-gradient-to-r from-[#6366F1] to-[#10B981] text-white hover:opacity-90 transition-all">Add User</button>
              <button onClick={() => setShowAddUser(false)} className="px-4 py-2 rounded-xl text-[10px] font-bold text-white/40 bg-white/[0.04] border border-white/[0.06] hover:text-white transition-all">Cancel</button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full text-left min-w-[560px]">
            <thead className="border-b border-white/[0.06]">
              <tr>{['Name','Email','Role','Status','Last Login','Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-[8px] font-black text-white/25 uppercase tracking-widest">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {adminUsers.map(user => (
                <tr key={user.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] group transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#818CF8] flex items-center justify-center text-white text-[9px] font-black shrink-0">
                        {user.name.split(' ').map(n=>n[0]).slice(0,2).join('')}
                      </div>
                      <p className="text-[12px] font-semibold text-white">{user.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[10px] text-white/40">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[8px] font-black px-2.5 py-1 rounded-full border uppercase tracking-widest ${ROLE_COLORS[user.role] || ROLE_COLORS['Operator']}`}>{user.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleUser(user.id)}
                      className={`text-[8px] font-black px-2 py-0.5 rounded-full border transition-all ${user.status==='active'?'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/25':'bg-white/[0.04] text-white/30 border-white/[0.07]'}`}>
                      {user.status}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-[9px] text-white/30">{user.lastLogin}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => showToast('✓ Edit user dialog opened')}
                        className="w-7 h-7 rounded-lg bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center text-[#6366F1] hover:bg-[#6366F1]/20 transition-all"><EditIco /></button>
                      <button onClick={() => removeUser(user.id)}
                        className="w-7 h-7 rounded-lg bg-[#F43F5E]/10 border border-[#F43F5E]/20 flex items-center justify-center text-[#F43F5E] hover:bg-[#F43F5E]/20 transition-all"><TrashIco /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-6">
      <SectionHeader title="Visual Framework" subtitle="Interface themes & global aesthetic" icon={<AppearIco />} iconBg="bg-[#F59E0B]/15" iconText="text-[#F59E0B]" iconBorder="border-[#F59E0B]/25" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { emoji:'🌙', name:'Midnight Navy', sub:'Deep focus, low fatigue — recommended for lab environments', active:true, accent:'#6366F1' },
          { emoji:'⚫', name:'Obsidian Dark',  sub:'Full black — premium OLED-optimised dark mode',              active:false, accent:'#111' },
          { emoji:'🌊', name:'Ocean Pro',      sub:'Deep teal accents for marine medical facilities',            active:false, accent:'#06B6D4' },
          { emoji:'☀️', name:'Clinic Light',   sub:'High contrast white mode for print-heavy workflows',        active:false, accent:'#F59E0B' },
        ].map((t, i) => (
          <div key={i} className={`relative p-5 rounded-2xl border transition-all cursor-pointer group ${t.active ? 'border-[#6366F1]/40 bg-[#6366F1]/[0.07]' : 'border-white/[0.07] bg-white/[0.02] hover:border-white/15'}`}
            onClick={() => showToast(t.active ? 'Already active' : `✓ Switched to ${t.name}`)}>
            {t.active && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-[#6366F1] rounded-full flex items-center justify-center text-white shadow-sm"><CheckIco /></div>
            )}
            <div className="flex items-center gap-3">
              <div className="text-2xl">{t.emoji}</div>
              <div>
                <p className="text-[13px] font-bold text-white">{t.name}</p>
                <p className="text-[9px] text-white/35 mt-0.5">{t.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Card className="p-5 space-y-4">
        <p className="text-[10px] font-black text-white/35 uppercase tracking-widest">Accent Color</p>
        <div className="flex gap-3 flex-wrap">
          {[
            { c:'#6366F1', n:'Indigo'  },
            { c:'#10B981', n:'Emerald' },
            { c:'#F59E0B', n:'Amber'   },
            { c:'#06B6D4', n:'Cyan'    },
            { c:'#F43F5E', n:'Rose'    },
            { c:'#8B5CF6', n:'Violet'  },
          ].map(a => (
            <button key={a.c} onClick={() => showToast(`✓ Accent set to ${a.n}`)}
              className="flex flex-col items-center gap-1.5 group">
              <div className="w-9 h-9 rounded-xl border-2 border-white/10 group-hover:scale-110 transition-all shadow-sm" style={{background:a.c}} />
              <span className="text-[8px] font-bold text-white/30 group-hover:text-white/60 transition-colors">{a.n}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-5 space-y-3">
        <p className="text-[10px] font-black text-white/35 uppercase tracking-widest mb-1">UI Density</p>
        {[
          { l:'Compact', desc:'More rows visible at once — best for data-heavy screens' },
          { l:'Normal',  desc:'Balanced spacing — default for most workflows' },
          { l:'Spacious',desc:'Extra breathing room — ideal for presentations' },
        ].map((d, i) => (
          <button key={i} onClick={() => showToast(`✓ Density set to ${d.l}`)}
            className={`w-full text-left p-3.5 rounded-xl border transition-all ${i===1 ? 'border-[#6366F1]/30 bg-[#6366F1]/[0.06]' : 'border-white/[0.06] hover:border-white/12'}`}>
            <p className="text-[12px] font-bold text-white">{d.l}</p>
            <p className="text-[9px] text-white/30 mt-0.5">{d.desc}</p>
          </button>
        ))}
      </Card>
    </div>
  );

  const renderOperations = () => (
    <div className="space-y-6">
      <SectionHeader title="Ops & Logistics" subtitle="Operational rules & service mesh" icon={<OpsIco />} iconBg="bg-[#10B981]/15" iconText="text-[#10B981]" iconBorder="border-[#10B981]/25" />

      <div className="space-y-3">
        <SettingRow label="Diagnostic Dispatch Network" description="Allow remote phlebotomy and home collection protocols" on={remoteCollection} onChange={() => setRemoteCollection(s=>!s)} />
        <SettingRow label="24/7 Lab Processing" description="Enable around-the-clock throughput with night staff" on={alwaysOn} onChange={() => setAlwaysOn(s=>!s)} />
        <SettingRow label="Auto-Assign Samples" description="Automatically assign incoming orders to available staff" on={autoAssign} onChange={() => setAutoAssign(s=>!s)} />
        <SettingRow label="SMS on Sample Pickup" description="Send automated SMS to patient when phlebotomist is dispatched" on={smsOnPickup} onChange={() => setSmsOnPickup(s=>!s)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Max Operational Radius (KM)">
          <input type="number" className={FB} value={opsRadius} onChange={e => setOpsRadius(e.target.value)} />
        </Field>
        <Field label="Slot Interval (minutes)">
          <select className={FB} value={slotInterval} onChange={e => setSlotInterval(e.target.value)}>
            {['15','30','45','60'].map(v => <option key={v} value={v}>{v} min blocks</option>)}
          </select>
        </Field>
        <Field label="Home Collection Fee (₹)">
          <input type="number" className={FB} value={homeCollectionFee} onChange={e => setHomeCollectionFee(e.target.value)} />
        </Field>
        <Field label="Urgent Processing Surcharge (₹)">
          <input type="number" className={FB} value={urgentFee} onChange={e => setUrgentFee(e.target.value)} />
        </Field>
      </div>

      {/* Operating Hours */}
      <Card className="p-5">
        <p className="text-[10px] font-black text-white/35 uppercase tracking-widest mb-4">Operating Hours</p>
        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full text-left min-w-[480px]">
            <thead className="border-b border-white/[0.06]">
              <tr>{['Day','Open','From','To','Emergency'].map(h => (
                <th key={h} className="px-3 py-2.5 text-[8px] font-black text-white/25 uppercase tracking-widest">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {[
                { day:'Monday–Friday', open:true, from:'07:00', to:'20:00', emergency:false },
                { day:'Saturday',      open:true, from:'08:00', to:'16:00', emergency:false },
                { day:'Sunday',        open:false, from:'—',    to:'—',     emergency:true  },
              ].map((r, i) => (
                <tr key={i} className="border-b border-white/[0.04]">
                  <td className="px-3 py-3 text-[11px] font-semibold text-white">{r.day}</td>
                  <td className="px-3 py-3">
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${r.open?'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/25':'bg-white/[0.04] text-white/30 border-white/[0.07]'}`}>
                      {r.open ? 'Open' : 'Closed'}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-[11px] text-white/50">{r.from}</td>
                  <td className="px-3 py-3 text-[11px] text-white/50">{r.to}</td>
                  <td className="px-3 py-3">
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${r.emergency?'bg-[#F43F5E]/10 text-[#F43F5E] border-[#F43F5E]/25':'bg-white/[0.04] text-white/20 border-white/[0.05]'}`}>
                      {r.emergency ? 'Yes' : 'No'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderClinical = () => (
    <div className="space-y-6">
      <SectionHeader title="Clinical Governance" subtitle="Verification, reports & QC protocols" icon={<ClinicalIco />} iconBg="bg-[#06B6D4]/15" iconText="text-[#06B6D4]" iconBorder="border-[#06B6D4]/25" />

      <div className="space-y-3">
        <SettingRow label="Auto-Dispatch Protocols"       description="Automatically trigger report delivery on completion" on={autoDispatch} onChange={() => setAutoDispatch(s=>!s)} accent="#06B6D4" />
        <SettingRow label="NABL Header Integration"       description="Append NABL accreditation header to all reports" on={nablHeader}   onChange={() => setNablHeader(s=>!s)}   accent="#06B6D4" />
        <SettingRow label="Dual Pathologist Sign-Off"     description="Require two pathologist signatures for critical reports" on={dualSign} onChange={() => setDualSign(s=>!s)} accent="#06B6D4" />
        <SettingRow label="Mandatory QC Before Dispatch"  description="All samples must pass QC before report release" on={qcRequired}   onChange={() => setQcRequired(s=>!s)}   accent="#06B6D4" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Report Validity (Days)">
          <input type="number" className={FB} value={reportExpiry} onChange={e => setReportExpiry(e.target.value)} />
        </Field>
        <Field label="Sample Retention Period (Days)">
          <input type="number" className={FB} value={sampleRetain} onChange={e => setSampleRetain(e.target.value)} />
        </Field>
      </div>

      {/* Reference Range Table */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-black text-white/35 uppercase tracking-widest">Reference Ranges Configuration</p>
          <button onClick={() => showToast('✓ Reference range editor opened')}
            className="px-3 py-1.5 rounded-xl text-[9px] font-bold bg-[#06B6D4]/10 border border-[#06B6D4]/20 text-[#67E8F9] hover:bg-[#06B6D4]/20 transition-all">
            Edit Ranges
          </button>
        </div>
        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full text-left min-w-[500px]">
            <thead className="border-b border-white/[0.06]">
              <tr>{['Parameter','Adult Male','Adult Female','Child','Unit'].map(h => (
                <th key={h} className="px-4 py-2.5 text-[8px] font-black text-white/25 uppercase tracking-widest">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {[
                { p:'Haemoglobin',    m:'13.5–17.5', f:'11.5–15.5', c:'11–16',      u:'g/dL'     },
                { p:'WBC Count',      m:'4–11',      f:'4–11',      c:'5–13',        u:'×10³/μL'  },
                { p:'Platelet Count', m:'150–400',   f:'150–400',   c:'150–450',     u:'×10³/μL'  },
                { p:'Glucose (F)',    m:'70–99',     f:'70–99',     c:'60–100',      u:'mg/dL'    },
                { p:'Creatinine',     m:'0.7–1.3',   f:'0.6–1.1',   c:'0.3–0.7',    u:'mg/dL'    },
              ].map((r, i) => (
                <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-[12px] font-semibold text-white">{r.p}</td>
                  <td className="px-4 py-3 text-[11px] text-[#10B981]">{r.m}</td>
                  <td className="px-4 py-3 text-[11px] text-[#06B6D4]">{r.f}</td>
                  <td className="px-4 py-3 text-[11px] text-[#F59E0B]">{r.c}</td>
                  <td className="px-4 py-3 text-[10px] text-white/30">{r.u}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pathologist Signature */}
      <Card className="p-5">
        <p className="text-[10px] font-black text-white/35 uppercase tracking-widest mb-4">Authorized Pathologist Signatures</p>
        <div className="space-y-3">
          {[
            { name:'Dr. Rahul Sharma',  spec:'Hematology',   cert:'MCI-82910', active:true },
            { name:'Dr. Sarah Smith',  spec:'Microbiology',  cert:'MCI-90123', active:true },
            { name:'Dr. Meena Iyer',   spec:'Histopathology',cert:'MCI-11200', active:false },
          ].map((p, i) => (
            <div key={i} className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/[0.05] rounded-xl">
              <div>
                <p className="text-[12px] font-bold text-white">{p.name}</p>
                <p className="text-[9px] text-white/35 mt-0.5">{p.spec} · {p.cert}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${p.active?'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/25':'bg-white/[0.04] text-white/30 border-white/[0.07]'}`}>
                  {p.active ? 'Active' : 'Inactive'}
                </span>
                <button onClick={() => showToast('✓ Signature upload dialog opened')}
                  className="px-2.5 py-1 rounded-lg text-[8px] font-bold bg-[#06B6D4]/10 border border-[#06B6D4]/20 text-[#67E8F9] hover:bg-[#06B6D4]/20 transition-all">
                  Upload Sig
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      <SectionHeader title="Tax & Revenue" subtitle="GST, invoicing & payment config" icon={<BillingIco />} iconBg="bg-[#F59E0B]/15" iconText="text-[#F59E0B]" iconBorder="border-[#F59E0B]/25" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="GST Rate (%)">
          <input type="number" className={FB} value={gstRate} onChange={e => setGstRate(e.target.value)} />
        </Field>
        <Field label="GSTIN Number">
          <input type="text" className={FB} value={gstNo} onChange={e => setGstNo(e.target.value)} />
        </Field>
        <Field label="PAN Number">
          <input type="text" className={FB} value={panNo} onChange={e => setPanNo(e.target.value)} />
        </Field>
        <Field label="UPI ID">
          <input type="text" className={FB} value={upiId} onChange={e => setUpiId(e.target.value)} />
        </Field>
      </div>

      <div className="space-y-3">
        <SettingRow label="Auto-Generate Invoices"  description="Automatically create PDF invoices on order completion" on={autoInvoice}   onChange={() => setAutoInvoice(s=>!s)}   accent="#F59E0B" />
        <SettingRow label="B2B Credit Facility"     description="Allow approved corporate clients to pay on credit" on={creditEnabled} onChange={() => setCreditEnabled(s=>!s)} accent="#F59E0B" />
        {creditEnabled && (
          <Field label="Max Credit Limit (₹)">
            <input type="number" className={FB} value={creditLimit} onChange={e => setCreditLimit(e.target.value)} />
          </Field>
        )}
      </div>

      {/* Payment Methods */}
      <Card className="p-5">
        <p className="text-[10px] font-black text-white/35 uppercase tracking-widest mb-4">Accepted Payment Methods</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { l:'Cash',             on:true,  emoji:'💵' },
            { l:'UPI / QR',         on:true,  emoji:'📱' },
            { l:'Credit Card',      on:true,  emoji:'💳' },
            { l:'Debit Card',       on:true,  emoji:'🏦' },
            { l:'Net Banking',      on:false, emoji:'🌐' },
            { l:'Insurance Claim',  on:false, emoji:'🛡️' },
          ].map((m, i) => {
            const [enabled, setEnabled] = React.useState(m.on);
            return (
              <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-base">{m.emoji}</span>
                  <span className="text-[11px] font-bold text-white/70">{m.l}</span>
                </div>
                <Toggle on={enabled} onChange={() => setEnabled(s=>!s)} accent="#F59E0B" />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Revenue Summary */}
      <Card className="p-5">
        <p className="text-[10px] font-black text-white/35 uppercase tracking-widest mb-4">This Month Revenue Snapshot</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { l:'Gross Revenue', v:'₹4,82,500', c:'text-[#10B981]' },
            { l:'GST Collected', v:'₹86,850',   c:'text-[#F59E0B]' },
            { l:'Refunds',       v:'₹3,200',    c:'text-[#F43F5E]' },
            { l:'Net Revenue',   v:'₹3,92,450', c:'text-[#6366F1]' },
          ].map((s, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3">
              <p className="text-[7px] font-black text-white/25 uppercase tracking-widest mb-1">{s.l}</p>
              <p className={`text-[14px] font-black ${s.c}`}>{s.v}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderSecurity = () => {
    const [apiKeyVisible, setApiKeyVisible] = useState(false);
    const apiKey = 'sk-ttl-prod-9f8a72b3c1e4d5f6a7b8c9d0e1f2a3b4';
    return (
      <div className="space-y-6">
        <SectionHeader title="System Integrity" subtitle="Data sovereignty & access control" icon={<ShieldIco />} iconBg="bg-[#F43F5E]/15" iconText="text-[#F43F5E]" iconBorder="border-[#F43F5E]/25" />

        <div className="space-y-3">
          <SettingRow label="Global Multi-Factor Auth (2FA)" description="Mandatory 2FA enforcement for all laboratory personnel" on={mfaEnabled}      onChange={() => setMfaEnabled(s=>!s)}      accent="#F43F5E" />
          <SettingRow label="Audit Logging"                  description="Track all user actions and data access events"         on={auditLog}          onChange={() => setAuditLog(s=>!s)}          accent="#F43F5E" />
          <SettingRow label="IP Whitelisting"                description="Restrict portal access to approved IP addresses only" on={ipWhitelist}       onChange={() => setIpWhitelist(s=>!s)}       accent="#F43F5E" />
          <SettingRow label="Data Encryption at Rest"        description="AES-256 encryption for all stored patient data"       on={dataEncryption}    onChange={() => setDataEncryption(s=>!s)}    accent="#F43F5E" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Session Inactivity Timeout (min)">
            <input type="number" className={FB} value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)} />
          </Field>
          <Field label="Report Access Token Life">
            <select className={FB} value={tokenLife} onChange={e => setTokenLife(e.target.value)}>
              {['7-Day Clinical Window','30-Day Storage Window','90-Day Archive','Permanent Archival Access'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </Field>
        </div>

        {/* API Key */}
        <Card className="p-5">
          <p className="text-[10px] font-black text-white/35 uppercase tracking-widest mb-4">API Access Key</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-[#0D1829]/80 border border-white/[0.07] rounded-xl px-4 py-3 font-mono text-[11px] text-white/60 tracking-wider overflow-hidden">
              {apiKeyVisible ? apiKey : '•'.repeat(apiKey.length)}
            </div>
            <button onClick={() => setApiKeyVisible(s=>!s)} className="px-3 py-2.5 rounded-xl text-[9px] font-bold bg-white/[0.04] border border-white/[0.07] text-white/40 hover:text-white transition-all">{apiKeyVisible ? 'Hide' : 'Show'}</button>
            <button onClick={() => { navigator.clipboard.writeText(apiKey); showToast('✓ API key copied'); }}
              className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"><CopyIco /></button>
            <button onClick={() => showToast('✓ New API key generated')}
              className="w-9 h-9 rounded-xl bg-[#F43F5E]/10 border border-[#F43F5E]/20 flex items-center justify-center text-[#F43F5E] hover:bg-[#F43F5E]/20 transition-all"><RefreshIco /></button>
          </div>
          <p className="text-[8px] text-white/20 mt-2">Keep this key secure. Regenerating will invalidate all existing integrations.</p>
        </Card>

        {/* Audit Log */}
        {auditLog && (
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black text-white/35 uppercase tracking-widest">Recent Audit Events</p>
              <button onClick={() => showToast('✓ Full audit log exported')}
                className="text-[9px] font-bold text-[#6366F1] hover:text-[#A5B4FC] transition-colors">Export Log</button>
            </div>
            <div className="relative border-l-2 border-white/[0.07] ml-3 space-y-4">
              {[
                { msg:'Dr. Sarah Smith accessed Patient #4022 High-Risk File', time:'Today, 14:02', c:'#10B981' },
                { msg:'Amit Patel changed role of Priya Mehta to Operator',    time:'Today, 09:30', c:'#6366F1' },
                { msg:'System: 3 Failed Login Attempts — Admin Account',       time:'May 26, 23:45', c:'#F43F5E' },
                { msg:'API key regenerated by Dr. Rahul Sharma',               time:'May 25, 11:00', c:'#F59E0B' },
                { msg:'New user Suresh Raina added by Amit Patel',             time:'May 24, 09:00', c:'#06B6D4' },
              ].map((e, i) => (
                <div key={i} className="relative pl-5">
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-[#0D1829]" style={{background:e.c}} />
                  <p className="text-[11px] font-medium text-white/60">{e.msg}</p>
                  <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-0.5">{e.time}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  };

  const renderNotifications = () => (
    <div className="space-y-6">
      <SectionHeader title="Notification Rules" subtitle="Channels, triggers & escalation policy" icon={<BellIco />} iconBg="bg-[#8B5CF6]/15" iconText="text-[#8B5CF6]" iconBorder="border-[#8B5CF6]/25" />

      {/* Channels */}
      <Card className="p-5">
        <p className="text-[10px] font-black text-white/35 uppercase tracking-widest mb-4">Delivery Channels</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { l:'Email',         desc:'SMTP via SendGrid',          on:emailChannel, set:setEmailChannel, color:'#6366F1' },
            { l:'SMS',           desc:'Twilio / Fast2SMS',          on:smsChannel,   set:setSmsChannel,   color:'#10B981' },
            { l:'Push (In-App)', desc:'Browser + Mobile push',      on:pushChannel,  set:setPushChannel,  color:'#8B5CF6' },
          ].map((c, i) => (
            <div key={i} className={`p-4 rounded-xl border transition-all ${c.on ? `border-[${c.color}]/30 bg-[${c.color}]/[0.06]` : 'border-white/[0.06] bg-white/[0.02]'}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[12px] font-bold text-white">{c.l}</p>
                <Toggle on={c.on} onChange={() => c.set((s:boolean)=>!s)} accent={c.color} />
              </div>
              <p className="text-[9px] text-white/30">{c.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Triggers */}
      <Card className="p-5">
        <p className="text-[10px] font-black text-white/35 uppercase tracking-widest mb-4">Notification Triggers</p>
        <div className="space-y-2.5">
          {[
            { l:'Report Ready',         d:'Alert patient when diagnostic report is finalized',       on:reportReady,  set:setReportReady,  c:'#10B981' },
            { l:'New Order Received',   d:'Notify lab manager on each new order submission',        on:newOrder,     set:setNewOrder,     c:'#6366F1' },
            { l:'Urgent Order Alert',   d:'Immediate SMS/call for urgent/STAT orders',             on:urgentAlert,  set:setUrgentAlert,  c:'#F43F5E' },
            { l:'Staff Absent Alert',   d:'Notify admin when staff mark absent on assigned shift', on:staffAbsent,  set:setStaffAbsent,  c:'#F59E0B' },
            { l:'Payment Due Reminder', d:'Remind B2B clients of pending invoices every 7 days',  on:paymentDue,   set:setPaymentDue,   c:'#F59E0B' },
            { l:'Certification Expiry', d:'Alert 30 days before any staff certificate expires',   on:certExpiry,   set:setCertExpiry,   c:'#8B5CF6' },
          ].map((t, i) => (
            <div key={i} className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/[0.05] rounded-xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{background:t.c}} />
                  <p className="text-[12px] font-bold text-white/80">{t.l}</p>
                </div>
                <p className="text-[9px] text-white/30 mt-0.5 ml-3.5">{t.d}</p>
              </div>
              <Toggle on={t.on} onChange={() => t.set((s:boolean)=>!s)} accent={t.c} />
            </div>
          ))}
        </div>
      </Card>

      {/* Email Template */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-black text-white/35 uppercase tracking-widest">Email Template Config</p>
          <button onClick={() => showToast('✓ Template preview opened')}
            className="px-3.5 py-1.5 rounded-xl text-[9px] font-bold bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#C4B5FD] hover:bg-[#8B5CF6]/20 transition-all">
            Preview
          </button>
        </div>
        <div className="space-y-3">
          <Field label="From Name">
            <input type="text" className={FB} defaultValue="TrueTestLabs Diagnostics" />
          </Field>
          <Field label="Reply-To Email">
            <input type="email" className={FB} defaultValue="noreply@truetest.com" />
          </Field>
          <Field label="Email Footer Text">
            <textarea rows={2} className={`${FB} resize-none`} defaultValue="© 2026 TrueTestLabs · Authorized Clinical Record · All reports are digitally signed and legally valid." />
          </Field>
        </div>
      </Card>
    </div>
  );

  const CONTENT: Record<SettingsTab, () => React.ReactNode> = {
    general:       renderGeneral,
    appearance:    renderAppearance,
    operations:    renderOperations,
    clinical:      renderClinical,
    billing:       renderBilling,
    security:      renderSecurity,
    notifications: renderNotifications,
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
      <div className="p-4 sm:p-6 pb-3">
        <div className="bg-[#162035]/85 backdrop-blur-md border border-white/[0.07] rounded-[22px] shadow-xl relative overflow-hidden p-5">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6366F1]/30 to-transparent" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#6366F1]/20 to-[#10B981]/10 border border-[#6366F1]/25 flex items-center justify-center text-[#6366F1] shrink-0">
                <SettingsIco />
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight">Control Center</h1>
                <p className="text-[9px] font-medium text-white/35 uppercase tracking-[0.15em] mt-0.5">Global Configuration & Admin Policy Hub</p>
              </div>
            </div>
            <button onClick={handleSave} disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#6366F1] to-[#10B981] text-white rounded-xl text-[11px] font-bold shadow-[0_0_18px_rgba(99,102,241,0.3)] hover:opacity-90 transition-all disabled:opacity-60 relative overflow-hidden group shrink-0">
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {isSaving ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              ) : <SaveIco />}
              {isSaving ? 'Saving…' : 'Save Configuration'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Layout ──────────────────────────────────────────────────────── */}
      <div className="flex-1 px-4 sm:px-6 pb-12 flex gap-4 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-56 shrink-0 flex flex-col gap-1 bg-[#162035]/85 backdrop-blur-md border border-white/[0.07] rounded-[22px] shadow-xl p-3 overflow-y-auto scrollbar-none relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <p className="px-3 py-2 text-[7px] font-black text-white/25 uppercase tracking-[0.25em]">Configuration</p>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-[10px] font-bold transition-all text-left ${
                activeTab === tab.id
                  ? 'bg-white/[0.08] text-white border border-white/[0.08]'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
              }`}>
              <span className={`transition-all shrink-0 ${activeTab === tab.id ? '' : 'opacity-50'}`} style={{color: activeTab === tab.id ? tab.accent : undefined}}>
                {tab.icon}
              </span>
              <span className="uppercase tracking-widest">{tab.label}</span>
              {activeTab === tab.id && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full shrink-0" style={{background: tab.accent}} />
              )}
            </button>
          ))}

          <div className="mt-auto pt-3 border-t border-white/[0.05]">
            <div className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-center">
              <p className="text-[7px] font-black text-white/20 uppercase tracking-widest mb-1">Version</p>
              <p className="text-[10px] font-bold text-white/40">v2.5.0 · Stable</p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-[#162035]/85 backdrop-blur-md border border-white/[0.07] rounded-[22px] shadow-xl p-5 sm:p-7 overflow-y-auto scrollbar-none relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="max-w-3xl">
            {CONTENT[activeTab]?.()}
          </div>
        </main>
      </div>
    </div>
  );
}
