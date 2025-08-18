"use client";

import React, { useState } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Users, 
  Calendar, 
  Settings, 
  Shield,
  UserPlus,
  ClipboardList,
  Target,
  Clock,
  Trash2,
  Edit3
} from "lucide-react";

export default function AdminPage() {
  // Mock data for display
  const [users] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Manager' },
  ]);

  const [tasks] = useState([
    { id: 1, title: 'Fix login bug', description: 'Resolve authentication issues', priority: 'High', status: 'Pending' },
    { id: 2, title: 'Update UI design', description: 'Implement new design system', priority: 'Medium', status: 'In Progress' },
    { id: 3, title: 'Write documentation', description: 'Create API documentation', priority: 'Low', status: 'Pending' },
  ]);

  const [assignments] = useState([
    { id: 1, userId: 1, taskId: 1, assignedDate: '2024-08-15', dueDate: '2024-08-25' },
    { id: 2, userId: 2, taskId: 2, assignedDate: '2024-08-16', dueDate: '2024-08-30' },
  ]);

  const getUserName = (userId: number) => users.find(user => user.id === userId)?.name || 'Unknown';
  const getTaskTitle = (taskId: number) => tasks.find(task => task.id === taskId)?.title || 'Unknown';

  // Priority styles matching Dashboard
  const priorityStyles: { [key: string]: string } = {
    Low: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    Medium: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    High: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  };

  const statusStyles: { [key: string]: string } = {
    Pending: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
    "In Progress": "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    Completed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  };

  const roleStyles: { [key: string]: string } = {
    Developer: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    Designer: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    Manager: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  };

  return (
    <DashboardLayout>
      <div className="w-full px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <div className="flex items-center gap-1 px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full text-sm">
                <Shield size={14} />
                ADMIN
              </div>
            </div>
            <p className="text-slate-400">
              Manage task assignments and user responsibilities
            </p>
          </div>
          
          <button className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg hover:shadow-xl">
            <UserPlus size={20} className="mr-2" />
            Add User
          </button>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white mt-1">{users.length}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <Users size={24} className="text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Tasks</p>
                <p className="text-3xl font-bold text-white mt-1">{tasks.length}</p>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <ClipboardList size={24} className="text-emerald-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Assignments</p>
                <p className="text-3xl font-bold text-white mt-1">{assignments.length}</p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <Target size={24} className="text-amber-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Task Assignment Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Settings size={20} className="text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Assign Task to User</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Select User</label>
              <select className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                <option value="">Choose a user...</option>
                {users.map(user => (
                  <option key={user.id} value={user.id} className="bg-slate-800">
                    {user.name} - {user.role}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Select Task</label>
              <select className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                <option value="">Choose a task...</option>
                {tasks.map(task => (
                  <option key={task.id} value={task.id} className="bg-slate-800">
                    {task.title} - {task.priority}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Due Date</label>
              <input
                type="date"
                className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          
          <button className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">
            <Calendar size={20} className="mr-2" />
            Assign Task
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Current Assignments - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Target size={20} className="text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Current Assignments</h2>
                </div>
              </div>

              <div className="space-y-4">
                {assignments.length > 0 ? (
                  assignments.map(assignment => (
                    <div key={assignment.id} className="group bg-slate-800/80 hover:bg-slate-700/80 p-4 rounded-xl border border-slate-600/50 transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-white">
                              {getUserName(assignment.userId)}
                            </h3>
                            <span className="text-slate-400">→</span>
                            <h3 className="font-medium text-white">
                              {getTaskTitle(assignment.taskId)}
                            </h3>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              <span>Assigned: {assignment.assignedDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={12} />
                              <span>Due: {assignment.dueDate}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors">
                            <Edit3 size={14} />
                          </button>
                          <button className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-600 rounded-lg transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Target size={48} className="mx-auto text-slate-600 mb-4" />
                    <p className="text-slate-400 text-lg">No assignments yet</p>
                    <p className="text-slate-500 text-sm">Create your first task assignment</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Users Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Users Overview */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users size={20} className="text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Users</h2>
              </div>

              <div className="space-y-3">
                {users.map(user => (
                  <div key={user.id} className="group bg-slate-800/80 hover:bg-slate-700/80 p-4 rounded-xl border border-slate-600/50 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate">{user.name}</h3>
                        <p className="text-sm text-slate-400 truncate">{user.email}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleStyles[user.role]}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Tasks */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <ClipboardList size={20} className="text-amber-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Available Tasks</h2>
              </div>

              <div className="space-y-3">
                {tasks.map(task => (
                  <div key={task.id} className="group bg-slate-800/80 hover:bg-slate-700/80 p-4 rounded-xl border border-slate-600/50 transition-all duration-200">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-white text-sm leading-tight">{task.title}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priorityStyles[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                      {task.description}
                    </p>
                    
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${statusStyles[task.status]}`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}