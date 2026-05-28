"use client";

import { useState, useEffect } from "react";

interface Center {
  id: number;
  generatedId: string;
  name: string;
  latitude: number;
  longitude: number;
  phoneNumber: string;
  address: string;
  isVerified: boolean;
}

interface User {
  id: number;
  email: string;
  createdAt: string;
}

const API_URL = typeof window !== "undefined"
  ? `http://${window.location.hostname}:3000`
  : "http://localhost:3000";

export default function AdminDashboard() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<"centers" | "users">("centers");
  const [stats, setStats] = useState({ totalUsers: 0, totalCenters: 0, totalVerified: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [centersRes, usersRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/centers?all=true`),
        fetch(`${API_URL}/admin/users`),
        fetch(`${API_URL}/admin/stats`)
      ]);
      
      const centersData = await centersRes.json();
      const usersData = await usersRes.json();
      const statsData = await statsRes.json();

      setCenters(centersData.centers);
      setUsers(usersData.users);
      setStats(statsData);
    } catch (error) {
      console.error("Database connection failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const verifyCenter = async (id: number) => {
    try {
      await fetch(`${API_URL}/centers/${id}/verify`, { method: "PATCH" });
      fetchData();
    } catch (error) {
      console.error("Verification error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header & Stats Dashboard */}
        <header className="mb-10 bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                DEVELOPER<span className="text-blue-600">DATABASE</span>
              </h1>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.4em] mt-2">Platform Master Control</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full md:w-auto">
              <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 text-center">
                <span className="block text-xl font-black text-slate-900">{stats.totalCenters}</span>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Labs</span>
              </div>
              <div className="bg-blue-600 px-6 py-4 rounded-2xl text-center shadow-lg shadow-blue-100">
                <span className="block text-xl font-black text-white">{stats.totalVerified}</span>
                <span className="text-[10px] font-black uppercase text-blue-100 tracking-widest">Verified</span>
              </div>
              <div className="bg-emerald-50 px-6 py-4 rounded-2xl border border-emerald-100 text-center col-span-2 md:col-span-1">
                <span className="block text-xl font-black text-emerald-600">{stats.totalUsers}</span>
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Patient Users</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 mt-10 p-2 bg-slate-50 rounded-2xl border border-slate-100 w-fit">
            <button 
              onClick={() => setActiveTab("centers")}
              className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === "centers" ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              Laboratories
            </button>
            <button 
              onClick={() => setActiveTab("users")}
              className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === "users" ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              Patient Database
            </button>
          </div>
        </header>

        {/* Content Area */}
        {activeTab === "centers" ? (
          <div className="grid grid-cols-1 gap-6">
            {centers.map(center => (
              <div key={center.id} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300">
                <div className="flex flex-col lg:flex-row justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-3 h-3 rounded-full ${center.isVerified ? "bg-emerald-500" : "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]"}`}></div>
                      <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{center.name}</h2>
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-black">{center.generatedId}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-500">
                      <p><strong>Phone:</strong> {center.phoneNumber}</p>
                      <p><strong>Address:</strong> {center.address || "No Address"}</p>
                      <p><strong>Location:</strong> {center.latitude}, {center.longitude}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {center.isVerified ? (
                      <span className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl border border-emerald-100 font-black text-[10px] uppercase tracking-widest">Verified Lab</span>
                    ) : (
                      <button 
                        onClick={() => verifyCenter(center.id)}
                        className="bg-blue-600 hover:bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-100 uppercase text-xs tracking-widest transition-all active:scale-95"
                      >
                        Approve Center
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">User ID</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Email Address</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Registration Date</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-6 font-mono text-xs text-slate-400">#USR-{user.id}</td>
                    <td className="p-6 font-bold text-slate-700">{user.email}</td>
                    <td className="p-6 text-sm text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-6 text-right">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Active Patient</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="p-20 text-center text-slate-400 font-bold">No registered patients found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
