"use client";

import React from "react";
import { Sun, User } from "lucide-react";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Task Manager" }) => {
  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">{title}</h1>
        
        <div className="flex items-center space-x-4">
          
          {/* User profile */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <span className="text-sm text-gray-300">Google User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
