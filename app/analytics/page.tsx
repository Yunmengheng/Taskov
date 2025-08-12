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
  AlertCircle
} from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LabelList } from 'recharts';

const Analytics: React.FC = () => {
  const { tasks } = useTask();

  // Calculate analytics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : "0";
  
  // Tasks by priority
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
  const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium').length;
  const lowPriorityTasks = tasks.filter(task => task.priority === 'low').length;
  
  // Tasks by category
  const workTasks = tasks.filter(task => task.category === 'work').length;
  const personalTasks = tasks.filter(task => task.category === 'personal').length;
  const studyTasks = tasks.filter(task => task.category === 'study').length;
  
  // Overdue tasks
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  }).length;

  // Tasks created this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recentTasks = tasks.filter(task => {
    try {
      return new Date(task.createdAt) >= oneWeekAgo;
    } catch {
      return false;
    }
  }).length;

  // Prepare data for charts
  const priorityData = React.useMemo(() => {
    const data = [
      { name: 'High', value: highPriorityTasks, color: '#ef4444' },
      { name: 'Medium', value: mediumPriorityTasks, color: '#f97316' },
      { name: 'Low', value: lowPriorityTasks, color: '#22c55e' }
    ];
    return data.filter(item => item.value > 0);
  }, [highPriorityTasks, mediumPriorityTasks, lowPriorityTasks]);

  const categoryData = React.useMemo(() => {
    const workCompleted = tasks.filter(t => t.category === 'work' && t.completed).length;
    const workPending = tasks.filter(t => t.category === 'work' && !t.completed).length;
    const personalCompleted = tasks.filter(t => t.category === 'personal' && t.completed).length;
    const personalPending = tasks.filter(t => t.category === 'personal' && !t.completed).length;
    const studyCompleted = tasks.filter(t => t.category === 'study' && t.completed).length;
    const studyPending = tasks.filter(t => t.category === 'study' && !t.completed).length;

    return [
      { name: 'Work', completed: workCompleted, pending: workPending },
      { name: 'Personal', completed: personalCompleted, pending: personalPending },
      { name: 'Study', completed: studyCompleted, pending: studyPending },
      { name: 'Health', completed: 0, pending: 0 },
      { name: 'Other', completed: 0, pending: 0 }
    ];
  }, [tasks]);

  const renderCustomizedLabel = React.useCallback((entry: any) => {
    if (!entry || !entry.value || totalTasks === 0) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = entry.innerRadius + (entry.outerRadius - entry.innerRadius) * 0.7;
    const x = entry.cx + radius * Math.cos(-entry.midAngle * RADIAN);
    const y = entry.cy + radius * Math.sin(-entry.midAngle * RADIAN);
    const percent = Math.round((entry.value / totalTasks) * 100);

    if (percent < 5) return null; // Don't show label for very small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > entry.cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${entry.name} ${percent}%`}
      </text>
    );
  }, [totalTasks]);

  const completedThisWeek = React.useMemo(() => {
    return tasks.filter(task => {
      if (!task.completed) return false;
      try {
        const taskDate = new Date(task.updatedAt || task.createdAt);
        return taskDate >= oneWeekAgo;
      } catch {
        return false;
      }
    }).length;
  }, [tasks, oneWeekAgo]);

  const weeklyActivityRate = React.useMemo(() => {
    return totalTasks > 0 ? ((recentTasks / totalTasks) * 100).toFixed(1) : "0";
  }, [recentTasks, totalTasks]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400 text-sm">View statistics and insights about your tasks</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between mb-4">
              <Target size={24} className="text-blue-200" />
            </div>
            <div className="text-3xl font-bold mb-1">{totalTasks}</div>
            <div className="text-blue-200 text-sm">Total Tasks</div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle2 size={24} className="text-green-200" />
            </div>
            <div className="text-3xl font-bold mb-1">{completedTasks}</div>
            <div className="text-green-200 text-sm">Completed</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-600 to-orange-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between mb-4">
              <Clock size={24} className="text-yellow-200" />
            </div>
            <div className="text-3xl font-bold mb-1">{pendingTasks}</div>
            <div className="text-yellow-200 text-sm">Pending</div>
          </div>

          <div className="bg-gradient-to-br from-red-600 to-red-700 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between mb-4">
              <AlertCircle size={24} className="text-red-200" />
            </div>
            <div className="text-3xl font-bold mb-1">{overdueTasks}</div>
            <div className="text-red-200 text-sm">Overdue</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Priority Distribution - Pie Chart */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-6">Tasks by Priority</h3>
            <div className="h-80 relative">
              {priorityData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <Target size={48} className="mx-auto mb-4 text-gray-600" />
                    <p>No tasks to display</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Legend */}
            {priorityData.length > 0 && (
              <div className="flex justify-center space-x-6 mt-4">
                {priorityData.map((entry) => (
                  <div key={entry.name} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-gray-300 text-sm">{entry.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Distribution - Bar Chart */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-6">Tasks by Category</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <Bar 
                    dataKey="completed" 
                    stackId="a" 
                    fill="#22c55e" 
                    radius={[0, 0, 4, 4]}
                  />
                  <Bar 
                    dataKey="pending" 
                    stackId="a" 
                    fill="#ef4444" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                <span className="text-gray-300 text-sm">Completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                <span className="text-gray-300 text-sm">Pending</span>
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
              <div className="text-2xl font-bold text-blue-400">{completedThisWeek}</div>
              <p className="text-gray-400 text-sm">Tasks completed this week</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{weeklyActivityRate}%</div>
              <p className="text-gray-400 text-sm">Weekly activity rate</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;