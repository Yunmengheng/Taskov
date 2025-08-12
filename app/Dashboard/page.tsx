"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTask, type Task } from "@/contexts/TaskContext";
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
  Calendar,
  BarChart3,
  Settings
} from "lucide-react";

const Dashboard: React.FC = () => {
  // Expanded to include functions for interactivity
  const { tasks, deleteTask, toggleTaskCompletion } = useTask();

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
  
  // Helper for formatting dates to match the image style
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "numeric", minute: "2-digit", hour12: true,
    });
  };

  // Styles for priority and category tags to match the image
  const priorityStyles: { [key: string]: string } = {
    low: "bg-green-500/20 text-green-400 border border-green-500/30",
    medium: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    high: "bg-red-500/20 text-red-400 border border-red-500/30",
  };
  const categoryStyles: { [key: string]: string } = {
    work: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    personal: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    study: "bg-pink-500/20 text-pink-400 border border-pink-500/30",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Link href="/calendar" className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                <Calendar size={16} className="mr-1" />
                Calendar
              </Link>
              <Link href="/analytics" className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                <BarChart3 size={16} className="mr-1" />
                Analytics
              </Link>
              <Link href="/settings" className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
                <Settings size={16} className="mr-1" />
                Settings
              </Link>
            </div>
          </div>
          <button
            onClick={() => setShowTaskForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon size={16} className="mr-2" />
            New Task
          </button>
        </div>

        {/* Stats */}
        <StatCards />

        {/* Tasks Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Recent Tasks */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Recent Tasks</h2>
              <Link href="/tasks" className="text-sm text-blue-400 hover:text-blue-300">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <div key={task.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          task.completed 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-slate-500'
                        }`}>
                          {task.completed && <CheckCircle size={12} className="text-white" />}
                        </div>
                        <div>
                          <h3 className={`font-medium ${
                            task.completed ? 'line-through text-gray-500' : 'text-white'
                          }`}>
                            {task.title}
                          </h3>
                          <p className={`text-sm mt-1 ${
                            task.completed ? 'line-through text-gray-600' : 'text-gray-400'
                          }`}>
                            {task.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditTask(task)} 
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button 
                          onClick={() => deleteTask(task.id)} 
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs">
                      {task.dueDate && (
                        <div className="flex items-center text-red-400">
                          <CalendarDays size={12} className="mr-1" />
                          <span>{formatDate(task.dueDate)}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        {task.priority && (
                          <span className={`px-2 py-1 text-xs rounded-md font-medium ${priorityStyles[task.priority]}`}>
                            {task.priority}
                          </span>
                        )}
                        {task.category && (
                          <span className={`px-2 py-1 text-xs rounded-md font-medium ${categoryStyles[task.category]}`}>
                            {task.category}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500 mt-3 pt-3 border-t border-slate-700">
                      <Clock size={10} className="mr-1" />
                      <span>Created {formatDate(task.createdAt)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-slate-800 rounded-xl border border-slate-700">
                  <p className="text-gray-400">No recent tasks</p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Upcoming Tasks</h2>
              <Link href="/tasks" className="text-sm text-blue-400 hover:text-blue-300">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => (
                  <div key={task.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <input 
                          type="checkbox" 
                          checked={task.completed} 
                          onChange={() => toggleTaskCompletion(task.id)} 
                          className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                        />
                        <div>
                          <h3 className={`font-medium ${
                            task.completed ? 'line-through text-gray-500' : 'text-white'
                          }`}>
                            {task.title}
                          </h3>
                          <p className={`text-sm mt-1 ${
                            task.completed ? 'line-through text-gray-600' : 'text-gray-400'
                          }`}>
                            {task.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditTask(task)} 
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <Pencil size={14} />
                        </button>
                        <button 
                          onClick={() => deleteTask(task.id)} 
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs">
                      {task.dueDate && (
                        <div className="flex items-center text-red-400">
                          <CalendarDays size={12} className="mr-1" />
                          <span>{formatDate(task.dueDate)}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        {task.priority && (
                          <span className={`px-2 py-1 text-xs rounded-md font-medium ${priorityStyles[task.priority]}`}>
                            {task.priority}
                          </span>
                        )}
                        {task.category && (
                          <span className={`px-2 py-1 text-xs rounded-md font-medium ${categoryStyles[task.category]}`}>
                            {task.category}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500 mt-3 pt-3 border-t border-slate-700">
                      <Clock size={10} className="mr-1" />
                      <span>Created {formatDate(task.createdAt)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-slate-800 rounded-xl border border-slate-700">
                  <p className="text-gray-400">No upcoming tasks</p>
                </div>
              )}
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