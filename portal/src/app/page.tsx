"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// ─── Inline SVG icons ──────────────────────────────────────────────────────────
const Ico = ({ d, size = 18, sw = 1.6 }: { d: string; size?: number; sw?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const PulseIco   = () => <Ico d="M22 12h-4l-3 9L9 3l-3 9H2" />;
const BuildingIco= () => <Ico d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />;
const UserIco    = () => <Ico d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />;
const ChevronRIco= () => <Ico d="m9 18 6-6-6-6" />;
const ShieldIco  = () => <Ico d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const CheckIco   = () => <Ico d="M20 6L9 17l-5-5" />;
const ZapIco     = () => <Ico d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />;
const BarChartIco= () => <Ico d="M18 20V10M12 20V4M6 20v-6" />;
const FlaskIco   = () => <Ico d="M10 2v7.5M14 2v7.5M8.5 2h7M12 12c-3.5 0-6 2.5-6 6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3c0-3.5-2.5-6-6-6z" />;
const AppleIco   = () => <Ico d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z M10 2c1 .5 2 2 2 5" />;
const PlayStoreIco = () => <Ico d="M3 2v20l18-10L3 2z M3 2l11 14 M3 22l11-14" />;
const FileIco    = () => <Ico d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />;
const MapPinIco  = () => <Ico d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0" />;


export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Animated background orbs ──────────────────────────────────────────────
  const orbs = [
    { c: '#6366F1', x: '10%', y: '10%', s: 400, delay: '0s', dur: '10s' },
    { c: '#10B981', x: '85%', y: '20%', s: 350, delay: '2s', dur: '12s' },
    { c: '#6366F1', x: '50%', y: '60%', s: 500, delay: '4s', dur: '15s' },
    { c: '#F43F5E', x: '15%', y: '80%', s: 250, delay: '1s', dur: '11s' },
  ];

  return (
    <div className="min-h-screen bg-[#0F1629] font-[Montserrat,ui-sans-serif,system-ui,sans-serif] text-white selection:bg-[#6366F1] selection:text-white overflow-x-hidden">
      
      {/* ── Background Effects ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {orbs.map((o, i) => (
          <div key={i} className="absolute rounded-full blur-[100px] opacity-[0.08] animate-pulse"
            style={{ background: o.c, left: o.x, top: o.y, width: o.s, height: o.s, animationDelay: o.delay, animationDuration: o.dur }} />
        ))}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0D1829]/80 backdrop-blur-xl border-b border-white/[0.05] py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/ttl-final.png" alt="TrueTestLabs Logo" className="w-8 h-8 object-contain" />
              <span className="text-[20px] font-black text-white tracking-tight">
                TrueTest<span className="text-[#10B981]">Labs</span>
              </span>
            </div>

          <div className="hidden md:flex items-center gap-8 text-[13px] font-bold">
            <a href="#patients" className="text-white/70 hover:text-white transition-colors">For Patients</a>
            <a href="#partners" className="text-white/70 hover:text-[#10B981] transition-colors">For Diagnostics</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/auth')}
              className="px-5 py-2.5 rounded-full text-[13px] font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#10B981] hover:opacity-90 shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all">
              Partner With Us
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative z-10 pt-40 pb-20 px-6 min-h-[90vh] flex flex-col justify-center">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] text-[11px] font-bold text-white/70 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              India's Fastest Growing Diagnostic Network
            </div>
            
            <h1 className="text-[52px] sm:text-[64px] lg:text-[72px] font-black leading-[1.05] tracking-tight">
              Your Health, <br/>
              Your Labs, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] via-[#818CF8] to-[#10B981]">
                One Tap Away.
              </span>
            </h1>
            
            <p className="text-[16px] sm:text-[18px] text-white/60 leading-relaxed max-w-lg font-medium">
              The smartest way to book diagnostic tests, access digital reports, and manage your family's health. Partnering with top verified diagnostic centers near you.
            </p>

            {/* B2C CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="#" className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white text-black hover:bg-gray-100 transition-all font-bold group">
                <AppleIco />
                <div className="text-left">
                  <p className="text-[9px] uppercase tracking-widest text-black/60 font-black">Download on the</p>
                  <p className="text-[15px] leading-tight group-hover:scale-105 transition-transform">App Store</p>
                </div>
              </a>
              <a href="#" className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[#162035] border border-white/[0.1] hover:border-white/[0.2] hover:bg-[#1E293B] transition-all font-bold group">
                <PlayStoreIco />
                <div className="text-left">
                  <p className="text-[9px] uppercase tracking-widest text-white/50 font-black">GET IT ON</p>
                  <p className="text-[15px] leading-tight text-white group-hover:scale-105 transition-transform">Google Play</p>
                </div>
              </a>
            </div>
            
            <div className="pt-6 flex items-center gap-6 text-[12px] font-bold text-white/40">
              <span className="flex items-center gap-1.5"><ShieldIco /> Secure Data</span>
              <span className="flex items-center gap-1.5"><CheckIco /> Verified Labs</span>
              <span className="flex items-center gap-1.5"><ZapIco /> Instant Reports</span>
            </div>
          </div>

          {/* Abstract Hero Graphic */}
          <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-200 hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#6366F1]/20 to-[#10B981]/20 rounded-full blur-[80px]" />
            <div className="relative h-[600px] w-full rounded-[40px] bg-[#162035]/50 border border-white/[0.08] backdrop-blur-2xl p-6 shadow-2xl flex flex-col gap-4 overflow-hidden">
               {/* Mockup elements simulating the platform */}
               <div className="w-full h-12 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center px-4 gap-3">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6366F1] to-[#10B981] p-0.5">
                   <div className="w-full h-full bg-[#0D1829] rounded-full flex items-center justify-center"><UserIco /></div>
                 </div>
                 <div className="flex-1">
                   <div className="w-24 h-2 bg-white/20 rounded-full mb-1"></div>
                   <div className="w-16 h-1.5 bg-white/10 rounded-full"></div>
                 </div>
                 <div className="w-16 h-6 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center text-[9px] font-bold">Healthy</div>
               </div>

               <div className="flex gap-4">
                 <div className="flex-1 h-32 rounded-2xl bg-gradient-to-br from-[#6366F1]/10 to-transparent border border-[#6366F1]/20 p-4">
                   <div className="text-[#6366F1] mb-2"><FlaskIco /></div>
                   <div className="text-[12px] font-bold text-white mb-1">Complete Blood Count</div>
                   <div className="text-[10px] text-white/40">Apollo Diagnostics</div>
                 </div>
                 <div className="flex-1 h-32 rounded-2xl bg-gradient-to-br from-[#10B981]/10 to-transparent border border-[#10B981]/20 p-4">
                    <div className="text-[#10B981] mb-2"><FileIco /></div>
                   <div className="text-[12px] font-bold text-white mb-1">View Report</div>
                   <div className="text-[10px] text-white/40">Generated Today</div>
                 </div>
               </div>

               <div className="flex-1 rounded-2xl bg-[#0D1829]/80 border border-white/[0.05] p-5 mt-4 flex flex-col gap-3">
                 <div className="flex justify-between items-center mb-2">
                   <div className="text-[13px] font-bold text-white">Recent Vital Trends</div>
                   <BarChartIco />
                 </div>
                 {[70, 45, 90, 60, 85].map((w, idx) => (
                   <div key={idx} className="flex items-center gap-3">
                     <div className="w-6 text-[9px] text-white/30 font-mono">0{idx+1}</div>
                     <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-gradient-to-r from-[#6366F1] to-[#10B981] rounded-full" style={{width: `${w}%`}}></div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── B2C Features Section (Patients) ── */}
      <section id="patients" className="relative z-10 py-24 bg-[#0D1829]/40 border-y border-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/20 text-[11px] font-bold text-[#6366F1] uppercase tracking-widest mb-6">
              <AppleIco /> Why Download The App?
            </div>
            <h2 className="text-[32px] sm:text-[40px] font-black text-white mb-4">Your Health Command Center</h2>
            <p className="text-[16px] text-white/50 max-w-2xl mx-auto font-medium">
              We make diagnostic testing as simple as ordering food. The TrueTestLabs app is the only tool you need to take control of your lifetime medical data.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <MapPinIco />, title: "Home Collection in Seconds", desc: "Don't wait in clinic queues. Book verified phlebotomists to collect samples from your sofa." },
              { icon: <ZapIco />, title: "Smart Digital Reports", desc: "No more paper files. View interactive, trend-analyzed reports directly on your phone." },
              { icon: <BarChartIco />, title: "Lifetime Health Tracking", desc: "Automatically track your vital markers over years. Spot health trends before they become issues." },
              { icon: <UserIco />, title: "Manage Family Health", desc: "Add your parents and kids to a single dashboard. Book their tests and monitor their reports seamlessly." }
            ].map((feat, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/[0.05] rounded-[24px] p-8 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center text-[#6366F1] mb-6 group-hover:scale-110 group-hover:bg-[#6366F1] group-hover:text-white transition-all duration-300">
                  {feat.icon}
                </div>
                <h3 className="text-[20px] font-bold text-white mb-3">{feat.title}</h3>
                <p className="text-[14px] text-white/50 leading-relaxed font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── B2B CTA Section (Diagnostic Centers) ── */}
      <section id="partners" className="relative z-10 py-32 px-6 overflow-hidden">
        {/* Background glow for this specific section */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#10B981]/5 to-transparent pointer-events-none" />
        
        <div className="max-w-5xl mx-auto bg-[#162035] border border-[#10B981]/20 rounded-[40px] p-10 sm:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#10B981] rounded-full blur-[100px] opacity-20 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-3/5 space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[11px] font-bold text-[#10B981] uppercase tracking-widest">
                <BuildingIco /> For Diagnostic Centers
              </div>
              <h2 className="text-[36px] sm:text-[44px] font-black text-white leading-tight">
                Grow Your Diagnostic <br/> Business With Us.
              </h2>
              <p className="text-[16px] text-white/60 font-medium leading-relaxed">
                Join thousands of leading laboratories scaling their patient reach, automating report delivery, and streamlining operations with the TrueTestLabs Partner Portal.
              </p>
              <ul className="grid sm:grid-cols-2 gap-3 text-[14px] font-bold text-white/80 pt-2">
                <li className="flex items-center gap-2"><div className="text-[#10B981]"><CheckIco /></div> Instant Patient Flow</li>
                <li className="flex items-center gap-2"><div className="text-[#10B981]"><CheckIco /></div> Revenue Analytics</li>
                <li className="flex items-center gap-2"><div className="text-[#10B981]"><CheckIco /></div> Secure Cloud Storage</li>
                <li className="flex items-center gap-2"><div className="text-[#10B981]"><CheckIco /></div> Zero Setup Fees</li>
              </ul>
            </div>
            
            <div className="md:w-2/5 flex flex-col justify-center gap-4 w-full">
              <button 
                onClick={() => router.push('/auth')}
                className="w-full py-5 rounded-2xl text-[16px] font-black text-white bg-gradient-to-r from-[#10B981] to-[#059669] hover:opacity-90 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2 group">
                Register Your Center Now <span className="group-hover:translate-x-1 transition-transform"><ChevronRIco /></span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 bg-[#0A101C] border-t border-white/[0.05] pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <img src="/ttl-final.png" alt="TrueTestLabs Logo" className="w-8 h-8 object-contain" />
              <span className="text-[20px] font-black tracking-tight">
                TrueTest<span className="text-[#10B981]">Labs</span>
              </span>
            </div>
            <p className="text-[13px] text-white/40 leading-relaxed font-medium mb-6">
              Empowering patients and diagnostic centers with seamless healthcare technology.
            </p>
            <div className="flex items-center gap-4 text-white/30">
              <div className="hover:text-white cursor-pointer transition-colors"><MailIco /></div>
              <div className="hover:text-white cursor-pointer transition-colors"><PhoneIco /></div>
            </div>
          </div>
          
          <div>
            <h4 className="text-[13px] font-black text-white mb-6 uppercase tracking-widest">Platform</h4>
            <ul className="space-y-4 text-[13px] font-medium text-white/50">
              <li><a href="#patients" className="hover:text-[#6366F1] transition-colors">Patient App</a></li>
              <li><a href="#" className="hover:text-[#6366F1] transition-colors">Book a Test</a></li>
              <li><a href="#" className="hover:text-[#6366F1] transition-colors">Health Packages</a></li>
              <li><a href="/auth" className="hover:text-[#10B981] transition-colors text-[#10B981]/80">Lab Login</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[13px] font-black text-white mb-6 uppercase tracking-widest">Company</h4>
            <ul className="space-y-4 text-[13px] font-medium text-white/50">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-black text-white mb-6 uppercase tracking-widest">Get The App</h4>
            <div className="flex flex-col gap-3">
              <a href="#" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] transition-colors">
                <AppleIco /> <span className="text-[12px] font-bold">App Store</span>
              </a>
              <a href="#" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] transition-colors">
                <PlayStoreIco /> <span className="text-[12px] font-bold">Google Play</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] font-medium text-white/30">
          <p>© 2026 TrueTestLabs Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ── Icons used in footer ──
const MailIco = () => <Ico d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22,6 12,13 2,6" />;
const PhoneIco = () => <Ico d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.1 3.37a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />;
