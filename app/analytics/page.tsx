"use client";

import React from "react";
import Link from "next/link";
import { useTask } from "@/contexts/TaskContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target,
  Home,
  Calendar,
  Settings,
  CheckCircle2,
  AlertCircle,
  PieChart
} from "lucide-react";

const Analytics: React.FC = () => {
  const { tasks } = useTask();

  // Calculate analytics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;
  
  // Tasks by priority
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
  const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium').length;
  const lowPriorityTasks = tasks.filter(task => task.priority === 'low').length;
  
  // Tasks by category
  const workTasks = tasks.filter(task => task.category === 'work').length;
  const personalTasks = tasks.filter(task => task.category === 'personal').length;
  const studyTasks = tasks.filter(task => task.category === 'study').length;
  
  // Overdue tasks
  const overdueTasks = tasks.filter(task => 
    !task.completed && task.dueDate && new Date(task.dueDate) < new Date()
  ).length;

  // Tasks created this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recentTasks = tasks.filter(task => 
    new Date(task.createdAt) >= oneWeekAgo
  ).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with navigation */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Analytics</h1>
            <div className="flex items-center space-x-4">
              <Link href="/Dashboard" className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                <Home size={16} className="mr-1" />
                Dashboard
              </Link>
              <Link href="/calendar" className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                <Calendar size={16} className="mr-1" />
                Calendar
              </Link>
              <Link href="/settings" className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                <Settings size={16} className="mr-1" />
                Settings
              </Link>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Target size={20} className="text-blue-400 mr-2" />
                <h3 className="text-sm font-medium text-gray-400">Total Tasks</h3>
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{totalTasks}</div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <CheckCircle2 size={20} className="text-green-400 mr-2" />
                <h3 className="text-sm font-medium text-gray-400">Completed</h3>
              </div>
            </div>
            <div className="text-2xl font-bold text-green-400">{completedTasks}</div>
            <p className="text-xs text-gray-500 mt-1">{completionRate}% completion rate</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Clock size={20} className="text-orange-400 mr-2" />
                <h3 className="text-sm font-medium text-gray-400">Pending</h3>
              </div>
            </div>
            <div className="text-2xl font-bold text-orange-400">{pendingTasks}</div>
            <p className="text-xs text-gray-500 mt-1">In progress</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <AlertCircle size={20} className="text-red-400 mr-2" />
                <h3 className="text-sm font-medium text-gray-400">Overdue</h3>
              </div>
            </div>
            <div className="text-2xl font-bold text-red-400">{overdueTasks}</div>
            <p className="text-xs text-gray-500 mt-1">Past due date</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Priority Distribution */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center mb-6">
              <BarChart3 size={20} className="text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Tasks by Priority</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-gray-300">High Priority</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: totalTasks > 0 ? `${(highPriorityTasks / totalTasks) * 100}%` : '0%' }}
                    ></div>
                  </div>
                  <span className="text-white font-medium w-8">{highPriorityTasks}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-gray-300">Medium Priority</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: totalTasks > 0 ? `${(mediumPriorityTasks / totalTasks) * 100}%` : '0%' }}
                    ></div>
                  </div>
                  <span className="text-white font-medium w-8">{mediumPriorityTasks}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-300">Low Priority</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: totalTasks > 0 ? `${(lowPriorityTasks / totalTasks) * 100}%` : '0%' }}
                    ></div>
                  </div>
                  <span className="text-white font-medium w-8">{lowPriorityTasks}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center mb-6">
              <PieChart size={20} className="text-purple-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Tasks by Category</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-300">Work</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: totalTasks > 0 ? `${(workTasks / totalTasks) * 100}%` : '0%' }}
                    ></div>
                  </div>
                  <span className="text-white font-medium w-8">{workTasks}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-gray-300">Personal</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: totalTasks > 0 ? `${(personalTasks / totalTasks) * 100}%` : '0%' }}
                    ></div>
                  </div>
                  <span className="text-white font-medium w-8">{personalTasks}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-pink-500 rounded-full mr-3"></div>
                  <span className="text-gray-300">Study</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-pink-500 h-2 rounded-full" 
                      style={{ width: totalTasks > 0 ? `${(studyTasks / totalTasks) * 100}%` : '0%' }}
                    ></div>
                  </div>
                  <span className="text-white font-medium w-8">{studyTasks}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
          <div className="flex items-center mb-6">
            <TrendingUp size={20} className="text-green-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{recentTasks}</div>
              <p className="text-gray-400 text-sm">Tasks created this week</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {tasks.filter(task => 
                  task.completed && new Date(task.updatedAt || task.createdAt) >= oneWeekAgo
                ).length}
              </div>
              <p className="text-gray-400 text-sm">Tasks completed this week</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {totalTasks > 0 ? ((recentTasks / totalTasks) * 100).toFixed(1) : 0}%
              </div>
              <p className="text-gray-400 text-sm">Weekly activity rate</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;