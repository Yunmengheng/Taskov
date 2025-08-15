"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar,
  FileText,
  BarChart3,
  Settings,
  Menu,
  LogOut,
  Columns3
} from "lucide-react";

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggle }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    console.log('Logout button clicked');
    try {
      signOut();
      console.log('SignOut function called');
      router.push('/Login');
    } catch (error) {
      console.error('Error during signOut:', error);
    }
  };

  const menuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      href: "/Dashboard",
      active: pathname === "/Dashboard"
    },
    {
      icon: <Columns3 size={20} />,
      label: "Task Board",
      href: "/KanbanView",
      active: pathname === "/KanbanView"
    },
    {
      icon: <CheckSquare size={20} />,
      label: "List View",
      href: "/listview",
      active: pathname === "/listview"
    },
    {
      icon: <Calendar size={20} />,
      label: "Calendar",
      href: "/calendar",
      active: pathname === "/calendar"
    },
    {
      icon: <BarChart3 size={20} />,
      label: "Analytics",
      href: "/analytics",
      active: pathname === "/analytics"
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      href: "/settings",
      active: pathname === "/settings"
    }
  ];

  return (
    <div className="fixed left-0 top-0 h-full z-50 group">
      {/* Sidebar - starts narrow with icons only, expands on hover */}
      <div className="bg-slate-800 border-r border-slate-700 h-full transition-all duration-300 ease-in-out w-16 group-hover:w-64 shadow-lg flex flex-col">
        {/* Sidebar content */}
        <div className="flex-1">
          {/* Menu items */}
          <nav className="space-y-1 p-2 mt-6">
            {menuItems.map((item) => (
              <div key={item.href} className="relative group/tooltip">
                <Link
                  href={item.href}
                  className={`flex items-center h-10 rounded-xl transition-colors relative ${
                    item.active
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  {/* Icon container - perfectly centered for collapsed state */}
                  <div className="w-12 h-10 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  
                  {/* Label - hidden by default, appears on sidebar hover */}
                  <span className="text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 overflow-hidden w-0 group-hover:w-auto pr-4">
                    {item.label}
                  </span>
                </Link>
                
                {/* Tooltip for collapsed state */}
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-slate-700 text-white text-sm rounded-lg opacity-0 group/tooltip-hover:opacity-100 group-hover:opacity-0 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none shadow-lg border border-slate-600">
                  {item.label}
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-700 border-l border-b border-slate-600 rotate-45"></div>
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Logout button at bottom */}
        <div className="p-2 border-t border-slate-700">
          <div className="relative group/tooltip">
            <button
              onClick={handleSignOut}
              className="flex items-center h-10 rounded-xl transition-colors w-full text-gray-400 hover:text-white hover:bg-red-600/20"
            >
              {/* Icon container - perfectly centered for collapsed state */}
              <div className="w-12 h-10 flex items-center justify-center flex-shrink-0">
                <LogOut size={20} />
              </div>
              
              {/* Label - hidden by default, appears on sidebar hover */}
              <span className="text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 overflow-hidden w-0 group-hover:w-auto pr-4">
                Sign Out
              </span>
            </button>
            
            {/* Tooltip for collapsed state */}
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-slate-700 text-white text-sm rounded-lg opacity-0 group/tooltip-hover:opacity-100 group-hover:opacity-0 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none shadow-lg border border-slate-600">
              Sign Out
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-700 border-l border-b border-slate-600 rotate-45"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
