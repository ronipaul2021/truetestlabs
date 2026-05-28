"use client";

import React, { useState, useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';

// ─── Tiny inline SVG icons ────────────────────────────────────────────────────
const Ico = ({ d, size = 16, sw = 1.8 }: { d: string; size?: number; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const TrendUp   = () => <Ico d="M23 6l-9.5 9.5-5-5L1 18" />;
const TrendDn   = () => <Ico d="M23 18l-9.5-9.5-5 5L1 6" />;
const ExportIco = () => <Ico d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />;
const RefreshIco= () => <Ico d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />;
const FlaskIco  = () => <Ico d="M10 2v7.5M14 2v7.5M8.5 2h7M12 12c-3.5 0-6 2.5-6 6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3c0-3.5-2.5-6-6-6z" />;
const ClockIco  = () => <Ico d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2" />;
const UserIco   = () => <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />;
const StarIco   = () => <Ico d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />;
const DollarIco = () => <Ico d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />;
const AlertIco  = () => <Ico d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01" />;
const CheckIco  = () => <Ico d="M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3" />;
const PieIco    = () => <Ico d="M21.21 15.89A10 10 0 1 1 8 2.83 M22 12A10 10 0 0 0 12 2v10z" />;
const BarIco    = () => <Ico d="M18 20V10M12 20V4M6 20v-6" />;
const ActivityIco = () => <Ico d="M22 12h-4l-3 9L9 3l-3 9H2" />;
const GridIco   = () => <Ico d="M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z" />;
const DownloadIco=() => <Ico d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />;

// ─── Types ────────────────────────────────────────────────────────────────────
type TimeRange = 'Today' | 'Week' | 'Month' | 'Quarter' | '6 Months';
type Tab = 'Overview' | 'Operational' | 'Financial' | 'Patient' | 'Quality' | 'Report Builder';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : n >= 1000 ? `₹${(n/1000).toFixed(1)}K` : `₹${n}`;

// ─── Reusable card shell ──────────────────────────────────────────────────────
const Card = ({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
  <div className={`bg-[#162035]/85 backdrop-blur-md border border-white/[0.07] rounded-[22px] shadow-xl relative overflow-hidden ${className}`} style={style}>
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    {children}
  </div>
);

// ─── KPI card ─────────────────────────────────────────────────────────────────
const KPICard = ({ label, value, sub, icon, accentColor, up }: any) => (
  <Card className="p-5 hover:-translate-y-0.5 transition-transform group">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accentColor} transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      {up !== undefined && (
        <span className={`flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full border ${up ? 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20' : 'text-[#F43F5E] bg-[#F43F5E]/10 border-[#F43F5E]/20'}`}>
          {up ? <TrendUp /> : <TrendDn />} {sub}
        </span>
      )}
    </div>
    <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">{label}</p>
    <h3 className="text-xl font-black text-white leading-tight">{value}</h3>
    {up === undefined && <p className="text-[9px] text-white/40 mt-0.5">{sub}</p>}
  </Card>
);

// ─── SVG Area Chart ───────────────────────────────────────────────────────────
const AreaChart = ({ data, color, height = 160 }: { data: number[]; color: string; height?: number }) => {
  const max = Math.max(...data, 1);
  const w = 700; const h = height;
  const pts = data.map((v, i) => [i * (w / (data.length - 1)), h - (v / max) * (h - 20)]);
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
  const area = `${line} L ${pts[pts.length-1][0]} ${h} L 0 ${h} Z`;
  const id = `grad-${color.replace('#','')}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0,0.25,0.5,0.75,1].map((t,i) => (
        <line key={i} x1="0" y1={h*t} x2={w} y2={h*t} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      ))}
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="4" fill={color} stroke="white" strokeWidth="2" className="hover:r-6 transition-all cursor-pointer" />
      ))}
    </svg>
  );
};

// ─── Bar Chart ────────────────────────────────────────────────────────────────
const BarChart = ({ data, color }: { data: { label: string; value: number; color?: string }[]; color: string }) => {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-[160px] w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
          <span className="text-[8px] font-bold text-white/0 group-hover:text-white/60 transition-colors">{d.value}</span>
          <div className="w-full relative flex-1 flex items-end">
            <div
              className="w-full rounded-t-lg transition-all duration-700 cursor-pointer hover:brightness-125"
              style={{ height: `${(d.value / max) * 100}%`, background: d.color || color }}
            />
          </div>
          <span className="text-[7px] font-black text-white/40 uppercase tracking-widest text-center leading-tight">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Donut ────────────────────────────────────────────────────────────────────
const Donut = ({ segments, center }: { segments: { color: string; pct: number }[]; center: string }) => {
  const r = 38; const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="relative w-28 h-28 shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} stroke="rgba(255,255,255,0.07)" strokeWidth="14" fill="none" />
        {segments.map((s, i) => {
          const dash = (s.pct / 100) * circ;
          const el = <circle key={i} cx="50" cy="50" r={r} stroke={s.color} strokeWidth="14" fill="none"
            strokeDasharray={`${dash} ${circ}`} strokeDashoffset={-offset * circ / 100} strokeLinecap="round" />;
          offset += s.pct; return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-[11px] font-black text-white leading-none">{center}</p>
      </div>
    </div>
  );
};

// ─── Progress row ─────────────────────────────────────────────────────────────
const ProgressRow = ({ label, pct, color, right }: { label: string; pct: number; color: string; right?: string }) => (
  <div>
    <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest mb-1.5">
      <span className="text-white/60">{label}</span>
      <span className="text-white">{right ?? `${pct}%`}</span>
    </div>
    <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: color }} />
    </div>
  </div>
);

// ─── Horizontal bar (patient source) ─────────────────────────────────────────
const HBar = ({ segs }: { segs: { label: string; pct: number; color: string }[] }) => (
  <div className="w-full h-9 flex rounded-xl overflow-hidden gap-px">
    {segs.map((s, i) => (
      <div key={i} className="flex items-center justify-center transition-all hover:brightness-110 cursor-pointer" style={{ width: `${s.pct}%`, background: s.color }}>
        <span className="text-[8px] font-black text-white uppercase tracking-wide whitespace-nowrap px-1">{s.label} {s.pct}%</span>
      </div>
    ))}
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const { requests, currentCenter } = useDashboard();
  const [timeRange, setTimeRange] = useState<TimeRange>('Month');
  const [activeTab, setActiveTab]   = useState<Tab>('Overview');
  const [customStart, setCustomStart] = useState('');
  const [customEnd,   setCustomEnd]   = useState('');
  const [isTimeOpen, setIsTimeOpen]   = useState(false);
  const [isTabOpen,  setIsTabOpen]    = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [reportModules, setReportModules] = useState<string[]>([]);

  // ── Derive real metrics from context data ─────────────────────────────────
  const services = currentCenter?.services ?? [];

  const totalOrders   = requests.length;
  const completedOrders = requests.filter((r: any) => r.status === 'completed' || r.status === 'Completed').length;
  const pendingOrders   = requests.filter((r: any) => r.status === 'pending' || r.status === 'Pending').length;
  const cancelledOrders = requests.filter((r: any) => r.status === 'cancelled' || r.status === 'Cancelled').length;

  // Revenue — from requests that have price attached; fallback to service avg
  const avgServicePrice = services.length ? services.reduce((a: number, s: any) => a + (s.price || 0), 0) / services.length : 0;
  const estimatedRevenue = completedOrders * avgServicePrice;

  // Avg margin from services
  const avgMargin = services.length ? Math.round(services.reduce((a: number, s: any) => a + (s.profitMargin || 45), 0) / services.length) : 45;

  // Sparkline data — last 8 weeks simulated from totalOrders
  const revenueData = [0.6,0.75,0.8,0.65,0.9,0.85,1,0.95].map(f => Math.round(estimatedRevenue * f / 8));
  const ordersData  = [0.7,0.8,0.6,0.9,0.75,1,0.85,0.95].map(f => Math.round(totalOrders * f / 8));

  // Categories from services
  const catGroups = useMemo(() => {
    const m: Record<string, number> = {};
    services.forEach((s: any) => { m[s.category || 'General'] = (m[s.category || 'General'] || 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 4);
  }, [services]);

  const totalCats = catGroups.reduce((a, c) => a + c[1], 0) || 1;

  const catColors = ['#10B981','#6366F1','#06B6D4','#F59E0B'];
  const donutSegs = catGroups.map((c, i) => ({ color: catColors[i], pct: Math.round((c[1] / totalCats) * 100) }));

  // TAT bar data
  const tatBars = [
    { label: '<1h',  value: Math.round(completedOrders * 0.05), color: '#10B981' },
    { label: '1-2h', value: Math.round(completedOrders * 0.22), color: '#10B981' },
    { label: '2-4h', value: Math.round(completedOrders * 0.38), color: '#F59E0B' },
    { label: '4-6h', value: Math.round(completedOrders * 0.25), color: '#F59E0B' },
    { label: '6-12h',value: Math.round(completedOrders * 0.07), color: '#F43F5E' },
    { label: '>12h', value: Math.round(completedOrders * 0.03), color: '#F43F5E' },
  ];

  const REPORT_MODULES = ['Revenue Total','TAT Average','Rejection Rate','Equipment Util','Profit Margin','Demographics','Top Services','Patient Count','Pending Orders','Completion Rate'];

  const tabs: Tab[] = ['Overview','Operational','Financial','Patient','Quality','Report Builder'];
  const tabIcons: Record<Tab, React.ReactNode> = {
    'Overview':       <ActivityIco />,
    'Operational':    <ClockIco />,
    'Financial':      <DollarIco />,
    'Patient':        <UserIco />,
    'Quality':        <CheckIco />,
    'Report Builder': <GridIco />,
  };

  const refresh = () => setLastRefresh(new Date());

  // ── Tabs Content ─────────────────────────────────────────────────────────────

  // ── OVERVIEW ─────────────────────────────────────────────────────────────────
  const renderOverview = () => (
    <div className="space-y-4">
      {/* KPI Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KPICard label="Est. Revenue" value={fmt(estimatedRevenue)} sub="+12.5%" up={true}
          icon={<DollarIco />} accentColor="bg-[#10B981]/15 text-[#10B981]" />
        <KPICard label="Total Orders" value={totalOrders.toLocaleString()} sub="+8.2%" up={true}
          icon={<FlaskIco />} accentColor="bg-[#6366F1]/15 text-[#6366F1]" />
        <KPICard label="Completion Rate"
          value={totalOrders ? `${Math.round((completedOrders/totalOrders)*100)}%` : '—'}
          sub={`${completedOrders} completed`} up={undefined}
          icon={<CheckIco />} accentColor="bg-[#06B6D4]/15 text-[#06B6D4]" />
        <KPICard label="Avg Margin" value={`${avgMargin}%`} sub="Across services" up={undefined}
          icon={<StarIco />} accentColor="bg-[#F59E0B]/15 text-[#F59E0B]" />
      </div>

      {/* Revenue Area + Diagnostic Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-8 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-black text-white">Revenue Stream</h3>
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-0.5">Estimated Financial Velocity</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-[#10B981]">{fmt(estimatedRevenue)}</p>
              <p className="text-[8px] font-bold text-[#10B981]/60 uppercase">This Period</p>
            </div>
          </div>
          <AreaChart data={revenueData} color="#10B981" />
          <div className="flex justify-between mt-2 px-1">
            {['Wk1','Wk2','Wk3','Wk4','Wk5','Wk6','Wk7','Wk8'].map(w => (
              <span key={w} className="text-[7px] font-bold text-white/25 uppercase">{w}</span>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-4 p-5 flex flex-col">
          <h3 className="text-[15px] font-black text-white mb-0.5">Diagnostic Mix</h3>
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-4">Services by Category</p>
          <div className="flex items-center justify-center mb-4">
            <Donut segments={donutSegs.length ? donutSegs : [{ color: '#6366F1', pct: 100 }]}
              center={`${services.length}`} />
          </div>
          <div className="space-y-2 mt-auto">
            {catGroups.length ? catGroups.map(([cat, count], i) => (
              <div key={cat} className="flex items-center justify-between px-3 py-2 bg-[#0D1829]/60 rounded-xl border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: catColors[i] }} />
                  <span className="text-[10px] font-bold text-white/70 truncate max-w-[120px]">{cat}</span>
                </div>
                <span className="text-[10px] font-black text-white">{Math.round((count/totalCats)*100)}%</span>
              </div>
            )) : (
              <div className="text-center py-4">
                <p className="text-[10px] text-white/30">No services added yet</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Orders flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-8 p-5 flex flex-col">
          <h3 className="text-[15px] font-black text-white mb-0.5">Order Volume Trend</h3>
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-4">Weekly Request Throughput</p>
          <AreaChart data={ordersData} color="#6366F1" />
          <div className="flex justify-between mt-2 px-1">
            {['Wk1','Wk2','Wk3','Wk4','Wk5','Wk6','Wk7','Wk8'].map(w => (
              <span key={w} className="text-[7px] font-bold text-white/25 uppercase">{w}</span>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-4 p-5">
          <h3 className="text-[15px] font-black text-white mb-0.5">Order Status</h3>
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-4">Live Breakdown</p>
          <div className="space-y-3">
            {[
              { label: 'Completed', count: completedOrders, total: totalOrders || 1, color: '#10B981' },
              { label: 'Pending',   count: pendingOrders,   total: totalOrders || 1, color: '#F59E0B' },
              { label: 'Cancelled', count: cancelledOrders, total: totalOrders || 1, color: '#F43F5E' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-[9px] font-bold mb-1">
                    <span className="text-white/60 uppercase tracking-widest">{s.label}</span>
                    <span className="text-white">{s.count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(s.count/s.total)*100}%`, background: s.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-white/[0.05] grid grid-cols-2 gap-3">
            {[
              { l:'Active Services', v: services.filter((s:any)=>s.status==='Active').length, c:'text-[#10B981]' },
              { l:'Total Services',  v: services.length, c:'text-[#6366F1]' },
            ].map(m => (
              <div key={m.l} className="bg-[#0D1829]/60 rounded-xl p-3 border border-white/[0.04]">
                <p className="text-[7px] font-black text-white/30 uppercase tracking-widest mb-1">{m.l}</p>
                <p className={`text-xl font-black ${m.c}`}>{m.v}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  // ── OPERATIONAL ──────────────────────────────────────────────────────────────
  const renderOperational = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'First-Time Accuracy', value: '99.4%', icon: <CheckIco />, color: '#10B981', note: '↓ 0.1% vs last month' },
          { label: 'Avg Turnaround', value: '4.2h', icon: <ClockIco />, color: '#6366F1', note: '-15% improvement' },
          { label: 'Cost per Test', value: '₹320', icon: <DollarIco />, color: '#F59E0B', note: 'vs ₹1,200 revenue' },
          { label: 'SLA Breach Rate', value: '2.1%', icon: <AlertIco />, color: '#F43F5E', note: 'Target <3%' },
        ].map((k, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${k.color}18`, color: k.color }}>{k.icon}</div>
            </div>
            <p className="text-[8px] font-black text-white/35 uppercase tracking-[0.18em] mb-1">{k.label}</p>
            <p className="text-xl font-black text-white mb-1">{k.value}</p>
            <p className="text-[8px] text-white/30">{k.note}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* TAT Distribution */}
        <Card className="lg:col-span-7 p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[15px] font-black text-white">TAT Distribution</h3>
              <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-0.5">Turnaround Time Across All Requests</p>
            </div>
            <div className="flex gap-3 text-[8px] font-bold">
              {[{ l:'Fast <2h',c:'#10B981'},{ l:'Normal 2-6h',c:'#F59E0B'},{ l:'Slow >6h',c:'#F43F5E'}].map(x=>(
                <span key={x.l} className="flex items-center gap-1.5 text-white/50">
                  <span className="w-2 h-2 rounded-full" style={{background:x.c}} />{x.l}
                </span>
              ))}
            </div>
          </div>
          <BarChart data={tatBars} color="#6366F1" />
        </Card>

        {/* Equipment Utilization */}
        <Card className="lg:col-span-5 p-5">
          <h3 className="text-[15px] font-black text-white mb-0.5">Equipment Utilization</h3>
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-4">Live Sensor Data</p>
          <div className="space-y-4">
            {[
              { name: 'MRI Scanner A1',       val: 92, color: '#F43F5E' },
              { name: 'Sysmex Hematology',    val: 78, color: '#10B981' },
              { name: 'Roche Cobas e411',     val: 85, color: '#F59E0B' },
              { name: 'Siemens Atellica',     val: 45, color: '#6366F1' },
              { name: 'Abbott Architect c16k',val: 67, color: '#06B6D4' },
            ].map(eq => (
              <ProgressRow key={eq.name} label={eq.name} pct={eq.val} color={eq.color}
                right={`${eq.val}% ${eq.val > 90 ? '⚠️' : ''}`} />
            ))}
          </div>
        </Card>
      </div>

      {/* Staff + Top Services table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-5 p-5">
          <h3 className="text-[15px] font-black text-white mb-0.5">Staff Efficiency</h3>
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-4">Top Performers</p>
          <div className="space-y-2">
            {[
              { name: 'Dr. Sarah Jenkins', ops: 142, role: 'Senior Pathologist', rank: 1 },
              { name: 'Mike Ross',         ops: 128, role: 'Lab Technician',     rank: 2 },
              { name: 'Anita Patel',       ops: 115, role: 'Phlebotomist',       rank: 3 },
              { name: 'James Liu',         ops: 98,  role: 'Radiologist',        rank: 4 },
            ].map(s => (
              <div key={s.rank} className="flex items-center gap-3 px-3.5 py-2.5 bg-[#0D1829]/60 rounded-xl border border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-black shrink-0 ${s.rank === 1 ? 'bg-[#F59E0B]/20 text-[#F59E0B]' : 'bg-white/[0.05] text-white/40'}`}>#{s.rank}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-white truncate">{s.name}</p>
                  <p className="text-[8px] font-medium text-white/35 uppercase tracking-widest">{s.role}</p>
                </div>
                <p className="text-[11px] font-black text-white shrink-0">{s.ops} <span className="text-white/30 text-[8px]">ops</span></p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-7 p-5">
          <h3 className="text-[15px] font-black text-white mb-0.5">Service Performance Table</h3>
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-4">Top Services by Activity</p>
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-left min-w-[420px]">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  {['Service','Category','Price','Margin','Status'].map(h => (
                    <th key={h} className="px-3 py-2.5 text-[8px] font-black text-white/30 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(services.slice(0, 8) as any[]).map((s: any, i: number) => (
                  <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-3 py-2.5">
                      <p className="text-[11px] font-semibold text-white truncate max-w-[140px]">{s.name}</p>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[9px] font-bold text-white/40">{s.category || '—'}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[11px] font-bold text-[#10B981]">₹{s.price || '—'}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[11px] font-bold ${(s.profitMargin||0)>=55?'text-[#10B981]':(s.profitMargin||0)>=40?'text-[#F59E0B]':'text-[#F43F5E]'}`}>
                        {s.profitMargin ?? '—'}%
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${s.status==='Active'?'bg-[#10B981]/10 border-[#10B981]/25 text-[#10B981]':'bg-[#F43F5E]/10 border-[#F43F5E]/25 text-[#F43F5E]'}`}>
                        {s.status ?? 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
                {services.length === 0 && (
                  <tr><td colSpan={5} className="py-10 text-center text-[10px] text-white/25">No services loaded</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );

  // ── FINANCIAL ────────────────────────────────────────────────────────────────
  const renderFinancial = () => (
    <div className="space-y-4">
      {/* Top 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="p-5 border-[#10B981]/20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/[0.06] to-transparent rounded-[22px]" />
          <p className="text-[8px] font-black text-[#10B981] uppercase tracking-[0.2em] mb-1 relative">Net Profit Margin</p>
          <p className="text-3xl font-black text-white mb-2 relative">{avgMargin}%</p>
          <span className="text-[9px] font-bold text-white/40 bg-white/[0.06] px-2.5 py-1 rounded-full">+2.1% vs last period</span>
        </Card>
        <Card className="p-5 border-[#F43F5E]/20">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F43F5E]/[0.06] to-transparent rounded-[22px]" />
          <p className="text-[8px] font-black text-[#F43F5E] uppercase tracking-[0.2em] mb-1 relative">Outstanding Payments</p>
          <p className="text-3xl font-black text-white mb-2 relative">₹1.8L</p>
          <span className="text-[9px] font-bold text-[#F43F5E]/70 bg-[#F43F5E]/10 px-2.5 py-1 rounded-full">14 invoices &gt;30 days</span>
        </Card>
        <Card className="p-5">
          <p className="text-[8px] font-black text-[#F59E0B] uppercase tracking-[0.2em] mb-1">Supply Cost (Consumables)</p>
          <p className="text-3xl font-black text-white mb-2">₹4.2L</p>
          <span className="text-[9px] font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2.5 py-1 rounded-full">⚠ Reagents +15%</span>
        </Card>
      </div>

      {/* Revenue by Source */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-8 p-5">
          <h3 className="text-[15px] font-black text-white mb-0.5">Revenue by Patient Source</h3>
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-4">B2B vs B2C Channels</p>
          <HBar segs={[
            { label: 'Walk-in', pct: 45, color: '#F43F5E' },
            { label: 'Hospitals', pct: 35, color: '#10B981' },
            { label: 'Corporate', pct: 20, color: '#6366F1' },
          ]} />
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { t:'Walk-in (B2C)', v:`₹${Math.round(estimatedRevenue*0.45).toLocaleString()}`, c:'text-[#F43F5E]', bg:'bg-[#F43F5E]/[0.07]' },
              { t:'Hospital Refs', v:`₹${Math.round(estimatedRevenue*0.35).toLocaleString()}`, c:'text-[#10B981]', bg:'bg-[#10B981]/[0.07]' },
              { t:'Corporate',    v:`₹${Math.round(estimatedRevenue*0.20).toLocaleString()}`, c:'text-[#6366F1]', bg:'bg-[#6366F1]/[0.07]' },
            ].map(i => (
              <div key={i.t} className={`${i.bg} border border-white/[0.06] rounded-xl p-4`}>
                <p className={`text-[8px] font-black uppercase tracking-widest mb-1 ${i.c}`}>{i.t}</p>
                <p className="text-[15px] font-black text-white">{i.v}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-4 p-5">
          <h3 className="text-[15px] font-black text-white mb-0.5">Profit Margins</h3>
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-4">By Service Category</p>
          <div className="space-y-4">
            {(services.slice(0,5) as any[]).length ? (services.slice(0,5) as any[]).map((s: any, i: number) => {
              const m = s.profitMargin || Math.floor(Math.random()*40)+30;
              return <ProgressRow key={i} label={s.name} pct={m} color={m>=55?'#10B981':m>=40?'#F59E0B':'#F43F5E'} />;
            }) : [
              { l:'MRI Scans', m:68 }, { l:'Blood Tests', m:42 }, { l:'Genetics', m:82 }, { l:'X-Ray', m:25 }
            ].map(x => <ProgressRow key={x.l} label={x.l} pct={x.m} color={x.m>=55?'#10B981':x.m>=40?'#F59E0B':'#F43F5E'} />)}
          </div>
        </Card>
      </div>

      {/* Revenue trend */}
      <Card className="p-5">
        <h3 className="text-[15px] font-black text-white mb-0.5">Revenue Trend</h3>
        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-4">8-Period Rolling</p>
        <AreaChart data={revenueData.map((v, i) => v + i * 500)} color="#10B981" height={140} />
      </Card>
    </div>
  );

  // ── PATIENT ──────────────────────────────────────────────────────────────────
  const renderPatient = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { l:'Total Patients', v: totalOrders.toLocaleString(), icon:<UserIco />, c:'#6366F1' },
          { l:'Returning (%)',  v:'68%', icon:<StarIco />, c:'#10B981' },
          { l:'Avg Visit/Mo',   v:`${Math.round(totalOrders/12)||0}`, icon:<ClockIco />, c:'#F59E0B' },
          { l:'NPS Score',      v:'78 / 100', icon:<CheckIco />, c:'#06B6D4' },
        ].map((k,i) => (
          <Card key={i} className="p-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{background:`${k.c}18`,color:k.c}}>{k.icon}</div>
            <p className="text-[8px] font-black text-white/35 uppercase tracking-[0.18em] mb-1">{k.l}</p>
            <p className="text-xl font-black text-white">{k.v}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Geo Heatmap */}
        <Card className="lg:col-span-7 p-5">
          <h3 className="text-[15px] font-black text-white mb-0.5">Geographic Heatmap</h3>
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-4">Patient Origin Density</p>
          <div className="grid grid-cols-14 gap-0.5 p-3 bg-white/[0.03] border border-white/[0.05] rounded-2xl min-h-[200px]">
            {Array.from({ length: 112 }).map((_, i) => {
              const intensity = Math.random();
              const color = i % 11 === 0 || i % 7 === 0 ? '#06B6D4' : i % 5 === 0 ? '#6366F1' : '#10B981';
              return (
                <div key={i} className="aspect-square rounded-sm hover:opacity-100 transition-opacity cursor-pointer"
                  style={{ background: color, opacity: intensity * 0.8 + 0.05 }} />
              );
            })}
          </div>
          <div className="flex items-center gap-3 mt-3 justify-end">
            {[{l:'High',c:'#10B981'},{l:'Medium',c:'#6366F1'},{l:'Low',c:'#06B6D4'}].map(x=>(
              <span key={x.l} className="flex items-center gap-1.5 text-[8px] font-bold text-white/40">
                <span className="w-2 h-2 rounded-sm" style={{background:x.c}} />{x.l}
              </span>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Loyalty */}
          <Card className="p-5">
            <h3 className="text-[15px] font-black text-white mb-0.5">Loyalty Ratio</h3>
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-4">New vs Returning Patients</p>
            <div className="flex items-center gap-4">
              <Donut segments={[{color:'#06B6D4',pct:68},{color:'#F43F5E',pct:32}]} center="68%" />
              <div className="space-y-3">
                {[{l:'Returning',v:'68%',c:'#06B6D4'},{l:'New',v:'32%',c:'#F43F5E'}].map(x=>(
                  <div key={x.l}>
                    <p className="text-[8px] font-black text-white/35 uppercase tracking-widest">{x.l}</p>
                    <p className="text-xl font-black" style={{color:x.c}}>{x.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Age/Gender */}
          <Card className="p-5 flex-1">
            <h3 className="text-[15px] font-black text-white mb-0.5">Age & Gender</h3>
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-4">Patient Demographic Breakdown</p>
            <div className="space-y-3">
              {[{age:'0-18',m:15,f:12},{age:'19-35',m:45,f:55},{age:'36-50',m:60,f:40},{age:'51-65',m:70,f:65},{age:'65+',m:40,f:50}].map(d=>(
                <div key={d.age} className="flex items-center gap-2">
                  <div className="flex-1 flex justify-end">
                    <div className="h-3 bg-[#F43F5E]/60 rounded-l-sm" style={{width:`${d.m}%`}} />
                  </div>
                  <span className="w-9 text-center text-[8px] font-black text-white/40 shrink-0">{d.age}</span>
                  <div className="flex-1 flex justify-start">
                    <div className="h-3 bg-[#06B6D4]/60 rounded-r-sm" style={{width:`${d.f}%`}} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-3">
              {[{l:'Male',c:'#F43F5E'},{l:'Female',c:'#06B6D4'}].map(x=>(
                <span key={x.l} className="flex items-center gap-1.5 text-[8px] font-black text-white/40">
                  <span className="w-2 h-2 rounded-full" style={{background:x.c}} />{x.l}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  // ── QUALITY ──────────────────────────────────────────────────────────────────
  const renderQuality = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { l:'Sample Rejection Rate', v:'1.2%', badge:'↓ 0.4% Improvement', bc:'text-[#10B981]', c:'#F43F5E', icon:'!', note:'NABL target <2%' },
          { l:'Rework / Retest %',     v:'0.8%', badge:'↑ 0.2% Increase',    bc:'text-[#F43F5E]', c:'#F59E0B', icon:'⟳', note:'Up for review' },
          { l:'Audit Compliance',      v:'100%', badge:'NABL/ISO Met',       bc:'text-[#10B981]', c:'#10B981', icon:'✓', note:'All standards passed' },
        ].map((k,i)=>(
          <Card key={i} className="p-5" style={{borderColor:`${k.c}25`}}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black" style={{background:`${k.c}15`,color:k.c}}>{k.icon}</div>
              <span className={`text-[9px] font-black ${k.bc}`}>{k.badge}</span>
            </div>
            <p className="text-[8px] font-black text-white/35 uppercase tracking-[0.2em] mb-1">{k.l}</p>
            <p className="text-2xl font-black text-white mb-1">{k.v}</p>
            <p className="text-[8px] text-white/30">{k.note}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <Card className="lg:col-span-7 p-5">
          <h3 className="text-[15px] font-black text-white mb-0.5">Quality Incidents Trend</h3>
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-4">Trailing 6 Months</p>
          <AreaChart data={[18, 22, 15, 10, 12, 7]} color="#F43F5E" />
          <div className="flex justify-between mt-2 px-1">
            {['Jan','Feb','Mar','Apr','May','Jun'].map(m => (
              <span key={m} className="text-[7px] font-bold text-white/25 uppercase">{m}</span>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-5 p-5">
          <h3 className="text-[15px] font-black text-white mb-0.5">Root Cause Analysis</h3>
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-4">Rejected Sample Breakdown</p>
          <div className="space-y-4">
            {[
              {r:'Hemolysis',        pct:45, c:'#F43F5E'},
              {r:'Insufficient Qty', pct:30, c:'#F59E0B'},
              {r:'Clotted Sample',   pct:15, c:'#8B5CF6'},
              {r:'Wrong Container',  pct:10, c:'#06B6D4'},
            ].map(rc=>(
              <ProgressRow key={rc.r} label={rc.r} pct={rc.pct} color={rc.c} />
            ))}
          </div>
        </Card>
      </div>

      {/* Quality checklist */}
      <Card className="p-5">
        <h3 className="text-[15px] font-black text-white mb-4">Compliance Checklist</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { l:'NABL Accreditation',     status:'pass' },
            { l:'ISO 15189 Compliance',   status:'pass' },
            { l:'Cold Chain Monitoring',  status:'pass' },
            { l:'Biosafety Protocols',    status:'pass' },
            { l:'EQA Participation',      status:'warn' },
            { l:'IQC Daily Logs',         status:'pass' },
            { l:'Staff Training Records', status:'warn' },
            { l:'Calibration Records',    status:'pass' },
            { l:'Incident Log Updated',   status:'fail' },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
              item.status==='pass' ? 'bg-[#10B981]/[0.06] border-[#10B981]/20' :
              item.status==='warn' ? 'bg-[#F59E0B]/[0.06] border-[#F59E0B]/20' :
              'bg-[#F43F5E]/[0.06] border-[#F43F5E]/20'
            }`}>
              <span className={`text-[10px] font-black shrink-0 ${
                item.status==='pass'?'text-[#10B981]':item.status==='warn'?'text-[#F59E0B]':'text-[#F43F5E]'}`}>
                {item.status==='pass' ? '✓' : item.status==='warn' ? '⚠' : '✗'}
              </span>
              <span className="text-[11px] font-medium text-white/70">{item.l}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  // ── REPORT BUILDER ────────────────────────────────────────────────────────────
  const renderBuilder = () => (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-white">Custom Report Builder</h2>
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-0.5">Drag metric modules to compose automated reports</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setReportModules([])}
              className="px-4 py-2 rounded-xl text-[10px] font-bold text-white/40 bg-white/[0.04] border border-white/[0.06] hover:text-white transition-colors"
            >Clear</button>
            <button
              onClick={() => { if(reportModules.length) window.print(); else alert('Add at least one module first.'); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-bold bg-gradient-to-r from-[#6366F1] to-[#10B981] text-white shadow-[0_0_18px_rgba(99,102,241,0.3)] hover:opacity-90 transition-all"
            >
              <DownloadIco /> Generate & Export
            </button>
          </div>
        </div>

        {/* Drop Zone */}
        <div className={`border-2 border-dashed rounded-2xl p-6 mb-6 min-h-[140px] flex flex-wrap gap-2 items-start content-start transition-colors ${
          reportModules.length ? 'border-[#6366F1]/30 bg-[#6366F1]/[0.04]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20'
        }`}>
          {reportModules.length === 0 && (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest">Click modules below to add them to your report →</p>
            </div>
          )}
          {reportModules.map((m, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 bg-[#6366F1]/15 border border-[#6366F1]/30 rounded-xl text-[10px] font-bold text-[#A5B4FC]">
              {m}
              <button onClick={() => setReportModules(prev => prev.filter((_,j)=>j!==i))} className="text-[#6366F1]/60 hover:text-[#F43F5E] transition-colors">×</button>
            </div>
          ))}
        </div>

        {/* Available Modules */}
        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-3">Available Modules</p>
        <div className="flex flex-wrap gap-2">
          {REPORT_MODULES.map(chip => {
            const added = reportModules.includes(chip);
            return (
              <button
                key={chip}
                onClick={() => !added && setReportModules(prev => [...prev, chip])}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${
                  added
                    ? 'bg-[#6366F1]/20 border-[#6366F1]/40 text-[#A5B4FC] cursor-default'
                    : 'bg-[#0D1829]/60 border-white/[0.07] text-white/50 hover:border-[#6366F1]/40 hover:text-[#A5B4FC] hover:bg-[#6366F1]/10 cursor-pointer'
                }`}
              >
                {added ? '✓ ' : '+ '}{chip}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Live Preview */}
      {reportModules.length > 0 && (
        <Card className="p-6">
          <h3 className="text-[15px] font-black text-white mb-4">Report Preview</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {reportModules.map((m, i) => (
              <div key={i} className="bg-[#0D1829]/70 border border-white/[0.06] rounded-xl p-4">
                <p className="text-[8px] font-black text-[#6366F1] uppercase tracking-widest mb-2">{m}</p>
                <p className="text-[15px] font-black text-white">
                  {m==='Revenue Total'?fmt(estimatedRevenue):m==='TAT Average'?'4.2h':m==='Rejection Rate'?'1.2%':m==='Equipment Util'?'77%':m==='Profit Margin'?`${avgMargin}%`:m==='Demographics'?'Patient Mix':m==='Top Services'?`${services.length} svc`:m==='Patient Count'?totalOrders:m==='Pending Orders'?pendingOrders:`${completedOrders}`}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );

  // ─── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 flex flex-col min-h-full page-transition">
      {/* ── Control Panel ─────────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-6 pb-3">
        <Card className="p-5">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#6366F1]/20 to-[#10B981]/10 border border-[#6366F1]/25 flex items-center justify-center text-[#6366F1] shrink-0">
                <ActivityIco />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-black text-white tracking-tight">Deep Analysis</h1>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#10B981]/[0.08] border border-[#10B981]/20 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981] animate-pulse" />
                    <span className="text-[8px] font-black text-[#10B981] uppercase tracking-widest">Live Syncing</span>
                  </div>
                </div>
                <p className="text-[9px] font-medium text-white/40 uppercase tracking-[0.15em] mt-0.5">Real-time Performance & Clinical Insights</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={refresh} title="Refresh" className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all">
                <RefreshIco />
              </button>
              <span className="text-[8px] text-white/20 hidden sm:block">
                Last updated {lastRefresh.toLocaleTimeString()}
              </span>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#6366F1] to-[#10B981] text-white rounded-xl text-[10px] font-bold shadow-[0_0_18px_rgba(99,102,241,0.25)] hover:opacity-90 transition-all relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <ExportIco /> Export
              </button>
            </div>
          </div>

          <div className="h-px bg-white/[0.05] mb-4" />

          {/* Tab bar + Time range */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Horizontal tab pills */}
            <div className="flex bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 gap-1 flex-wrap">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-bold transition-all ${
                    activeTab === tab
                      ? 'bg-[#6366F1] text-white shadow-sm'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="hidden sm:flex">{tabIcons[tab]}</span>
                  {tab}
                </button>
              ))}
            </div>

            {/* Time Range */}
            <div className="relative ml-auto">
              <button
                onClick={() => setIsTimeOpen(!isTimeOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#0D1829] border border-white/[0.07] rounded-xl text-[10px] font-bold text-white/60 hover:text-white transition-colors"
              >
                <ClockIco /> {timeRange}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`transition-transform ${isTimeOpen?'rotate-180':''}`}><path d="M6 9l6 6 6-6"/></svg>
              </button>
              {isTimeOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-40 bg-[#162035] border border-white/[0.09] rounded-xl shadow-2xl p-1.5 z-50">
                  {(['Today','Week','Month','Quarter','6 Months'] as TimeRange[]).map(r => (
                    <button key={r} onClick={() => { setTimeRange(r); setIsTimeOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold transition-all ${timeRange===r?'bg-[#6366F1] text-white':'text-white/50 hover:text-white hover:bg-white/[0.05]'}`}>
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* ── Dynamic Content ──────────────────────────────────────────────────── */}
      <div className="flex-1 px-4 sm:px-6 pb-16 overflow-y-auto scrollbar-none">
        {activeTab === 'Overview'       && renderOverview()}
        {activeTab === 'Operational'    && renderOperational()}
        {activeTab === 'Financial'      && renderFinancial()}
        {activeTab === 'Patient'        && renderPatient()}
        {activeTab === 'Quality'        && renderQuality()}
        {activeTab === 'Report Builder' && renderBuilder()}
      </div>
    </div>
  );
}
