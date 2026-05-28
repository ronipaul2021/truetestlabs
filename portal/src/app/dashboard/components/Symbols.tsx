import React from 'react';

// Flexible Symbol Wrapper
const SymbolIcon = ({ children, color = "currentColor", className = "" }: { children: React.ReactNode, color?: string, className?: string }) => (
  <svg 
    className={`w-full h-full ${className}`} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {children}
  </svg>
);

// Interface for Symbol Props
interface SymbolProps {
  color?: string;
  className?: string;
}

// 1. Dashboard
export const DashboardSymbol = ({ color }: SymbolProps) => (
  <SymbolIcon color={color}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </SymbolIcon>
);

// 2. Orders
export const OrdersSymbol = ({ color }: SymbolProps) => (
  <SymbolIcon color={color}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" />
  </SymbolIcon>
);

// 3. Services
export const ServicesSymbol = ({ color }: SymbolProps) => (
  <SymbolIcon color={color}>
    <path d="M10 2v7.5M14 2v7.5M8.5 2h7M12 12c-3.5 0-6 2.5-6 6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3c0-3.5-2.5-6-6-6z" />
  </SymbolIcon>
);

// 4. Analytics
export const AnalyticsSymbol = ({ color }: SymbolProps) => (
  <SymbolIcon color={color}>
    <path d="M3 20h18" />
    <path d="M3 16l4-4 4 4 8-8" />
  </SymbolIcon>
);

// 5. Staff
export const StaffSymbol = ({ color }: SymbolProps) => (
  <SymbolIcon color={color}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <circle cx="16" cy="3.13" r="3" />
  </SymbolIcon>
);

// 6. Settings
export const SettingsSymbol = ({ color }: SymbolProps) => (
  <SymbolIcon color={color}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </SymbolIcon>
);

// 7. Logout
export const LogoutSymbol = ({ color }: SymbolProps) => (
  <SymbolIcon color={color}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </SymbolIcon>
);

// Metrics & Miscellaneous
export const RevenueSymbol = ({ color = "#00E676" }: SymbolProps) => <SymbolIcon color={color}><circle cx="12" cy="12" r="10" /><path d="M12 8v8M9 10h6M9 14h6" /></SymbolIcon>;
export const PatientsSymbol = ({ color = "#FF3366" }: SymbolProps) => <SymbolIcon color={color}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></SymbolIcon>;
export const EfficiencySymbol = ({ color = "#0052FF" }: SymbolProps) => <SymbolIcon color={color}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></SymbolIcon>;
export const SuccessSymbol = ({ color = "#00E676" }: SymbolProps) => <SymbolIcon color={color}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></SymbolIcon>;
export const NotificationSymbol = ({ color = "#FF3366" }: SymbolProps) => <SymbolIcon color={color}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></SymbolIcon>;
export const MailSymbol = ({ color = "#0052FF" }: SymbolProps) => <SymbolIcon color={color}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" /></SymbolIcon>;
export const SearchSymbol = ({ color = "#0052FF" }: SymbolProps) => <SymbolIcon color={color}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></SymbolIcon>;
export const ViewSymbol = ({ color = "#0052FF" }: SymbolProps) => <SymbolIcon color={color}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></SymbolIcon>;
export const PrintSymbol = ({ color = "#0A0F24" }: SymbolProps) => <SymbolIcon color={color}><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" rx="1" /></SymbolIcon>;
export const EditSymbol = ({ color = "#0A0F24" }: SymbolProps) => <SymbolIcon color={color}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></SymbolIcon>;
export const DeleteSymbol = ({ color = "#FF3366" }: SymbolProps) => <SymbolIcon color={color}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></SymbolIcon>;
export const CallSymbol = ({ color = "#00E676" }: SymbolProps) => <SymbolIcon color={color}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></SymbolIcon>;
export const MessageSymbol = ({ color = "#0A0F24" }: SymbolProps) => <SymbolIcon color={color}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></SymbolIcon>;
export const ExportSymbol = ({ color = "#0052FF" }: SymbolProps) => <SymbolIcon color={color}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></SymbolIcon>;
export const ArrowUpSymbol = ({ color = "#00E676" }: SymbolProps) => <SymbolIcon color={color}><polyline points="18 15 12 9 6 15" /></SymbolIcon>;
export const ArrowDownSymbol = ({ color = "#FF3366" }: SymbolProps) => <SymbolIcon color={color}><polyline points="6 9 12 15 18 9" /></SymbolIcon>;
export const ArrowLeftSymbol = ({ color = "#0A0F24" }: SymbolProps) => <SymbolIcon color={color}><polyline points="15 18 9 12 15 6" /></SymbolIcon>;
export const ArrowRightSymbol = ({ color = "#0A0F24" }: SymbolProps) => <SymbolIcon color={color}><polyline points="9 18 15 12 9 6" /></SymbolIcon>;

