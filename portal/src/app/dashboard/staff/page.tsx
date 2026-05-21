"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useDashboard } from '@/context/DashboardContext';
import { 
  StaffSymbol, CallSymbol, MessageSymbol, EditSymbol, PlusSymbol, 
  PulseSymbol, EfficiencySymbol, ArrowLeftSymbol, ArrowRightSymbol,
  PathologistSymbol, TechnicianRoleSymbol, PhlebotomistSymbol, AdminRoleSymbol,
  ExportSymbol, SearchSymbol, SuccessSymbol, NotificationSymbol, SecuritySymbol
} from '../components/Symbols';

type Tab = 'Directory' | 'Scheduling' | 'Performance' | 'Compliance' | 'Communication';
type StaffRole = 'All' | 'Pathologist' | 'Technician' | 'Phlebotomist' | 'Admin';
type DutyStatus = 'on-duty' | 'away' | 'off-duty';

interface StaffMember {
  id: number;
  name: string;
  role: Exclude<StaffRole, 'All'>;
  registrationNo: string;
  specialization: string;
  status: DutyStatus;
  shift: string;
  contributions: string;
  email: string;
  phone: string;
  performanceRating: number;
}

export default function StaffPage() {
  const { globalSearchQuery, setGlobalSearchQuery } = useDashboard();
  const [activeTab, setActiveTab] = useState<Tab>('Directory');
  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [filterRole, setFilterRole] = useState<StaffRole>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  React.useEffect(() => {
    setGlobalSearchQuery("");
  }, [setGlobalSearchQuery]);

  const [staff, setStaff] = useState<StaffMember[]>([
    { id: 1, name: 'Dr. Rahul Sharma', role: 'Pathologist', registrationNo: 'MCI-82910', specialization: 'Hematology', status: 'on-duty', shift: 'Morning (08:00 - 16:00)', contributions: '142 Reports', email: 'rahul.s@truetest.com', phone: '+91 98765 43210', performanceRating: 4.9 },
    { id: 2, name: 'Ananya Verma', role: 'Technician', registrationNo: 'DMLT-1029', specialization: 'Clinical Biochem', status: 'on-duty', shift: 'Morning (08:00 - 16:00)', contributions: '89 Tests', email: 'ananya.v@truetest.com', phone: '+91 88776 65544', performanceRating: 4.7 },
    { id: 3, name: 'Vikram Singh', role: 'Phlebotomist', registrationNo: 'CPT-5512', specialization: 'Home Collection', status: 'away', shift: 'Evening (16:00 - 00:00)', contributions: '56 Samples', email: 'vikram.s@truetest.com', phone: '+91 77665 54433', performanceRating: 4.8 },
    { id: 4, name: 'Dr. Sarah Smith', role: 'Pathologist', registrationNo: 'MCI-90123', specialization: 'Microbiology', status: 'off-duty', shift: 'Night (00:00 - 08:00)', contributions: '210 Reports', email: 'sarah.s@truetest.com', phone: '+91 66554 43322', performanceRating: 5.0 },
    { id: 5, name: 'Amit Patel', role: 'Admin', registrationNo: 'MHA-202', specialization: 'Operations', status: 'on-duty', shift: 'Morning (08:00 - 16:00)', contributions: 'Site Lead', email: 'amit.p@truetest.com', phone: '+91 55443 32211', performanceRating: 4.6 },
    { id: 6, name: 'Priya Mehta', role: 'Technician', registrationNo: 'DMLT-4091', specialization: 'Molecular Bio', status: 'on-duty', shift: 'Evening (16:00 - 00:00)', contributions: '124 Tests', email: 'priya.m@truetest.com', phone: '+91 44332 21100', performanceRating: 4.9 },
    { id: 7, name: 'Karan Malhotra', role: 'Phlebotomist', registrationNo: 'CPT-8821', specialization: 'Stat Collection', status: 'on-duty', shift: 'Morning (08:00 - 16:00)', contributions: '42 Samples', email: 'karan.m@truetest.com', phone: '+91 99887 76655', performanceRating: 4.5 },
    { id: 8, name: 'Dr. Meena Iyer', role: 'Pathologist', registrationNo: 'MCI-11200', specialization: 'Histopathology', status: 'away', shift: 'Morning (08:00 - 16:00)', contributions: '75 Reports', email: 'meena.i@truetest.com', phone: '+91 88779 90011', performanceRating: 4.8 },
    { id: 9, name: 'Suresh Raina', role: 'Technician', registrationNo: 'DMLT-7728', specialization: 'Immunology', status: 'on-duty', shift: 'Evening (16:00 - 00:00)', contributions: '110 Tests', email: 'suresh.r@truetest.com', phone: '+91 77668 85544', performanceRating: 4.7 },
  ]);

  const filteredStaff = useMemo(() => {
    return staff.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) || member.specialization.toLowerCase().includes(globalSearchQuery.toLowerCase()) || member.registrationNo.toLowerCase().includes(globalSearchQuery.toLowerCase());
      const matchesRole = filterRole === 'All' || member.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [staff, globalSearchQuery, filterRole]);

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const paginatedStaff = filteredStaff.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusStyle = (status: DutyStatus) => {
    switch (status) {
      case 'on-duty': return 'bg-[#E2F3E9] text-[#10B981] border-[#E2F3E9]';
      case 'away': return 'bg-[#FEF3C7] text-[#D97706] border-[#FEF3C7]';
      case 'off-duty': return 'bg-[#F3F4F6] text-[#9CA3AF] border-[#F3F4F6]';
    }
  };

  const renderDirectory = () => (
    <div className="flex flex-col h-full bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-sm font-black text-[#023e8a] uppercase tracking-widest">Active Personnel Directory</h2>
        <div className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-widest flex items-center gap-2">
           <div className="w-4 h-4 text-emerald-500"><PulseSymbol /></div>
           Active Presence: <span className="text-[#023e8a] font-black">{filteredStaff.length} Members</span>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto scrollbar-none overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-100">
              <th className="px-6 pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Personnel Identity</th>
              <th className="px-6 pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Registration No</th>
              <th className="px-6 pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status & Shift</th>
              <th className="px-6 pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Performance</th>
              <th className="px-6 pb-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedStaff.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                   <p className="text-[11px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] opacity-50">No staff records found</p>
                </td>
              </tr>
            ) : (
              paginatedStaff.map(member => (
                <tr key={member.id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#023e8a] flex items-center justify-center p-2 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-slate-200 transition-all">
                          {member.role === 'Pathologist' ? <PathologistSymbol /> : 
                           member.role === 'Technician' ? <TechnicianRoleSymbol /> : 
                           member.role === 'Phlebotomist' ? <PhlebotomistSymbol /> : 
                           <AdminRoleSymbol />}
                       </div>
                       <div>
                          <p className="text-xs font-black text-slate-800">{member.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-0.5">{member.phone}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                       <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{member.role}</p>
                       <p className="text-[9px] font-bold text-slate-400 mt-0.5">{member.registrationNo || 'N/A'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col gap-1.5 items-start">
                        <span className={`px-2.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${getStatusStyle(member.status)}`}>
                          {member.status}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-500">
                           <div className="w-3 h-3"><EfficiencySymbol /></div>
                           <p className="text-[9px] font-bold">{member.shift}</p>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className="text-xs font-black text-slate-800">{member.performanceRating.toFixed(1)}</span>
                       <div className="flex gap-0.5">
                         {[1,2,3,4,5].map(star => (
                           <svg key={star} className={`w-3 h-3 ${star <= member.performanceRating ? 'text-[#10B981]' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                         ))}
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 p-1.5 bg-white text-emerald-600 border border-slate-200 rounded-full hover:bg-emerald-50 hover:border-emerald-200 shadow-sm transition-all flex items-center justify-center">
                        <CallSymbol />
                      </button>
                      <button className="w-8 h-8 p-1.5 bg-white text-blue-600 border border-slate-200 rounded-full hover:bg-blue-50 hover:border-blue-200 shadow-sm transition-all flex items-center justify-center">
                        <MessageSymbol />
                      </button>
                      <button className="w-8 h-8 p-1.5 bg-white text-slate-600 border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all flex items-center justify-center">
                         <EditSymbol />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-2">
         <p className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest">
           Displaying {(currentPage - 1) * itemsPerPage + 1} — {Math.min(currentPage * itemsPerPage, filteredStaff.length)} of {filteredStaff.length} nodes
         </p>
         <div className="flex items-center gap-1 bg-[#F3F4F6] p-1 rounded-full">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="p-2 hover:bg-white rounded-full text-[#9CA3AF] disabled:opacity-30 transition-all"
            >
              <div className="w-4 h-4"><ArrowLeftSymbol /></div>
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-full text-[9px] font-black transition-all ${currentPage === i + 1 ? 'bg-[#111827] text-white shadow-md' : 'text-[#9CA3AF] hover:text-[#111827]'}`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-2 hover:bg-white rounded-full text-[#9CA3AF] disabled:opacity-30 transition-all"
            >
              <div className="w-4 h-4"><ArrowRightSymbol /></div>
            </button>
         </div>
      </div>
    </div>
  );

  const renderScheduling = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-4">
           {/* High-level coverage stats */}
           <div className="bg-white rounded-[24px] p-5 border border-slate-100 flex flex-col justify-between shadow-sm">
             <div className="flex items-center gap-2 mb-3">
               <div className="w-6 h-6 p-1.5 bg-emerald-50 rounded-lg text-emerald-600"><SuccessSymbol color="currentColor" /></div>
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Shifts</span>
             </div>
             <p className="text-3xl font-black text-[#023e8a]">124</p>
             <p className="text-[10px] font-bold text-emerald-500 mt-1">100% Coverage</p>
           </div>
           <div className="bg-white rounded-[24px] p-5 border border-slate-100 flex flex-col justify-between shadow-sm">
             <div className="flex items-center gap-2 mb-3">
               <div className="w-6 h-6 p-1.5 bg-amber-50 rounded-lg text-amber-600"><NotificationSymbol color="currentColor" /></div>
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Under-staffed</span>
             </div>
             <p className="text-3xl font-black text-amber-500">2</p>
             <p className="text-[10px] font-bold text-amber-600 mt-1">Friday Evening, Sunday Night</p>
           </div>
           <div className="bg-white rounded-[24px] p-5 border border-slate-100 flex flex-col justify-between shadow-sm">
             <div className="flex items-center gap-2 mb-3">
               <div className="w-6 h-6 p-1.5 bg-blue-50 rounded-lg text-blue-600"><PulseSymbol /></div>
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">On-Call Duty</span>
             </div>
             <p className="text-3xl font-black text-[#023e8a]">4</p>
             <p className="text-[10px] font-bold text-blue-500 mt-1">Active Rotation</p>
           </div>
           <div className="bg-white rounded-[24px] p-5 border border-slate-100 flex flex-col justify-between shadow-sm">
             <div className="flex items-center gap-2 mb-3">
               <div className="w-6 h-6 p-1.5 bg-purple-50 rounded-lg text-purple-600"><EfficiencySymbol /></div>
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">PTO / Holiday</span>
             </div>
             <p className="text-3xl font-black text-[#023e8a]">3</p>
             <p className="text-[10px] font-bold text-purple-500 mt-1">Approved Leaves</p>
           </div>
        </div>

        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex-1">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-black text-[#023e8a] uppercase tracking-widest">Weekly Master Schedule</h2>
              <button className="bg-slate-50 text-[#023e8a] px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors border border-slate-200">
                 May 10 - May 16, 2026
              </button>
           </div>
           
           <div className="grid grid-cols-7 gap-3">
              {days.map((day, idx) => (
                <div key={day} className="flex flex-col gap-2">
                  <div className={`p-3 rounded-2xl text-center ${idx === 4 ? 'bg-[#023e8a] text-white' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
                     <p className="text-[10px] font-black uppercase tracking-widest">{day}</p>
                     <p className="text-xs font-bold mt-1 opacity-80">{10 + idx} May</p>
                  </div>
                  
                  {/* Shift Blocks */}
                  <div className="flex flex-col gap-2 mt-2">
                    {/* Morning */}
                    <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl">
                       <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-2">Morning (08:00 - 16:00)</p>
                       <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between bg-white px-2 py-1.5 rounded-lg border border-emerald-100">
                             <span className="text-[9px] font-bold text-slate-700 truncate w-20">Dr. Sharma</span>
                             <span className="text-[7px] font-black text-white bg-blue-500 px-1 rounded uppercase">Path</span>
                          </div>
                          <div className="flex items-center justify-between bg-white px-2 py-1.5 rounded-lg border border-emerald-100">
                             <span className="text-[9px] font-bold text-slate-700 truncate w-20">A. Verma</span>
                             <span className="text-[7px] font-black text-white bg-emerald-500 px-1 rounded uppercase">Tech</span>
                          </div>
                       </div>
                    </div>

                    {/* Evening */}
                    <div className={`${idx === 4 ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-100'} border p-3 rounded-2xl`}>
                       <p className={`text-[8px] font-black uppercase tracking-widest mb-2 ${idx === 4 ? 'text-amber-600' : 'text-blue-600'}`}>Evening (16:00 - 00:00)</p>
                       <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between bg-white px-2 py-1.5 rounded-lg border border-blue-100">
                             <span className="text-[9px] font-bold text-slate-700 truncate w-20">P. Mehta</span>
                             <span className="text-[7px] font-black text-white bg-emerald-500 px-1 rounded uppercase">Tech</span>
                          </div>
                          {idx === 4 ? (
                            <div className="bg-amber-100 text-amber-700 px-2 py-1.5 rounded-lg border border-amber-200 text-center">
                               <span className="text-[8px] font-black uppercase tracking-widest">Need Phleb</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between bg-white px-2 py-1.5 rounded-lg border border-blue-100">
                               <span className="text-[9px] font-bold text-slate-700 truncate w-20">V. Singh</span>
                               <span className="text-[7px] font-black text-white bg-purple-500 px-1 rounded uppercase">Phleb</span>
                            </div>
                          )}
                       </div>
                    </div>

                    {/* Night */}
                    <div className="bg-slate-100 border border-slate-200 p-3 rounded-2xl opacity-70 hover:opacity-100 transition-opacity">
                       <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2">Night (00:00 - 08:00)</p>
                       <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between bg-white px-2 py-1.5 rounded-lg border border-slate-200">
                             <span className="text-[9px] font-bold text-slate-700 truncate w-20">Dr. Smith</span>
                             <span className="text-[7px] font-black text-white bg-blue-500 px-1 rounded uppercase">Path</span>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    );
  };

  const renderPerformance = () => (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-6">
         {/* KPI Cards */}
         <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Avg Tests Processed / Shift</h3>
            <div className="flex items-end gap-3">
               <p className="text-5xl font-black text-[#023e8a]">184</p>
               <p className="text-sm font-bold text-emerald-500 mb-1">+12%</p>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full mt-6 overflow-hidden">
               <div className="h-full bg-[#10B981] w-[78%]"></div>
            </div>
         </div>

         <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Error / Rejection Rate</h3>
            <div className="flex items-end gap-3">
               <p className="text-5xl font-black text-amber-500">0.8%</p>
               <p className="text-sm font-bold text-emerald-500 mb-1">-0.2%</p>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full mt-6 overflow-hidden">
               <div className="h-full bg-amber-500 w-[8%]"></div>
            </div>
         </div>

         <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Attendance Reliability</h3>
            <div className="flex items-end gap-3">
               <p className="text-5xl font-black text-[#023e8a]">98.5%</p>
               <p className="text-sm font-bold text-slate-400 mb-1">Target: 95%</p>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full mt-6 overflow-hidden">
               <div className="h-full bg-[#023e8a] w-[98.5%]"></div>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex-1">
        <h2 className="text-sm font-black text-[#023e8a] uppercase tracking-widest mb-6">Top Performers Matrix</h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="pb-4 text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest">Name</th>
              <th className="pb-4 text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest">Role</th>
              <th className="pb-4 text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest">Patient Satisfaction</th>
              <th className="pb-4 text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest">Avg TAT</th>
              <th className="pb-4 text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
             {[staff[3], staff[0], staff[5]].map((s, i) => (
               <tr key={i}>
                 <td className="py-4 font-bold text-sm text-slate-800">{s.name}</td>
                 <td className="py-4 text-xs font-bold text-slate-500">{s.role}</td>
                 <td className="py-4">
                   <div className="flex items-center gap-1 text-amber-400">
                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                     <span className="text-xs font-black text-slate-700">4.9/5</span>
                   </div>
                 </td>
                 <td className="py-4 text-xs font-bold text-emerald-600">3h 45m</td>
                 <td className="py-4 text-xs font-black text-[#023e8a]">{s.performanceRating}</td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCompliance = () => (
    <div className="grid grid-cols-2 gap-6 h-full">
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex flex-col">
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-sm font-black text-[#023e8a] uppercase tracking-widest">Certifications & Due Dates</h2>
           <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><SecuritySymbol /></div>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3">
           {[
             { name: 'Dr. Rahul Sharma', cert: 'NABL Internal Auditor', expires: '2026-06-15', status: 'warning' },
             { name: 'Ananya Verma', cert: 'Phlebotomy Standard Protocol', expires: '2026-05-12', status: 'expired' },
             { name: 'Priya Mehta', cert: 'Biohazard Safety Level 2', expires: '2027-01-20', status: 'valid' },
             { name: 'Dr. Sarah Smith', cert: 'ISO 15189 Quality Management', expires: '2026-08-10', status: 'valid' },
           ].map((c, i) => (
             <div key={i} className={`p-4 rounded-2xl border ${c.status === 'expired' ? 'bg-rose-50 border-rose-100' : c.status === 'warning' ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-start justify-between">
                   <div>
                      <p className="text-xs font-black text-slate-800">{c.cert}</p>
                      <p className="text-[10px] font-bold text-slate-500 mt-1">{c.name}</p>
                   </div>
                   <div className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${c.status === 'expired' ? 'bg-rose-500 text-white' : c.status === 'warning' ? 'bg-amber-400 text-amber-900' : 'bg-emerald-500 text-white'}`}>
                      {c.status === 'expired' ? 'Expired' : c.status === 'warning' ? 'Expiring Soon' : 'Valid'}
                   </div>
                </div>
                <p className="text-[9px] font-bold text-slate-400 mt-3 uppercase tracking-widest">Valid Until: {c.expires}</p>
             </div>
           ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 h-full">
         <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex-1">
            <h2 className="text-sm font-black text-[#023e8a] uppercase tracking-widest mb-6">Recent Audit Log</h2>
            <div className="relative border-l-2 border-slate-100 ml-3 flex flex-col gap-6">
               <div className="relative pl-6">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-white"></div>
                  <p className="text-xs font-bold text-slate-800">Dr. Sarah Smith accessed Patient #4022 High-Risk File</p>
                  <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Today, 14:02 PM</p>
               </div>
               <div className="relative pl-6">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-white"></div>
                  <p className="text-xs font-bold text-slate-800">Amit Patel uploaded New NABL Guidelines</p>
                  <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Yesterday, 09:15 AM</p>
               </div>
               <div className="relative pl-6">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-amber-500 ring-4 ring-white"></div>
                  <p className="text-xs font-bold text-slate-800">System Warning: 3 Failed Login Attempts for Admin Account</p>
                  <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">May 12, 23:45 PM</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );

  const renderCommunication = () => (
    <div className="flex flex-col gap-6 h-full">
       <div className="grid grid-cols-2 gap-6">
          <button className="bg-rose-50 border-2 border-rose-200 hover:bg-rose-100 hover:border-rose-300 transition-all rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 group">
             <div className="w-12 h-12 text-rose-500 group-hover:scale-110 transition-transform"><NotificationSymbol color="currentColor" /></div>
             <h3 className="text-lg font-black text-rose-700 uppercase tracking-widest">Broadcast Emergency Alert</h3>
             <p className="text-xs font-bold text-rose-500 text-center">Instantly push high-priority SMS/App notifications to all active staff.</p>
          </button>
          <button className="bg-blue-50 border-2 border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all rounded-[32px] p-8 flex flex-col items-center justify-center gap-4 group">
             <div className="w-12 h-12 text-blue-500 group-hover:scale-110 transition-transform"><CallSymbol color="currentColor" /></div>
             <h3 className="text-lg font-black text-blue-700 uppercase tracking-widest">Send Shift Change Request</h3>
             <p className="text-xs font-bold text-blue-500 text-center">Automate coverage requests for sick leaves and unstaffed slots.</p>
          </button>
       </div>

       <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 flex-1">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-sm font-black text-[#023e8a] uppercase tracking-widest">Training Video Library</h2>
             <button className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">Upload Video</button>
          </div>
          <div className="grid grid-cols-3 gap-6">
             {[
               { title: 'New Sysmex Analyzer Operations', duration: '12:45', author: 'Dr. Sharma' },
               { title: 'Biohazard Level 3 Protocol 2026', duration: '24:10', author: 'Safety Dept' },
               { title: 'Customer Experience Guidelines', duration: '08:30', author: 'HR Dept' }
             ].map((v, i) => (
                <div key={i} className="flex flex-col gap-3 group cursor-pointer">
                   <div className="w-full h-32 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center relative overflow-hidden group-hover:border-blue-300 transition-all">
                      <div className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center pl-1 text-slate-800 shadow-sm z-10 group-hover:scale-110 transition-transform">
                         <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-50 opacity-50"></div>
                      <span className="absolute bottom-2 right-2 bg-slate-800 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest z-10">{v.duration}</span>
                   </div>
                   <div>
                      <p className="text-xs font-black text-slate-800 group-hover:text-blue-600 transition-colors">{v.title}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Uploaded by {v.author}</p>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-[#E8EEF5] min-h-full">
      {/* 1. Sub-Dashboard Control Panel & Tabs */}
      <div className="p-6 pb-2">
        <div className="bg-white rounded-[32px] p-6 flex flex-col gap-5 shadow-sm border border-slate-100 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex items-center">
                <div className="w-12 h-12 bg-[#dcf0fa] rounded-2xl flex items-center justify-center relative z-10">
                  <div className="w-5 h-5 text-[#023e8a]">
                    <StaffSymbol />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black tracking-tight text-[#023e8a]">
                    Team Directory
                  </h1>
                </div>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-[0.15em] mt-1">Laboratory Staff & Role Management Hub</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/dashboard/staff/new" className="bg-[#03045e] text-white px-7 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center gap-2.5">
                <div className="w-4 h-4"><PlusSymbol color="white" /></div>
                Add Team Member
              </Link>
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full"></div>

          <div className="flex items-center gap-4 mt-1">
            {/* Tabbed Navigation Dropdown */}
            <div className="relative inline-block">
              <button
                onClick={() => setIsTabDropdownOpen(!isTabDropdownOpen)}
                className="flex items-center gap-3 px-6 py-2.5 bg-[#023e8a] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm hover:brightness-110 transition-all"
              >
                View: {activeTab}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isTabDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              {isTabDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-40">
                  {(['Directory', 'Scheduling', 'Performance', 'Compliance', 'Communication'] as Tab[]).map(tab => (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        setIsTabDropdownOpen(false);
                      }}
                      className={`w-full text-left px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-slate-50 text-[#023e8a] border border-slate-100' : 'text-slate-500 hover:bg-slate-50 hover:text-[#023e8a]'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Role Filter Dropdown (Only show on Directory Tab) */}
            {activeTab === 'Directory' && (
              <div className="relative inline-block">
                <button
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-[9px] font-black uppercase tracking-widest text-[#023e8a] hover:bg-slate-100 transition-colors shadow-sm"
                >
                  Role: {filterRole}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                {isRoleDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-40">
                    {['All', 'Pathologist', 'Technician', 'Phlebotomist', 'Admin'].map(role => (
                      <button
                        key={role}
                        onClick={() => {
                          setFilterRole(role as StaffRole);
                          setCurrentPage(1);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterRole === role ? 'bg-[#023e8a] text-white shadow-md' : 'text-slate-600 hover:bg-slate-50 hover:text-[#023e8a]'}`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Dynamic Content Area based on Active Tab */}
      <div className="flex-1 px-6 mt-4 pb-24 overflow-y-auto scrollbar-none">
         {activeTab === 'Directory' && renderDirectory()}
         {activeTab === 'Scheduling' && renderScheduling()}
         {activeTab === 'Performance' && renderPerformance()}
         {activeTab === 'Compliance' && renderCompliance()}
         {activeTab === 'Communication' && renderCommunication()}
      </div>
    </div>
  );
}
