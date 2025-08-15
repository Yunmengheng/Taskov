"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTask, type Task } from "@/contexts/TaskContext";
import { useAuth } from "@/contexts/AuthContext";
import StatCards from "@/components/dashboard/StatCards";
import TaskForm from "@/components/tasks/TaskForm";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  PlusIcon, 
  CalendarDays, 
  Clock, 
  Pencil, 
  Trash2, 
  CheckCircle,
  ArrowRight,
  Target,
  TrendingUp
} from "lucide-react";

const Dashboard: React.FC = () => {
  const { tasks, deleteTask, toggleTaskCompletion, loading } = useTask();
  const { user } = useAuth();

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  // Get recent tasks (latest createdAt)
  const recentTasks: Task[] = [...tasks]
    .sort((a: Task, b: Task) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Get upcoming tasks (nearest dueDate and not completed)
  const upcomingTasks: Task[] = tasks
    .filter((task: Task) => !task.completed && !!task.dueDate)
    .sort((a: Task, b: Task) => new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime())
    .slice(0, 3);

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setShowTaskForm(true);
  };

  const closeForm = () => {
    setShowTaskForm(false);
    setEditTask(null);
  };
  
  // Helper for formatting dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short", 
      day: "numeric", 
      year: "numeric",
      hour: "numeric", 
      minute: "2-digit", 
      hour12: true,
    });
  };

  const formatSimpleDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short", 
      day: "numeric"
    });
  };

  // Improved styles for priority and category tags
  const priorityStyles: { [key: string]: string } = {
    low: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    medium: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    high: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  };

  const categoryStyles: { [key: string]: string } = {
    work: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    personal: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    study: "bg-pink-500/10 text-pink-400 border border-pink-500/20",
  };
  
  useEffect(() => {
    console.log('🔍 Dashboard: User:', user?.email || 'No user');
    console.log('🔍 Dashboard: Tasks count:', tasks.length);
    console.log('🔍 Dashboard: Loading:', loading);
  }, [user, tasks, loading]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-slate-400 text-lg">Loading your dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.email?.split('@')[0] || 'User'}
            </h1>
            <p className="text-slate-400">
              Here's what's happening with your tasks today
            </p>
          </div>
          <button
            onClick={() => setShowTaskForm(true)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg hover:shadow-xl"
          >
            <PlusIcon size={20} className="mr-2" />
            Create Task
          </button>
        </div>

        {/* Stats Cards */}
        <StatCards />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Tasks - Takes 2 columns on lg screens */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <TrendingUp size={20} className="text-blue-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
                </div>
                <Link 
                  href="/tasks" 
                  className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 font-medium"
                >
                  View all tasks
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>

              <div className="space-y-4">
                {recentTasks.length > 0 ? (
                  recentTasks.map((task) => (
                    <div key={task.id} className="group bg-slate-800/80 hover:bg-slate-700/80 p-4 rounded-xl border border-slate-600/50 transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <button
                            onClick={() => toggleTaskCompletion(task.id)}
                            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              task.completed 
                                ? 'bg-emerald-500 border-emerald-500' 
                                : 'border-slate-400 hover:border-blue-400'
                            }`}
                          >
                            {task.completed && <CheckCircle size={14} className="text-white" />}
                          </button>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-medium leading-tight ${
                              task.completed ? 'line-through text-slate-500' : 'text-white'
                            }`}>
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className={`text-sm mt-1 leading-relaxed ${
                                task.completed ? 'line-through text-slate-600' : 'text-slate-400'
                              }`}>
                                {task.description}
                              </p>
                            )}
                            
                            {/* Tags and Due Date */}
                            <div className="flex items-center gap-3 mt-3">
                              {task.dueDate && (
                                <div className="flex items-center text-xs text-rose-400">
                                  <CalendarDays size={12} className="mr-1" />
                                  <span>{formatSimpleDate(task.dueDate)}</span>
                                </div>
                              )}
                              
                              {task.priority && (
                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${priorityStyles[task.priority]}`}>
                                  {task.priority}
                                </span>
                              )}
                              
                              {task.category && (
                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${categoryStyles[task.category]}`}>
                                  {task.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEditTask(task)} 
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors"
                          >
                            <Pencil size={14} />
                          </button>
                          <button 
                            onClick={() => deleteTask(task.id)} 
                            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-600 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp size={48} className="mx-auto text-slate-600 mb-4" />
                    <p className="text-slate-400 text-lg">No recent tasks</p>
                    <p className="text-slate-500 text-sm">Create your first task to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Tasks Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Target size={20} className="text-amber-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">Up Next</h2>
              </div>

              <div className="space-y-3">
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map((task) => (
                    <div key={task.id} className="group bg-slate-800/80 hover:bg-slate-700/80 p-4 rounded-xl border border-slate-600/50 transition-all duration-200">
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          className="mt-1 w-4 h-4 rounded-full border-2 border-slate-400 hover:border-blue-400 transition-colors"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white text-sm leading-tight">
                            {task.title}
                          </h4>
                          
                          {task.dueDate && (
                            <div className="flex items-center text-xs text-rose-400 mt-2">
                              <Clock size={10} className="mr-1" />
                              <span>{formatSimpleDate(task.dueDate)}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 mt-2">
                            {task.priority && (
                              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${priorityStyles[task.priority]}`}>
                                {task.priority}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEditTask(task)} 
                            className="p-1 text-slate-400 hover:text-white transition-colors"
                          >
                            <Pencil size={12} />
                          </button>
                          <button 
                            onClick={() => deleteTask(task.id)} 
                            className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Target size={32} className="mx-auto text-slate-600 mb-3" />
                    <p className="text-slate-400">No upcoming tasks</p>
                    <p className="text-slate-500 text-xs mt-1">You're all caught up!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Task Form Modal */}
        {showTaskForm && <TaskForm onClose={closeForm} editTask={editTask} />}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;