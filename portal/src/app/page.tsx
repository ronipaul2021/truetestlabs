"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:3000";

export default function CenterPortal() {
  const router = useRouter();
  const [view, setView] = useState<"login" | "register">("login");
  const [regStep, setRegStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedCenter = localStorage.getItem("ttl_center");
    if (savedCenter) {
      router.push("/dashboard");
    }
  }, [router]);

  const [regData, setRegData] = useState({
    name: "", ownerName: "", address: "", phoneNumber: "", email: "", googleMapUrl: "", password: "",
    isoNumber: "", nablNumber: "", gstNumber: "", tradeLicense: "",
    providesEmergency: false
  });

  const [files, setFiles] = useState<{ isoCertificate: File | null, nablCertificate: File | null }>({
    isoCertificate: null, nablCertificate: null
  });
  const [previews, setPreviews] = useState<{ iso: string | null, nabl: string | null }>({
    iso: null, nabl: null
  });

  const [loginData, setLoginData] = useState({ id: "", password: "" });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(regData).forEach(([key, value]) => formData.append(key, String(value)));
    if (files.isoCertificate) formData.append("isoCertificate", files.isoCertificate);
    if (files.nablCertificate) formData.append("nablCertificate", files.nablCertificate);

    try {
      const response = await fetch(`${API_URL}/centers/register`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`Success! ID: ${data.generatedId}`);
        setView("login");
        setRegStep(1);
      } else {
        setMessage(data.error || "Setup failed");
      }
    } catch (error) {
      setMessage("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/centers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generatedId: loginData.id, password: loginData.password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("ttl_center", JSON.stringify(data.center));
        router.push("/dashboard");
      } else {
        setMessage(data.error || "Access denied");
      }
    } catch (error) {
      setMessage("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden bg-[#E8EEF5]">
      {/* Left Branding Pane (Neo-Clinical Aesthetic) */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-12 lg:p-20 overflow-hidden bg-[#023e8a]">
        {/* Dynamic Orbs Background */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full bg-[#10B981] mix-blend-screen blur-[140px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#03045e] mix-blend-multiply blur-[100px] opacity-80"></div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/20 inline-flex items-center justify-center mb-12 shadow-2xl">
            <span className="text-2xl text-white font-black tracking-tight flex items-center gap-2">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
               TrueTest<span className="text-emerald-400">Labs</span>
            </span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[1.1] mb-6">
            Intelligent <br /><span className="text-emerald-400">Diagnostics.</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-md font-medium leading-relaxed opacity-90">
            Join the TrueTestLabs partner network. Streamline your operations, receive live patient requests, and deliver digital reports instantly through our clinical workstation.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
           </div>
           <div>
              <p className="text-white text-sm font-bold">Enterprise Security</p>
              <p className="text-blue-200 text-xs font-semibold">HIPAA & NABL Compliant</p>
           </div>
        </div>
      </div>

      {/* Right Auth Pane */}
      <div className="w-full lg:w-[55%] min-h-screen overflow-y-auto flex items-center justify-center p-6 sm:p-12 relative">
        <div className="max-w-xl w-full relative z-10">
           
          {/* Main Card */}
          <div className="bg-white rounded-[40px] shadow-xl shadow-slate-200/50 border border-white p-8 sm:p-12 transition-all">
             
            <div className="mb-10 text-center">
              <h2 className="text-3xl sm:text-4xl font-black text-[#023e8a] tracking-tight mb-3">
                {view === "login" ? "Welcome Back" : "Partner Setup"}
              </h2>
              <p className="text-[#9CA3AF] font-bold text-sm tracking-wide">
                {view === "login" ? "Securely access your clinical workstation." : "Initialize your diagnostic center profile in 3 steps."}
              </p>
            </div>

            {/* Premium Toggle */}
            <div className="flex p-1.5 bg-[#F3F4F6] rounded-2xl mb-10 border border-slate-100 shadow-inner">
              <button onClick={() => { setView("login"); setRegStep(1); }} className={`flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${view === "login" ? "bg-white shadow-sm border border-slate-200 text-[#023e8a]" : "text-slate-400 hover:text-slate-600"}`}>Login to Portal</button>
              <button onClick={() => setView("register")} className={`flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${view === "register" ? "bg-white shadow-sm border border-slate-200 text-[#023e8a]" : "text-slate-400 hover:text-slate-600"}`}>Register Center</button>
            </div>

            {view === "register" && (
              <div className="mb-10">
                <div className="flex justify-between mb-3">
                  <span className="text-[10px] font-black text-[#023e8a] uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Step {regStep} of 3</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-1">
                    {regStep === 1 ? "Identity Verification" : regStep === 2 ? "Compliance Docs" : "Emergency Services"}
                  </span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3].map(s => (
                    <div key={s} className={`h-2 rounded-full flex-1 transition-all duration-500 ${regStep >= s ? "bg-[#10B981]" : "bg-slate-100"}`}></div>
                  ))}
                </div>
              </div>
            )}

            {view === "login" ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Center ID</label>
                  <input type="text" placeholder="TTL-XXXX" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-[#023e8a] shadow-sm hover:border-blue-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300 placeholder:font-semibold" required onChange={e => setLoginData({ ...loginData, id: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Password</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-[#023e8a] shadow-sm hover:border-blue-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300 placeholder:font-semibold" required onChange={e => setLoginData({ ...loginData, password: e.target.value })} />
                </div>
                <button disabled={loading} className="w-full bg-[#03045e] hover:bg-[#023e8a] text-white py-5 rounded-2xl text-[11px] tracking-widest font-black uppercase transition-all shadow-lg shadow-blue-900/20 mt-4 disabled:opacity-70">
                  {loading ? "Verifying Credentials..." : "Access Workstation"}
                </button>
              </form>
            ) : (
              <form onSubmit={regStep === 3 ? handleRegister : (e) => { e.preventDefault(); setRegStep(regStep + 1); }} className="space-y-6">
                {regStep === 1 && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Diagnostic Center Name <span className="text-rose-500">*</span></label>
                      <input type="text" placeholder="e.g. ABC Diagnostics" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-[#023e8a] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300" required value={regData.name} onChange={e => setRegData({ ...regData, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Owner Full Name <span className="text-rose-500">*</span></label>
                      <input type="text" placeholder="e.g. Sarah Johnson" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-[#023e8a] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300" required value={regData.ownerName} onChange={e => setRegData({ ...regData, ownerName: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Contact Phone <span className="text-rose-500">*</span></label>
                      <input type="text" placeholder="+1 555 000-0000" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-[#023e8a] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300" required value={regData.phoneNumber} onChange={e => setRegData({ ...regData, phoneNumber: e.target.value })} />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Address <span className="text-rose-500">*</span></label>
                      <input type="text" placeholder="Complete address" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-[#023e8a] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300" required value={regData.address} onChange={e => setRegData({ ...regData, address: e.target.value })} />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Official Email Address <span className="text-rose-500">*</span></label>
                      <input type="email" placeholder="admin@center.com" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-[#023e8a] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300" required value={regData.email} onChange={e => setRegData({ ...regData, email: e.target.value })} />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Google Maps URL <span className="text-rose-500">*</span></label>
                      <input type="url" placeholder="https://maps.google.com/..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-[#023e8a] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300" required value={regData.googleMapUrl} onChange={e => setRegData({ ...regData, googleMapUrl: e.target.value })} />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Security Password <span className="text-rose-500">*</span></label>
                      <input type="password" placeholder="Create a strong password" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-[#023e8a] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300" required value={regData.password} onChange={e => setRegData({ ...regData, password: e.target.value })} />
                    </div>
                  </div>
                )}

                {regStep === 2 && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">ISO Certification No. <span className="text-rose-500">*</span></label>
                        <input type="text" placeholder="ISO-9001-2015" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-[#023e8a] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300" required value={regData.isoNumber} onChange={e => setRegData({ ...regData, isoNumber: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">NABL Certification No. <span className="text-rose-500">*</span></label>
                        <input type="text" placeholder="NABL-MC-2023" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-[#023e8a] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300" required value={regData.nablNumber} onChange={e => setRegData({ ...regData, nablNumber: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">GST Registration <span className="text-rose-500">*</span></label>
                        <input type="text" placeholder="22AAAAA0000A1Z5" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-[#023e8a] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300" required value={regData.gstNumber} onChange={e => setRegData({ ...regData, gstNumber: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Trade License <span className="text-rose-500">*</span></label>
                        <input type="text" placeholder="TL-2023-XYZ" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-[#023e8a] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-300" required value={regData.tradeLicense} onChange={e => setRegData({ ...regData, tradeLicense: e.target.value })} />
                      </div>
                    </div>

                    <div className="p-6 border-2 border-dashed border-slate-200 hover:border-blue-400 transition-colors rounded-[24px] bg-slate-50 group">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 flex items-center justify-between">
                        <span>Upload ISO Certificate <span className="text-rose-500">*</span></span>
                        <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                      </p>
                      <input type="file" accept="image/*,.pdf" className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-all cursor-pointer" required onChange={e => {
                        const file = e.target.files?.[0] || null;
                        setFiles({ ...files, isoCertificate: file });
                        if (file && file.type.startsWith('image/')) {
                          setPreviews({ ...previews, iso: URL.createObjectURL(file) });
                        } else {
                          setPreviews({ ...previews, iso: null });
                        }
                      }} />
                      {previews.iso && (
                        <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 h-32 w-full bg-white shadow-sm relative group-hover:border-blue-300 transition-colors">
                          <img src={previews.iso} alt="ISO Preview" className="w-full h-full object-contain" />
                        </div>
                      )}
                    </div>

                    <div className="p-6 border-2 border-dashed border-slate-200 hover:border-blue-400 transition-colors rounded-[24px] bg-slate-50 group">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 flex items-center justify-between">
                        <span>Upload NABL Certificate <span className="text-rose-500">*</span></span>
                        <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                      </p>
                      <input type="file" accept="image/*,.pdf" className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-all cursor-pointer" required onChange={e => {
                        const file = e.target.files?.[0] || null;
                        setFiles({ ...files, nablCertificate: file });
                        if (file && file.type.startsWith('image/')) {
                          setPreviews({ ...previews, nabl: URL.createObjectURL(file) });
                        } else {
                          setPreviews({ ...previews, nabl: null });
                        }
                      }} />
                      {previews.nabl && (
                        <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 h-32 w-full bg-white shadow-sm relative group-hover:border-blue-300 transition-colors">
                          <img src={previews.nabl} alt="NABL Preview" className="w-full h-full object-contain" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {regStep === 3 && (
                  <div className="space-y-8 text-center py-10 border border-slate-100 rounded-[32px] bg-slate-50 shadow-inner">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-2 shadow-sm border border-slate-200">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF3366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                    </div>
                    <h3 className="text-2xl font-black text-[#023e8a] tracking-tight">Emergency Services</h3>
                    <p className="text-slate-500 text-sm font-bold px-6">Are you providing rapid emergency services for critical reports?</p>

                    <div className="flex gap-4 px-6">
                      <button type="button" onClick={() => setRegData({ ...regData, providesEmergency: true })} className={`flex-1 py-5 rounded-[20px] font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${regData.providesEmergency === true ? "bg-[#10B981] text-white shadow-lg shadow-emerald-500/20" : "bg-white text-slate-400 border border-slate-200 hover:border-emerald-300 hover:text-emerald-500"}`}>
                        Yes, We Do
                      </button>
                      <button type="button" onClick={() => setRegData({ ...regData, providesEmergency: false })} className={`flex-1 py-5 rounded-[20px] font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${regData.providesEmergency === false ? "bg-slate-300 text-slate-600 shadow-inner border border-slate-300" : "bg-white text-slate-400 border border-slate-200 hover:border-slate-300"}`}>
                        No, Not Yet
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  {regStep > 1 && (
                    <button type="button" onClick={() => setRegStep(regStep - 1)} className="flex-1 bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 py-5 rounded-2xl uppercase text-[11px] tracking-widest font-black transition-all">
                      Back
                    </button>
                  )}
                  <button type="submit" disabled={loading} className="flex-[2] bg-[#10B981] hover:bg-emerald-600 text-white py-5 rounded-2xl uppercase text-[11px] tracking-widest font-black transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-70">
                    {loading ? "Processing..." : regStep === 3 ? "Complete Setup" : "Continue"}
                  </button>
                </div>
              </form>
            )}

            {message && (
               <div className={`mt-8 text-center p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border animate-pulse ${message.includes('Success') ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                  {message}
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
