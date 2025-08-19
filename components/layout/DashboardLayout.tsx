"use client";

import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Sidebar - shows icons by default, expands on hover */}
      <Sidebar />
      
      {/* Main content area - adjusted for sidebar width */}
      <div className="flex flex-col min-h-screen ml-16">
        <Header />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
