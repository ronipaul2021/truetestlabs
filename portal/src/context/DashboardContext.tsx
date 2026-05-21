"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Center {
  id: number;
  generatedId: string;
  name: string;
  isVerified: boolean;
  services: any[];
}

interface DashboardContextType {
  currentCenter: Center | null;
  setCurrentCenter: (center: Center | null) => void;
  centerLogo: string | null;
  setCenterLogo: (logo: string | null) => void;
  adminPhoto: string | null;
  setAdminPhoto: (photo: string | null) => void;
  requests: any[];
  setRequests: (requests: any[]) => void;
  refreshRequests: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isDarkMode: boolean;
  setDarkMode: (val: boolean) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const API_URL = "http://localhost:3000";

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [currentCenter, setCurrentCenter] = useState<Center | null>(null);
  const [centerLogo, setCenterLogo] = useState<string | null>(null);
  const [adminPhoto, setAdminPhoto] = useState<string | null>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [isDarkMode, setDarkMode] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>("");

  // Load from localStorage on init
  useEffect(() => {
    const savedCenter = localStorage.getItem("ttl_center");
    if (savedCenter) {
      setCurrentCenter(JSON.parse(savedCenter));
    } else {
      router.push('/');
    }

    const savedTheme = localStorage.getItem("ttl_theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, [router]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem("ttl_theme", "dark");
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem("ttl_theme", "light");
    }
  }, [isDarkMode]);

  const refreshProfile = async () => {
    if (!currentCenter) return;
    try {
      const resp = await fetch(`${API_URL}/centers/${currentCenter.id}`);
      const data = await resp.json();
      if (data && !data.error) {
        setCurrentCenter(data);
        localStorage.setItem("ttl_center", JSON.stringify(data));
      }
    } catch (e) {
      console.error("Profile sync failed");
    }
  };

  const refreshRequests = async () => {
    if (!currentCenter) return;
    try {
      const resp = await fetch(`${API_URL}/centers/${currentCenter.id}/requests`);
      const data = await resp.json();
      if (Array.isArray(data)) setRequests(data);
    } catch (e) {
      console.error("Queue sync failed");
    }
  };

  useEffect(() => {
    if (currentCenter) {
      refreshRequests();
      refreshProfile();
      const interval = setInterval(() => {
        refreshRequests();
        refreshProfile();
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [currentCenter?.id]);


  return (
    <DashboardContext.Provider value={{
      currentCenter,
      setCurrentCenter,
      centerLogo,
      setCenterLogo,
      adminPhoto,
      setAdminPhoto,
      requests,
      setRequests,
      refreshRequests,
      refreshProfile,
      isDarkMode,
      setDarkMode,
      globalSearchQuery,
      setGlobalSearchQuery
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
