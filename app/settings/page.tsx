"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Home,
  Calendar,
  BarChart3,
  Moon,
  Sun,
  Eye,
} from "lucide-react";

const Settings: React.FC = () => {
  const { user, signOut } = useAuth();

  // Static display data - no state management needed
  const displaySettings = {
    notifications: {
      email: true,
      push: false,
      taskReminders: true,
      weeklyReports: false
    },
    appearance: {
      theme: 'dark',
      compactMode: false,
      showCompleted: true
    },
    privacy: {
      profileVisible: true,
      shareAnalytics: false
    }
  };

  const displayProfile = {
    name: user?.email?.split('@')[0] || 'User',
    email: user?.email || 'user@example.com'
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with navigation */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
            <div className="flex items-center space-x-4">
              <Link href="/Dashboard" className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                <Home size={16} className="mr-1" />
                Dashboard
              </Link>
              <Link href="/calendar" className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                <Calendar size={16} className="mr-1" />
                Calendar
              </Link>
              <Link href="/analytics" className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                <BarChart3 size={16} className="mr-1" />
                Analytics
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Settings */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Profile Information - Display Only */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex items-center mb-6">
                <User size={20} className="text-blue-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Profile Information</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <div className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-gray-300">
                    {displayProfile.name}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <div className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-gray-300">
                    {displayProfile.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Password Change - Display Only */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex items-center mb-6">
                <Shield size={20} className="text-green-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Password Settings</h3>
              </div>
              
              <div className="space-y-4">
                <div className="text-gray-300">
                  <p className="text-sm">Password was last changed 30 days ago</p>
                  <p className="text-xs text-gray-400 mt-1">For security, we recommend changing your password regularly</p>
                </div>
              </div>
            </div>

            {/* Notifications - Display Only */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex items-center mb-6">
                <Bell size={20} className="text-yellow-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Notifications</h3>
              </div>
              
              <div className="space-y-4">
                {Object.entries(displaySettings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <div className={`w-11 h-6 rounded-full flex items-center ${value ? 'bg-blue-600' : 'bg-slate-600'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${value ? 'translate-x-5' : 'translate-x-1'}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Appearance - Display Only */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex items-center mb-6">
                <Palette size={20} className="text-purple-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Appearance</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Theme</span>
                  <div className="flex items-center space-x-2">
                    <Sun size={16} className="text-gray-400" />
                    <div className="w-11 h-6 bg-blue-600 rounded-full flex items-center">
                      <div className="w-5 h-5 bg-white rounded-full translate-x-5"></div>
                    </div>
                    <Moon size={16} className="text-blue-400" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Compact Mode</span>
                  <div className="w-11 h-6 bg-slate-600 rounded-full flex items-center">
                    <div className="w-5 h-5 bg-white rounded-full translate-x-1"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Show Completed</span>
                  <div className="w-11 h-6 bg-blue-600 rounded-full flex items-center">
                    <div className="w-5 h-5 bg-white rounded-full translate-x-5"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy - Display Only */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <div className="flex items-center mb-6">
                <Eye size={20} className="text-orange-400 mr-2" />
                <h3 className="text-lg font-semibold text-white">Privacy</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Profile Visible</span>
                  <div className="w-11 h-6 bg-blue-600 rounded-full flex items-center">
                    <div className="w-5 h-5 bg-white rounded-full translate-x-5"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Share Analytics</span>
                  <div className="w-11 h-6 bg-slate-600 rounded-full flex items-center">
                    <div className="w-5 h-5 bg-white rounded-full translate-x-1"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Account Actions</h3>
              <div className="space-y-3">
                <button 
                  disabled 
                  className="w-full px-4 py-2 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed"
                >
                  Export Data (Coming Soon)
                </button>
                <button 
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;