export const AppearanceSymbol = ({ color = "#8A2BE2" }: SymbolProps) => <SymbolIcon color={color}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /><circle cx="12" cy="12" r="3" /></SymbolIcon>;
export const LogisticsSymbol = ({ color = "#0052FF" }: SymbolProps) => <SymbolIcon color={color}><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M7 17v4m10-4v4" /><path d="M2 10h20" /></SymbolIcon>;
export const ClinicalSymbol = ({ color = "#00E676" }: SymbolProps) => <SymbolIcon color={color}><path d="M10 2v7.5M14 2v7.5M8.5 2h7M12 12c-3.5 0-6 2.5-6 6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3c0-3.5-2.5-6-6-6z" /></SymbolIcon>;
export const BillingSymbol = ({ color = "#00E676" }: SymbolProps) => <SymbolIcon color={color}><circle cx="12" cy="12" r="10" /><path d="M12 6v12M9 9h6M9 15h6" /></SymbolIcon>;
export const SecuritySymbol = ({ color = "#0A0F24" }: SymbolProps) => <SymbolIcon color={color}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /><circle cx="12" cy="16" r="2" /></SymbolIcon>;
export const SupportSymbol = ({ color = "#00E676" }: SymbolProps) => <SymbolIcon color={color}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></SymbolIcon>;
export const TechnicianSymbol = ({ color = "#0A0F24" }: SymbolProps) => <SymbolIcon color={color}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><circle cx="16" cy="3.13" r="3" /></SymbolIcon>;
export const PulseSymbol = ({ color = "#FF3366" }: SymbolProps) => <SymbolIcon color={color}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /></SymbolIcon>;
export const PathologistSymbol = ({ color = "#0052FF" }: SymbolProps) => <SymbolIcon color={color}><circle cx="12" cy="7" r="4" /><path d="M5.5 21v-2a4 4 0 0 1 4-4h5a4 4 0 0 1 4 4v2" /><path d="M12 12v3m-2 2h4" /></SymbolIcon>;
export const TechnicianRoleSymbol = ({ color = "#00E676" }: SymbolProps) => <SymbolIcon color={color}><path d="M12 2l3 9h9l-7 5 3 9-8-7-8 7 3-9-7-5h9z" /><circle cx="12" cy="12" r="3" /></SymbolIcon>;
export const PhlebotomistSymbol = ({ color = "#FF3366" }: SymbolProps) => <SymbolIcon color={color}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /><path d="M12 12v6m-2-3h4" /></SymbolIcon>;
export const AdminRoleSymbol = ({ color = "#0A0F24" }: SymbolProps) => <SymbolIcon color={color}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 12l2 2 4-4" /><path d="M3 10h18" /></SymbolIcon>;

export const PlusSymbol = ({ color = "currentColor" }: SymbolProps) => <SymbolIcon color={color}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></SymbolIcon>;

export const IdentitySymbol = ({ color = "#0A0F24" }: SymbolProps) => (
  <SymbolIcon color={color}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
    <path d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" />
  </SymbolIcon>
);

export const LogoFlourishSymbol = () => (
  <svg className="absolute top-[60%] left-[8px] w-[24px] h-[8px] group-hover:opacity-0 transition-opacity" viewBox="0 0 30 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0,10 Q10,15 15,5 T30,0" stroke="#00E676" strokeWidth="4" strokeLinecap="round" fill="none" />
  </svg>
);
export const BuildingSymbol = ({ color }: SymbolProps) => (
  <SymbolIcon color={color}>
    <path d="M3 21h18" />
    <path d="M9 21V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v12" />
    <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
  </SymbolIcon>
);
