"use client";

import React, { useState, useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';

// ─── Inline Icons ──────────────────────────────────────────────────────────────
const Ico = ({ d, size = 16, sw = 1.8 }: { d: string; size?: number; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const UsersIco    = () => <Ico d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />;
const PlusIco     = () => <Ico d="M12 5v14M5 12h14" />;
const EditIco     = () => <Ico d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />;
const TrashIco    = () => <Ico d="M3 6h18 M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6 M10 11v6 M14 11v6 M9 6V4h6v2" />;
const PhoneIco    = () => <Ico d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.1 3.37a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />;
const MailIco     = () => <Ico d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" />;
const ClockIco    = () => <Ico d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2" />;
const StarIco     = ({ filled }: { filled: boolean }) => (
  <svg width="12" height="12" viewBox="0 0 20 20" fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor" strokeWidth={filled ? 0 : 1.5}>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);
const ShieldIco   = () => <Ico d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const AlertIco    = () => <Ico d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01" />;
const CalIco      = () => <Ico d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M16 2v4 M8 2v4 M3 10h18" />;
const VideoIco    = () => <Ico d="M23 7l-7 5 7 5V7z M1 5h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H1a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />;
const BroadcastIco= () => <Ico d="M18 8.94A5.002 5.002 0 0 0 12 4a5.002 5.002 0 0 0-6 4.94M21 12a9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9 9 9 0 0 1 9 9z M12 12h.01" />;
const CheckIco    = () => <Ico d="M20 6L9 17l-5-5" />;
const XCircleIco  = () => <Ico d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M15 9l-6 6 M9 9l6 6" />;
const UserIco     = () => <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />;
const ExportIco   = () => <Ico d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />;
const EyeIco      = () => <Ico d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0" />;

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = 'Directory' | 'Scheduling' | 'Performance' | 'Compliance' | 'Leave' | 'Communication';
type StaffRole = 'All' | 'Pathologist' | 'Technician' | 'Phlebotomist' | 'Admin';
type DutyStatus = 'on-duty' | 'away' | 'off-duty';
type LeaveStatus = 'pending' | 'approved' | 'rejected';

interface StaffMember {
  id: number; name: string; role: Exclude<StaffRole, 'All'>; registrationNo: string;
  specialization: string; status: DutyStatus; shift: string; contributions: string;
  email: string; phone: string; performanceRating: number; joinDate: string;
  department: string; testsThisMonth: number;
}

interface LeaveRequest {
  id: number; staffId: number; staffName: string; type: string;
  from: string; to: string; reason: string; status: LeaveStatus;
}

// ─── Role config ───────────────────────────────────────────────────────────────
const ROLE_COLORS: Record<string, { bg: string; text: string; border: string; grad: string }> = {
  'Pathologist': { bg: 'bg-[#6366F1]/15', text: 'text-[#A5B4FC]', border: 'border-[#6366F1]/25', grad: 'from-[#6366F1] to-[#818CF8]' },
  'Technician':  { bg: 'bg-[#10B981]/15', text: 'text-[#6EE7B7]', border: 'border-[#10B981]/25', grad: 'from-[#10B981] to-[#34D399]' },
  'Phlebotomist':{ bg: 'bg-[#06B6D4]/15', text: 'text-[#67E8F9]', border: 'border-[#06B6D4]/25', grad: 'from-[#06B6D4] to-[#38BDF8]' },
  'Admin':       { bg: 'bg-[#F59E0B]/15', text: 'text-[#FCD34D]', border: 'border-[#F59E0B]/25', grad: 'from-[#F59E0B] to-[#FCD34D]' },
};
const STATUS_STYLE: Record<DutyStatus, string> = {
  'on-duty': 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/25',
  'away':    'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/25',
  'off-duty':'bg-white/[0.05] text-white/40 border-white/10',
};
const LEAVE_STYLE: Record<LeaveStatus, string> = {
  pending:  'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/25',
  approved: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/25',
  rejected: 'bg-[#F43F5E]/10 text-[#F43F5E] border-[#F43F5E]/25',
};

// ─── Reusable components ───────────────────────────────────────────────────────
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#162035]/85 backdrop-blur-md border border-white/[0.07] rounded-[22px] shadow-xl relative overflow-hidden ${className}`}>
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    {children}
  </div>
);

const InitialsAvatar = ({ name, role }: { name: string; role: string }) => {
  const rc = ROLE_COLORS[role] || ROLE_COLORS['Admin'];
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${rc.grad} flex items-center justify-center text-white text-[10px] font-black shrink-0`}>
      {initials}
    </div>
  );
};

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5 text-[#F59E0B]">
    {[1,2,3,4,5].map(s => <StarIco key={s} filled={s <= Math.round(rating)} />)}
  </div>
);

const FieldBase = "w-full bg-[#0D1829] border border-white/[0.08] rounded-2xl px-4 py-3 text-[13px] font-medium text-white placeholder:text-white/25 focus:outline-none focus:border-[#6366F1]/50 focus:ring-2 focus:ring-[#6366F1]/10 transition-all";
const LabelBase = "text-[9px] font-black text-white/40 uppercase tracking-[0.2em]";

// ─── Add / Edit Staff Modal ────────────────────────────────────────────────────
const StaffModal = ({ mode, member, onClose, onSave }: {
  mode: 'add' | 'edit'; member?: StaffMember | null;
  onClose: () => void; onSave: (data: Partial<StaffMember>) => void;
}) => {
  const [form, setForm] = useState({
    name: member?.name || '', role: member?.role || 'Technician',
    registrationNo: member?.registrationNo || '', specialization: member?.specialization || '',
    email: member?.email || '', phone: member?.phone || '',
    shift: member?.shift || 'Morning (08:00 - 16:00)', status: member?.status || 'on-duty',
    department: member?.department || 'Lab', joinDate: member?.joinDate || new Date().toISOString().split('T')[0],
    contributions: member?.contributions || '', testsThisMonth: member?.testsThisMonth || 0,
    performanceRating: member?.performanceRating || 4.5,
  });
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#0F1629] border border-white/[0.09] rounded-[28px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-none relative" onClick={e => e.stopPropagation()}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6366F1]/40 to-transparent" />
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[17px] font-black text-white">{mode === 'add' ? 'Add Team Member' : 'Edit Staff Profile'}</h2>
              <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Fill in the details below</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.07] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.10] transition-all">
              <XCircleIco />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Full Name *', key: 'name', type: 'text', ph: 'Dr. John Smith' },
              { label: 'Registration No.', key: 'registrationNo', type: 'text', ph: 'MCI-XXXXX' },
              { label: 'Email Address *', key: 'email', type: 'email', ph: 'john@truetest.com' },
              { label: 'Phone Number *', key: 'phone', type: 'tel', ph: '+91 99999 00000' },
              { label: 'Specialization *', key: 'specialization', type: 'text', ph: 'Hematology' },
              { label: 'Department', key: 'department', type: 'text', ph: 'Core Lab' },
              { label: 'Join Date', key: 'joinDate', type: 'date' },
              { label: 'Contributions', key: 'contributions', type: 'text', ph: '120 Reports' },
            ].map(f => (
              <div key={f.key} className="space-y-1.5">
                <label className={LabelBase}>{f.label}</label>
                <input type={f.type} placeholder={f.ph} className={FieldBase}
                  value={(form as any)[f.key]} onChange={e => set(f.key, e.target.value)} />
              </div>
            ))}
            <div className="space-y-1.5">
              <label className={LabelBase}>Role *</label>
              <select className={FieldBase} value={form.role} onChange={e => set('role', e.target.value)}>
                {['Pathologist','Technician','Phlebotomist','Admin'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={LabelBase}>Shift *</label>
              <select className={FieldBase} value={form.shift} onChange={e => set('shift', e.target.value)}>
                {['Morning (08:00 - 16:00)','Evening (16:00 - 00:00)','Night (00:00 - 08:00)'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={LabelBase}>Status</label>
              <select className={FieldBase} value={form.status} onChange={e => set('status', e.target.value)}>
                {['on-duty','away','off-duty'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className={LabelBase}>Performance Rating</label>
              <input type="number" min="1" max="5" step="0.1" className={FieldBase}
                value={form.performanceRating} onChange={e => set('performanceRating', parseFloat(e.target.value))} />
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-5 border-t border-white/[0.06]">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl text-[11px] font-bold text-white/50 bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.08] transition-all">Cancel</button>
            <button onClick={() => onSave(form)}
              className="flex-1 py-3 rounded-xl text-[11px] font-bold bg-gradient-to-r from-[#6366F1] to-[#10B981] text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:opacity-90 transition-all relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {mode === 'add' ? '+ Add Member' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Staff Profile Drawer ──────────────────────────────────────────────────────
const ProfileDrawer = ({ member, onClose, onEdit }: { member: StaffMember; onClose: () => void; onEdit: () => void }) => {
  const rc = ROLE_COLORS[member.role] || ROLE_COLORS['Admin'];
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex justify-end" onClick={onClose}>
      <div className="w-full max-w-md bg-[#0F1629] border-l border-white/[0.08] h-full overflow-y-auto scrollbar-none shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={`p-6 bg-gradient-to-br ${rc.grad} relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,white,transparent)]" />
          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-[16px] font-black mb-3">
                {member.name.split(' ').map(n => n[0]).slice(0,2).join('')}
              </div>
              <h2 className="text-[17px] font-black text-white">{member.name}</h2>
              <p className="text-[11px] font-bold text-white/70 mt-0.5">{member.role} · {member.specialization}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-all">
              <XCircleIco />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Status */}
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${STATUS_STYLE[member.status]}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${member.status==='on-duty'?'bg-[#10B981] shadow-[0_0_5px_#10B981]':member.status==='away'?'bg-[#F59E0B]':'bg-white/30'}`} />
              {member.status}
            </span>
            <span className="text-[9px] font-bold text-white/30">{member.shift}</span>
          </div>

          {/* Contact */}
          <Card className="p-4 space-y-3">
            <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Contact Info</p>
            {[
              { icon: <MailIco />, val: member.email },
              { icon: <PhoneIco />, val: member.phone },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3 text-[12px] text-white/70">
                <span className="text-white/30">{c.icon}</span> {c.val}
              </div>
            ))}
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { l:'Reg. No.', v: member.registrationNo, c:'text-[#6366F1]' },
              { l:'Department', v: member.department, c:'text-[#10B981]' },
              { l:'Join Date', v: member.joinDate, c:'text-[#F59E0B]' },
              { l:'Tests/Month', v: member.testsThisMonth.toString(), c:'text-[#06B6D4]' },
            ].map((s, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3">
                <p className="text-[8px] font-black text-white/25 uppercase tracking-widest mb-1">{s.l}</p>
                <p className={`text-[13px] font-bold ${s.c}`}>{s.v || '—'}</p>
              </div>
            ))}
          </div>

          {/* Performance */}
          <Card className="p-4">
            <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-3">Performance</p>
            <div className="flex items-center justify-between">
              <Stars rating={member.performanceRating} />
              <span className="text-[15px] font-black text-[#F59E0B]">{member.performanceRating.toFixed(1)}</span>
            </div>
            <div className="mt-3">
              <p className="text-[9px] text-white/40">{member.contributions}</p>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button onClick={onEdit} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold bg-[#6366F1]/15 border border-[#6366F1]/25 text-[#A5B4FC] hover:bg-[#6366F1]/25 transition-all">
              <EditIco /> Edit Profile
            </button>
            <a href={`tel:${member.phone}`} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-bold bg-[#10B981]/15 border border-[#10B981]/25 text-[#6EE7B7] hover:bg-[#10B981]/25 transition-all">
              <PhoneIco />
            </a>
            <a href={`mailto:${member.email}`} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-bold bg-white/[0.05] border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.10] transition-all">
              <MailIco />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Confirm Delete Modal ──────────────────────────────────────────────────────
const DeleteModal = ({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-[#0F1629] border border-[#F43F5E]/20 rounded-[24px] p-8 max-w-sm w-full shadow-2xl text-center">
      <div className="w-14 h-14 bg-[#F43F5E]/10 border border-[#F43F5E]/20 rounded-2xl flex items-center justify-center text-[#F43F5E] mx-auto mb-4">
        <TrashIco />
      </div>
      <h3 className="text-[16px] font-black text-white mb-1">Remove Staff Member</h3>
      <p className="text-[11px] text-white/40 mb-6">Are you sure you want to remove <span className="text-white font-bold">{name}</span>? This action cannot be undone.</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-3 rounded-xl text-[11px] font-bold text-white/50 bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.08] transition-all">Cancel</button>
        <button onClick={onConfirm} className="flex-1 py-3 rounded-xl text-[11px] font-bold bg-[#F43F5E] text-white hover:opacity-90 transition-all shadow-[0_0_18px_rgba(244,63,94,0.3)]">Delete</button>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function StaffPage() {
  const { globalSearchQuery, setGlobalSearchQuery } = useDashboard();
  const [activeTab, setActiveTab] = useState<Tab>('Directory');
  const [filterRole, setFilterRole] = useState<StaffRole>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | DutyStatus>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [editTarget, setEditTarget] = useState<StaffMember | null>(null);
  const [drawerMember, setDrawerMember] = useState<StaffMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StaffMember | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [broadcastSent, setBroadcastSent] = useState(false);

  React.useEffect(() => { setGlobalSearchQuery(""); }, [setGlobalSearchQuery]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const [staff, setStaff] = useState<StaffMember[]>([
    { id: 1, name: 'Dr. Rahul Sharma',  role: 'Pathologist',  registrationNo: 'MCI-82910',  specialization: 'Hematology',       status: 'on-duty',  shift: 'Morning (08:00 - 16:00)',  contributions: '142 Reports', email: 'rahul.s@truetest.com',  phone: '+91 98765 43210', performanceRating: 4.9, joinDate: '2022-03-01', department: 'Core Lab',   testsThisMonth: 142 },
    { id: 2, name: 'Ananya Verma',       role: 'Technician',   registrationNo: 'DMLT-1029',   specialization: 'Clinical Biochem', status: 'on-duty',  shift: 'Morning (08:00 - 16:00)',  contributions: '89 Tests',    email: 'ananya.v@truetest.com', phone: '+91 88776 65544', performanceRating: 4.7, joinDate: '2022-07-15', department: 'Biochem',    testsThisMonth: 89  },
    { id: 3, name: 'Vikram Singh',       role: 'Phlebotomist', registrationNo: 'CPT-5512',    specialization: 'Home Collection',  status: 'away',     shift: 'Evening (16:00 - 00:00)', contributions: '56 Samples',  email: 'vikram.s@truetest.com', phone: '+91 77665 54433', performanceRating: 4.8, joinDate: '2023-01-10', department: 'Field',      testsThisMonth: 56  },
    { id: 4, name: 'Dr. Sarah Smith',   role: 'Pathologist',  registrationNo: 'MCI-90123',   specialization: 'Microbiology',     status: 'off-duty', shift: 'Night (00:00 - 08:00)',   contributions: '210 Reports', email: 'sarah.s@truetest.com',  phone: '+91 66554 43322', performanceRating: 5.0, joinDate: '2021-05-20', department: 'Microbiology', testsThisMonth: 210 },
    { id: 5, name: 'Amit Patel',         role: 'Admin',        registrationNo: 'MHA-202',     specialization: 'Operations',       status: 'on-duty',  shift: 'Morning (08:00 - 16:00)',  contributions: 'Site Lead',   email: 'amit.p@truetest.com',   phone: '+91 55443 32211', performanceRating: 4.6, joinDate: '2020-11-01', department: 'Admin',      testsThisMonth: 0   },
    { id: 6, name: 'Priya Mehta',        role: 'Technician',   registrationNo: 'DMLT-4091',   specialization: 'Molecular Bio',    status: 'on-duty',  shift: 'Evening (16:00 - 00:00)', contributions: '124 Tests',   email: 'priya.m@truetest.com',  phone: '+91 44332 21100', performanceRating: 4.9, joinDate: '2023-02-14', department: 'Molecular',  testsThisMonth: 124 },
    { id: 7, name: 'Karan Malhotra',     role: 'Phlebotomist', registrationNo: 'CPT-8821',    specialization: 'Stat Collection',  status: 'on-duty',  shift: 'Morning (08:00 - 16:00)',  contributions: '42 Samples',  email: 'karan.m@truetest.com',  phone: '+91 99887 76655', performanceRating: 4.5, joinDate: '2023-06-01', department: 'Field',      testsThisMonth: 42  },
    { id: 8, name: 'Dr. Meena Iyer',    role: 'Pathologist',  registrationNo: 'MCI-11200',   specialization: 'Histopathology',   status: 'away',     shift: 'Morning (08:00 - 16:00)',  contributions: '75 Reports',  email: 'meena.i@truetest.com',  phone: '+91 88779 90011', performanceRating: 4.8, joinDate: '2022-09-05', department: 'Histopath',  testsThisMonth: 75  },
    { id: 9, name: 'Suresh Raina',       role: 'Technician',   registrationNo: 'DMLT-7728',   specialization: 'Immunology',       status: 'on-duty',  shift: 'Evening (16:00 - 00:00)', contributions: '110 Tests',   email: 'suresh.r@truetest.com', phone: '+91 77668 85544', performanceRating: 4.7, joinDate: '2023-03-28', department: 'Immunology', testsThisMonth: 110 },
  ]);

  const [leaves, setLeaves] = useState<LeaveRequest[]>([
    { id: 1, staffId: 3, staffName: 'Vikram Singh',     type: 'Casual Leave',   from: '2026-06-02', to: '2026-06-04', reason: 'Family event',             status: 'pending'  },
    { id: 2, staffId: 2, staffName: 'Ananya Verma',      type: 'Medical Leave',  from: '2026-06-10', to: '2026-06-12', reason: 'Medical procedure follow-up',status: 'approved' },
    { id: 3, staffId: 7, staffName: 'Karan Malhotra',   type: 'Earned Leave',   from: '2026-06-15', to: '2026-06-20', reason: 'Vacation',                  status: 'pending'  },
    { id: 4, staffId: 5, staffName: 'Amit Patel',        type: 'Casual Leave',   from: '2026-05-28', to: '2026-05-28', reason: 'Personal work',             status: 'rejected' },
  ]);

  // ── CRUD handlers ────────────────────────────────────────────────────────────
  const handleSave = (data: Partial<StaffMember>) => {
    if (modalMode === 'add') {
      const newMember: StaffMember = { ...data, id: Date.now() } as StaffMember;
      setStaff(prev => [newMember, ...prev]);
      showToast('✓ Team member added successfully');
    } else if (modalMode === 'edit' && editTarget) {
      setStaff(prev => prev.map(s => s.id === editTarget.id ? { ...s, ...data } : s));
      showToast('✓ Staff profile updated');
      if (drawerMember?.id === editTarget.id) setDrawerMember({ ...editTarget, ...data } as StaffMember);
    }
    setModalMode(null); setEditTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setStaff(prev => prev.filter(s => s.id !== deleteTarget.id));
    setDeleteTarget(null);
    if (drawerMember?.id === deleteTarget.id) setDrawerMember(null);
    showToast('Staff member removed');
  };

  const handleToggleStatus = (id: number) => {
    setStaff(prev => prev.map(s => {
      if (s.id !== id) return s;
      const next: DutyStatus = s.status === 'on-duty' ? 'away' : s.status === 'away' ? 'off-duty' : 'on-duty';
      return { ...s, status: next };
    }));
  };

  const handleLeaveAction = (id: number, action: 'approved' | 'rejected') => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: action } : l));
    showToast(action === 'approved' ? '✓ Leave approved' : '✗ Leave rejected');
  };

  // ── Filters ──────────────────────────────────────────────────────────────────
  const filteredStaff = useMemo(() => staff.filter(m => {
    const q = globalSearchQuery.toLowerCase();
    const matchSearch = m.name.toLowerCase().includes(q) || m.specialization.toLowerCase().includes(q) || m.registrationNo.toLowerCase().includes(q);
    const matchRole   = filterRole === 'All' || m.role === filterRole;
    const matchStatus = filterStatus === 'All' || m.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  }), [staff, globalSearchQuery, filterRole, filterStatus]);

  const totalPages        = Math.ceil(filteredStaff.length / itemsPerPage);
  const paginatedStaff    = filteredStaff.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ── KPI Stats ────────────────────────────────────────────────────────────────
  const onDutyCount  = staff.filter(s => s.status === 'on-duty').length;
  const awayCount    = staff.filter(s => s.status === 'away').length;
  const avgRating    = staff.length ? (staff.reduce((a, s) => a + s.performanceRating, 0) / staff.length).toFixed(1) : '—';
  const pendingLeaves = leaves.filter(l => l.status === 'pending').length;

  // ─── TAB CONTENT RENDERERS ────────────────────────────────────────────────────

  // ── DIRECTORY ────────────────────────────────────────────────────────────────
  const renderDirectory = () => (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <Card className="px-5 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            {(['All','Pathologist','Technician','Phlebotomist','Admin'] as StaffRole[]).map(r => (
              <button key={r} onClick={() => { setFilterRole(r); setCurrentPage(1); }}
                className={`px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${filterRole===r?'bg-[#6366F1] border-[#6366F1] text-white shadow-sm':'border-white/[0.07] text-white/40 hover:text-white/70 hover:border-white/20'}`}>
                {r}
              </button>
            ))}
          </div>
          <div className="flex gap-2 sm:ml-auto">
            {(['All','on-duty','away','off-duty'] as ('All'|DutyStatus)[]).map(s => (
              <button key={s} onClick={() => { setFilterStatus(s); setCurrentPage(1); }}
                className={`px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${filterStatus===s?'bg-[#10B981]/20 border-[#10B981]/40 text-[#10B981]':'border-white/[0.07] text-white/30 hover:text-white/60'}`}>
                {s}
              </button>
            ))}
          </div>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[9px] font-bold text-white/40 border border-white/[0.07] hover:text-white hover:bg-white/[0.05] transition-all">
            <ExportIco /> Export
          </button>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        {paginatedStaff.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 bg-white/[0.04] border border-white/[0.06] rounded-2xl flex items-center justify-center text-white/20"><UsersIco /></div>
            <p className="text-[12px] font-bold text-white/30">No staff members match your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-left min-w-[760px]">
              <thead className="border-b border-white/[0.06] bg-[#0D1829]/80 sticky top-0 z-10">
                <tr>
                  {['Personnel','Registration','Shift & Status','Performance','Tests/Mo','Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-[8px] font-black text-white/35 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedStaff.map((m, idx) => {
                  const rc = ROLE_COLORS[m.role] || ROLE_COLORS['Admin'];
                  return (
                    <tr key={m.id} className="group border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors cursor-pointer"
                      onClick={() => setDrawerMember(m)}>
                      {/* Personnel */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <InitialsAvatar name={m.name} role={m.role} />
                          <div>
                            <p className="text-[13px] font-semibold text-white">{m.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${rc.bg} ${rc.text} ${rc.border}`}>{m.role}</span>
                              <span className="text-[8px] text-white/25">{m.specialization}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      {/* Registration */}
                      <td className="px-5 py-4">
                        <p className="text-[11px] font-bold text-white/60">{m.registrationNo || '—'}</p>
                        <p className="text-[8px] text-white/25 mt-0.5 uppercase tracking-widest">{m.department}</p>
                      </td>
                      {/* Status & Shift */}
                      <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                        <div className="flex flex-col gap-1.5">
                          <button
                            onClick={() => handleToggleStatus(m.id)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all hover:scale-[1.03] ${STATUS_STYLE[m.status]}`}
                            title="Click to cycle status"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${m.status==='on-duty'?'bg-[#10B981] shadow-[0_0_4px_#10B981]':m.status==='away'?'bg-[#F59E0B]':'bg-white/30'}`} />
                            {m.status}
                          </button>
                          <p className="text-[8px] text-white/25 truncate max-w-[130px]">{m.shift}</p>
                        </div>
                      </td>
                      {/* Rating */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Stars rating={m.performanceRating} />
                          <span className="text-[11px] font-black text-[#F59E0B]">{m.performanceRating.toFixed(1)}</span>
                        </div>
                      </td>
                      {/* Tests */}
                      <td className="px-5 py-4">
                        <p className="text-[13px] font-bold text-white">{m.testsThisMonth || '—'}</p>
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setDrawerMember(m)} title="View Profile"
                            className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.10] transition-all"><EyeIco /></button>
                          <button onClick={() => { setEditTarget(m); setModalMode('edit'); }} title="Edit"
                            className="w-8 h-8 rounded-xl bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center text-[#6366F1] hover:bg-[#6366F1]/20 transition-all"><EditIco /></button>
                          <button onClick={() => setDeleteTarget(m)} title="Delete"
                            className="w-8 h-8 rounded-xl bg-[#F43F5E]/10 border border-[#F43F5E]/20 flex items-center justify-center text-[#F43F5E] hover:bg-[#F43F5E]/20 transition-all"><TrashIco /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredStaff.length > itemsPerPage && (
          <div className="px-5 py-4 border-t border-white/[0.05] flex items-center justify-between">
            <p className="text-[9px] font-bold text-white/25 uppercase tracking-widest">
              {(currentPage-1)*itemsPerPage+1}–{Math.min(currentPage*itemsPerPage,filteredStaff.length)} of {filteredStaff.length}
            </p>
            <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] p-1 rounded-xl">
              <button disabled={currentPage===1} onClick={() => setCurrentPage(p=>p-1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 transition-all">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i+1)}
                  className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all ${currentPage===i+1?'bg-[#6366F1] text-white':'text-white/30 hover:text-white hover:bg-white/[0.06]'}`}>
                  {i+1}
                </button>
              ))}
              <button disabled={currentPage===totalPages||totalPages===0} onClick={() => setCurrentPage(p=>p+1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 transition-all">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  // ── SCHEDULING ────────────────────────────────────────────────────────────────
  const renderScheduling = () => {
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const dates = [26,27,28,29,30,31,1];
    const SHIFTS = [
      { label:'Morning', time:'08:00–16:00', color:'text-[#10B981]', bg:'bg-[#10B981]/[0.06] border-[#10B981]/15' },
      { label:'Evening', time:'16:00–00:00', color:'text-[#06B6D4]', bg:'bg-[#06B6D4]/[0.06] border-[#06B6D4]/15' },
      { label:'Night',   time:'00:00–08:00', color:'text-[#8B5CF6]', bg:'bg-[#8B5CF6]/[0.06] border-[#8B5CF6]/15' },
    ];
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { l:'Total Shifts', v:'124', c:'#10B981', note:'100% Coverage' },
            { l:'Under-Staffed', v:'2', c:'#F59E0B', note:'Fri Eve, Sun Night' },
            { l:'On-Call',      v:'4', c:'#6366F1', note:'Active Rotation' },
            { l:'Approved PTO', v:'3', c:'#06B6D4', note:'This Week' },
          ].map((k,i) => (
            <Card key={i} className="p-5">
              <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">{k.l}</p>
              <p className="text-2xl font-black mb-1" style={{color:k.c}}>{k.v}</p>
              <p className="text-[9px] text-white/30">{k.note}</p>
            </Card>
          ))}
        </div>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[15px] font-black text-white">Weekly Schedule</h3>
              <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-0.5">May 26 – Jun 1, 2026</p>
            </div>
            <button className="px-4 py-2 rounded-xl text-[10px] font-bold text-white/40 bg-white/[0.04] border border-white/[0.07] hover:text-white transition-colors">
              ← Prev Week
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => (
              <div key={day} className="flex flex-col gap-2">
                <div className={`p-2.5 rounded-xl text-center ${idx === 4 ? 'bg-[#F43F5E]/15 border border-[#F43F5E]/25' : 'bg-white/[0.03] border border-white/[0.06]'}`}>
                  <p className="text-[9px] font-black text-white/60 uppercase">{day}</p>
                  <p className="text-[11px] font-bold text-white mt-0.5">{dates[idx]}</p>
                </div>
                {SHIFTS.map(shift => (
                  <div key={shift.label} className={`border ${shift.bg} rounded-xl p-2`}>
                    <p className={`text-[7px] font-black uppercase tracking-widest ${shift.color} mb-1.5`}>{shift.time}</p>
                    {staff.filter(s => s.shift.startsWith(shift.label)).slice(0, 2).map(s => (
                      <div key={s.id} className="flex items-center justify-between bg-[#0D1829]/60 px-1.5 py-1 rounded-lg border border-white/[0.04] mb-1">
                        <span className="text-[8px] font-bold text-white/70 truncate">{s.name.split(' ')[0]}</span>
                        <span className={`text-[6px] font-black px-1 rounded ${ROLE_COLORS[s.role]?.bg} ${ROLE_COLORS[s.role]?.text}`}>{s.role.substring(0,3).toUpperCase()}</span>
                      </div>
                    ))}
                    {idx === 4 && shift.label === 'Evening' && (
                      <div className="text-[7px] font-black text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20 px-1.5 py-1 rounded-lg">⚠ Need Phleb</div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  // ── PERFORMANCE ────────────────────────────────────────────────────────────────
  const renderPerformance = () => {
    const sorted = [...staff].sort((a, b) => b.performanceRating - a.performanceRating);
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { l:'Avg Tests/Shift', v:'184', t:'+12%', c:'#10B981', bar:78 },
            { l:'Error / Rejection', v:'0.8%', t:'-0.2%', c:'#F59E0B', bar:8 },
            { l:'Attendance',      v:'98.5%', t:'Target 95%', c:'#06B6D4', bar:98 },
          ].map((k,i) => (
            <Card key={i} className="p-5">
              <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">{k.l}</p>
              <div className="flex items-end gap-2 mb-3">
                <p className="text-3xl font-black text-white">{k.v}</p>
                <p className="text-[11px] font-bold mb-1" style={{color:k.c}}>{k.t}</p>
              </div>
              <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{width:`${k.bar}%`, background:k.c}} />
              </div>
            </Card>
          ))}
        </div>

        {/* Leaderboard */}
        <Card className="p-5">
          <h3 className="text-[15px] font-black text-white mb-0.5">Performance Leaderboard</h3>
          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-5">Ranked by rating & contributions</p>
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Rank','Name','Role','Rating','Tests/Mo','Satisfaction','TAT'].map(h => (
                    <th key={h} className="px-4 py-3 text-[8px] font-black text-white/30 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((s, i) => (
                  <tr key={s.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-black ${i===0?'bg-[#F59E0B]/20 text-[#F59E0B]':i===1?'bg-white/10 text-white/60':i===2?'bg-[#06B6D4]/10 text-[#06B6D4]':'bg-transparent text-white/30'}`}>
                        #{i+1}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <InitialsAvatar name={s.name} role={s.role} />
                        <div>
                          <p className="text-[12px] font-semibold text-white">{s.name}</p>
                          <p className="text-[8px] text-white/30">{s.specialization}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${ROLE_COLORS[s.role]?.bg} ${ROLE_COLORS[s.role]?.text} ${ROLE_COLORS[s.role]?.border}`}>{s.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Stars rating={s.performanceRating} />
                        <span className="text-[11px] font-black text-[#F59E0B]">{s.performanceRating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] font-bold text-white">{s.testsThisMonth}</td>
                    <td className="px-4 py-3 text-[12px] font-bold text-[#10B981]">4.{Math.floor(7+Math.random()*2)}/5</td>
                    <td className="px-4 py-3 text-[12px] font-bold text-[#06B6D4]">{3+Math.floor(Math.random()*3)}h {Math.floor(Math.random()*59)}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  // ── COMPLIANCE ────────────────────────────────────────────────────────────────
  const renderCompliance = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-7 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[15px] font-black text-white">Certifications & Due Dates</h3>
              <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Staff compliance tracking</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center text-[#6366F1]">
              <ShieldIco />
            </div>
          </div>
          <div className="space-y-3">
            {[
              { name:'Dr. Rahul Sharma',  cert:'NABL Internal Auditor',       expires:'2026-06-15', status:'warning' },
              { name:'Ananya Verma',       cert:'Phlebotomy Standard Protocol', expires:'2026-05-12', status:'expired' },
              { name:'Priya Mehta',        cert:'Biohazard Safety Level 2',     expires:'2027-01-20', status:'valid'   },
              { name:'Dr. Sarah Smith',   cert:'ISO 15189 Quality Management', expires:'2026-08-10', status:'valid'   },
              { name:'Karan Malhotra',    cert:'CPT Certification',            expires:'2026-09-30', status:'valid'   },
            ].map((c,i) => (
              <div key={i} className={`px-4 py-3.5 rounded-xl border flex items-center justify-between ${
                c.status==='expired'?'bg-[#F43F5E]/[0.07] border-[#F43F5E]/20':
                c.status==='warning'?'bg-[#F59E0B]/[0.07] border-[#F59E0B]/20':
                'bg-white/[0.03] border-white/[0.06]'
              }`}>
                <div>
                  <p className="text-[12px] font-bold text-white">{c.cert}</p>
                  <p className="text-[9px] text-white/40 mt-0.5">{c.name} · Expires {c.expires}</p>
                </div>
                <span className={`text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${
                  c.status==='expired'?'bg-[#F43F5E] text-white':
                  c.status==='warning'?'bg-[#F59E0B] text-[#1A0F00]':
                  'bg-[#10B981] text-white'
                }`}>
                  {c.status==='expired'?'Expired':c.status==='warning'?'Expiring Soon':'Valid'}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5">
            <h3 className="text-[15px] font-black text-white mb-4">Audit Log</h3>
            <div className="relative border-l-2 border-white/[0.07] ml-3 space-y-5">
              {[
                { text:'Dr. Sarah Smith accessed Patient #4022 High-Risk File', time:'Today, 14:02', color:'#10B981' },
                { text:'Amit Patel uploaded New NABL Guidelines Document', time:'Yesterday, 09:15', color:'#06B6D4' },
                { text:'System: 3 Failed Login Attempts — Admin Account', time:'May 12, 23:45', color:'#F59E0B' },
                { text:'Priya Mehta completed Biohazard Safety Retraining', time:'May 10, 11:00', color:'#6366F1' },
              ].map((e, i) => (
                <div key={i} className="relative pl-6">
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-[#162035]" style={{background:e.color}} />
                  <p className="text-[11px] font-medium text-white/70">{e.text}</p>
                  <p className="text-[8px] font-bold text-white/25 uppercase tracking-widest mt-1">{e.time}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-[15px] font-black text-white mb-4">Compliance Score</h3>
            {[
              { l:'NABL Readiness', pct:94, c:'#10B981' },
              { l:'ISO 15189',      pct:100, c:'#6366F1' },
              { l:'Staff Training', pct:82, c:'#F59E0B' },
            ].map(m => (
              <div key={m.l} className="mb-3">
                <div className="flex justify-between text-[9px] font-bold text-white/50 mb-1.5 uppercase tracking-widest">
                  <span>{m.l}</span><span>{m.pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{width:`${m.pct}%`, background:m.c}} />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );

  // ── LEAVE MANAGEMENT ──────────────────────────────────────────────────────────
  const renderLeave = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { l:'Pending',  v: leaves.filter(l=>l.status==='pending').length,  c:'#F59E0B' },
          { l:'Approved', v: leaves.filter(l=>l.status==='approved').length, c:'#10B981' },
          { l:'Rejected', v: leaves.filter(l=>l.status==='rejected').length, c:'#F43F5E' },
          { l:'Total',    v: leaves.length,                                   c:'#6366F1' },
        ].map((k,i) => (
          <Card key={i} className="p-5">
            <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">{k.l} Leaves</p>
            <p className="text-3xl font-black" style={{color:k.c}}>{k.v}</p>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[15px] font-black text-white">Leave Requests</h3>
          <button
            onClick={() => showToast('Leave request form coming soon')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold bg-[#6366F1]/15 border border-[#6366F1]/25 text-[#A5B4FC] hover:bg-[#6366F1]/25 transition-all"
          >
            <PlusIco /> New Request
          </button>
        </div>
        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Staff Member','Leave Type','From','To','Reason','Status','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-[8px] font-black text-white/30 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaves.map((l, i) => {
                const member = staff.find(s => s.id === l.staffId);
                return (
                  <tr key={l.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      {member ? (
                        <div className="flex items-center gap-2">
                          <InitialsAvatar name={member.name} role={member.role} />
                          <div>
                            <p className="text-[11px] font-bold text-white">{member.name}</p>
                            <p className="text-[8px] text-white/30">{member.role}</p>
                          </div>
                        </div>
                      ) : <span className="text-white/40">{l.staffName}</span>}
                    </td>
                    <td className="px-4 py-3 text-[11px] font-bold text-white/60">{l.type}</td>
                    <td className="px-4 py-3 text-[11px] text-white/60">{l.from}</td>
                    <td className="px-4 py-3 text-[11px] text-white/60">{l.to}</td>
                    <td className="px-4 py-3 text-[10px] text-white/40 max-w-[140px] truncate">{l.reason}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border ${LEAVE_STYLE[l.status]}`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {l.status === 'pending' && (
                        <div className="flex gap-1.5">
                          <button onClick={() => handleLeaveAction(l.id, 'approved')}
                            className="w-7 h-7 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981] hover:bg-[#10B981]/20 transition-all">
                            <CheckIco />
                          </button>
                          <button onClick={() => handleLeaveAction(l.id, 'rejected')}
                            className="w-7 h-7 rounded-lg bg-[#F43F5E]/10 border border-[#F43F5E]/20 flex items-center justify-center text-[#F43F5E] hover:bg-[#F43F5E]/20 transition-all">
                            <XCircleIco />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  // ── COMMUNICATION ─────────────────────────────────────────────────────────────
  const renderCommunication = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => { setBroadcastSent(true); showToast('🚨 Emergency alert broadcasted to all staff!'); setTimeout(()=>setBroadcastSent(false), 3000); }}
          className="bg-[#F43F5E]/[0.07] border-2 border-[#F43F5E]/20 hover:bg-[#F43F5E]/15 hover:border-[#F43F5E]/35 transition-all rounded-[22px] p-8 flex flex-col items-center justify-center gap-4 group relative overflow-hidden"
        >
          {broadcastSent && <div className="absolute inset-0 bg-[#F43F5E]/10 animate-ping rounded-[22px]" />}
          <div className="w-14 h-14 bg-[#F43F5E]/15 border border-[#F43F5E]/25 rounded-2xl flex items-center justify-center text-[#F43F5E] group-hover:scale-110 transition-transform relative z-10">
            <BroadcastIco />
          </div>
          <div className="text-center relative z-10">
            <h3 className="text-[15px] font-black text-[#F43F5E]">Broadcast Emergency Alert</h3>
            <p className="text-[10px] font-medium text-white/40 mt-1">Push high-priority SMS/App notifications to all active staff instantly</p>
          </div>
        </button>

        <button
          onClick={() => showToast('✓ Shift change request sent to all phlebotomists')}
          className="bg-[#10B981]/[0.07] border-2 border-[#10B981]/20 hover:bg-[#10B981]/15 hover:border-[#10B981]/35 transition-all rounded-[22px] p-8 flex flex-col items-center justify-center gap-4 group"
        >
          <div className="w-14 h-14 bg-[#10B981]/15 border border-[#10B981]/25 rounded-2xl flex items-center justify-center text-[#10B981] group-hover:scale-110 transition-transform">
            <CalIco />
          </div>
          <div className="text-center">
            <h3 className="text-[15px] font-black text-[#10B981]">Send Shift Change Request</h3>
            <p className="text-[10px] font-medium text-white/40 mt-1">Automate coverage requests for sick leaves and understaffed slots</p>
          </div>
        </button>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-[15px] font-black text-white">Training Video Library</h3>
            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Staff education & protocol resources</p>
          </div>
          <button
            onClick={() => showToast('✓ Upload dialog opened')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold bg-[#6366F1]/15 border border-[#6366F1]/25 text-[#A5B4FC] hover:bg-[#6366F1]/25 transition-all"
          >
            <PlusIco /> Upload Video
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title:'New Sysmex Analyzer Operations', duration:'12:45', author:'Dr. Sharma', views:42 },
            { title:'Biohazard Level 3 Protocol 2026', duration:'24:10', author:'Safety Dept', views:89 },
            { title:'Customer Experience Guidelines', duration:'08:30', author:'HR Dept', views:63 },
          ].map((v, i) => (
            <div key={i} className="group cursor-pointer" onClick={() => showToast(`▶ Playing: ${v.title}`)}>
              <div className="w-full h-36 bg-[#0D1829]/80 rounded-2xl border border-white/[0.06] flex items-center justify-center relative overflow-hidden group-hover:border-[#10B981]/30 transition-all mb-3">
                <div className="absolute inset-0 bg-gradient-to-br from-[#162035] to-[#0D1829]" />
                <div className="w-12 h-12 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center pl-1 text-white z-10 group-hover:scale-110 group-hover:bg-[#10B981] group-hover:border-transparent transition-all">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                </div>
                <span className="absolute bottom-2.5 right-2.5 bg-black/70 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest z-10">{v.duration}</span>
                <span className="absolute top-2.5 left-2.5 bg-[#10B981]/15 border border-[#10B981]/25 text-[#10B981] text-[7px] font-black px-1.5 py-0.5 rounded uppercase z-10">{v.views} views</span>
              </div>
              <p className="text-[12px] font-bold text-white/80 group-hover:text-[#10B981] transition-colors">{v.title}</p>
              <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">By {v.author}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const tabs: { id: Tab; icon: React.ReactNode }[] = [
    { id:'Directory',    icon:<UsersIco /> },
    { id:'Scheduling',   icon:<CalIco /> },
    { id:'Performance',  icon:<StarIco filled={true} /> },
    { id:'Compliance',   icon:<ShieldIco /> },
    { id:'Leave',        icon:<AlertIco /> },
    { id:'Communication',icon:<BroadcastIco /> },
  ];

  // ── RENDER ────────────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 flex flex-col min-h-full page-transition">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] bg-[#162035] border border-white/[0.12] shadow-2xl rounded-2xl px-5 py-3 text-[12px] font-bold text-white animate-[fadeIn_0.3s_ease] flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />{toast}
        </div>
      )}

      {/* ── Control Panel ────────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-6 pb-3">
        <Card className="p-5">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6366F1]/30 to-transparent" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#6366F1]/20 to-[#10B981]/10 border border-[#6366F1]/25 flex items-center justify-center text-[#6366F1] shrink-0">
                <UsersIco />
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight">Team Directory</h1>
                <p className="text-[9px] font-medium text-white/35 uppercase tracking-[0.15em] mt-0.5">Laboratory Staff & Role Management Hub</p>
              </div>
            </div>
            <button
              onClick={() => setModalMode('add')}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#6366F1] to-[#10B981] text-white rounded-xl text-[11px] font-bold shadow-[0_0_18px_rgba(99,102,241,0.3)] hover:opacity-90 transition-all relative overflow-hidden group shrink-0"
            >
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <PlusIco /> Add Team Member
            </button>
          </div>

          {/* KPI Mini Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {[
              { l:'Total Staff',  v: staff.length.toString(),      c:'text-[#6366F1]', bg:'bg-[#6366F1]/10 border-[#6366F1]/20' },
              { l:'On Duty',      v: onDutyCount.toString(),        c:'text-[#10B981]', bg:'bg-[#10B981]/10 border-[#10B981]/20' },
              { l:'Away',         v: awayCount.toString(),          c:'text-[#F59E0B]', bg:'bg-[#F59E0B]/10 border-[#F59E0B]/20' },
              { l:'Avg Rating',   v: avgRating,                     c:'text-[#F59E0B]', bg:'bg-[#F59E0B]/[0.07] border-[#F59E0B]/15' },
            ].map((k,i) => (
              <div key={i} className={`${k.bg} border rounded-[14px] px-3.5 py-2.5 flex flex-col gap-0.5`}>
                <span className={`text-[7px] font-black uppercase tracking-[0.2em] ${k.c}/70`}>{k.l}</span>
                <span className={`text-lg font-black ${k.c}`}>{k.v}</span>
              </div>
            ))}
          </div>

          <div className="h-px bg-white/[0.05] mb-4" />

          {/* Tab bar */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 gap-1 flex-wrap">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#6366F1] text-white shadow-sm'
                      : 'text-white/35 hover:text-white/60 hover:bg-white/[0.04]'
                  }`}>
                  <span className="hidden sm:flex">{tab.icon}</span>
                  {tab.id}
                  {tab.id === 'Leave' && pendingLeaves > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#F43F5E] text-white text-[7px] font-black flex items-center justify-center ml-0.5">{pendingLeaves}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 px-4 sm:px-6 pb-16 overflow-y-auto scrollbar-none">
        {activeTab === 'Directory'     && renderDirectory()}
        {activeTab === 'Scheduling'    && renderScheduling()}
        {activeTab === 'Performance'   && renderPerformance()}
        {activeTab === 'Compliance'    && renderCompliance()}
        {activeTab === 'Leave'         && renderLeave()}
        {activeTab === 'Communication' && renderCommunication()}
      </div>

      {/* ── Modals ──────────────────────────────────────────────────────────── */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <StaffModal
          mode={modalMode}
          member={editTarget}
          onClose={() => { setModalMode(null); setEditTarget(null); }}
          onSave={handleSave}
        />
      )}
      {drawerMember && (
        <ProfileDrawer
          member={drawerMember}
          onClose={() => setDrawerMember(null)}
          onEdit={() => { setEditTarget(drawerMember); setModalMode('edit'); setDrawerMember(null); }}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
