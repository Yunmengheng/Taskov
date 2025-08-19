'use client';

import React, { useState } from 'react';
import { useTask, type Task } from "@/contexts/TaskContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import TaskForm from "@/components/tasks/TaskForm";
import { 
  PlusIcon, 
  Search,
  X,
  CalendarDays, 
  Clock, 
  Pencil, 
  Trash2, 
  CheckCircle
} from "lucide-react";

export default function ListView() {
  const { tasks, deleteTask, toggleTaskCompletion } = useTask();
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'completed' && task.completed) ||
                         (statusFilter === 'pending' && !task.completed);

    return matchesSearch && matchesPriority && matchesCategory && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setStatusFilter('all');
  };

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
      month: "short", day: "numeric", year: "numeric",
      hour: "numeric", minute: "2-digit", hour12: true,
    });
  };

  // Styles for priority and category tags
  const priorityStyles = {
    low: "bg-green-500/20 text-green-400 border border-green-500/30",
    medium: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    high: "bg-red-500/20 text-red-400 border border-red-500/30",
  };

  const categoryStyles = {
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
            <h1 className="text-2xl font-bold text-white mb-2">List View</h1>
            <p className="text-gray-400 text-sm">View and manage all your tasks in a detailed list format</p>
          </div>
          <button
            onClick={() => setShowTaskForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon size={16} className="mr-2" />
            New Task
          </button>
        </div>

        {/* Filters Section */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="study">Study</option>
            </select>

            {/* Clear Filters */}
            {(searchTerm || priorityFilter !== 'all' || categoryFilter !== 'all' || statusFilter !== 'all') && (
              <button
                onClick={clearFilters}
                className="flex items-center px-3 py-2 text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} className="mr-1" />
                Clear
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-400">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div key={task.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <div className="mt-1">
                    <div 
                      onClick={() => toggleTaskCompletion(task.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-colors ${
                        task.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-slate-500 hover:border-slate-400'
                      }`}
                    >
                      {task.completed && <CheckCircle size={12} className="text-white" />}
                    </div>
                  </div>
                  
                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-medium mb-1 ${
                      task.completed ? 'line-through text-gray-500' : 'text-white'
                    }`}>
                      {task.title}
                    </h3>
                    
                    {task.description && (
                      <p className={`text-sm mb-3 ${
                        task.completed ? 'line-through text-gray-600' : 'text-gray-400'
                      }`}>
                        {task.description}
                      </p>
                    )}
                    
                    {/* Task Meta Information */}
                    <div className="flex items-center flex-wrap gap-4 mb-3">
                      {/* Due Date */}
                      {task.dueDate && (
                        <div className="flex items-center text-sm text-red-400">
                          <CalendarDays size={12} className="mr-1" />
                          <span>{formatDate(task.dueDate)}</span>
                        </div>
                      )}
                      
                      {/* Priority Badge */}
                      {task.priority && (
                        <span className={`px-2 py-1 text-xs rounded-md font-medium ${priorityStyles[task.priority]}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      )}
                      
                      {/* Category Badge */}
                      {task.category && (
                        <span className={`px-2 py-1 text-xs rounded-md font-medium ${categoryStyles[task.category]}`}>
                          {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                        </span>
                      )}
                    </div>
                    
                    {/* Created Date */}
                    <div className="flex items-center text-xs text-gray-500 pt-3 border-t border-slate-700">
                      <Clock size={10} className="mr-1" />
                      <span>Created {formatDate(task.createdAt)}</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEditTask(task)}
                      className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-slate-800 rounded-xl border border-slate-700">
              <div className="text-gray-400 mb-4">
                {tasks.length === 0 ? (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 text-gray-600">
                      <CheckCircle size={64} />
                    </div>
                    <p className="text-lg mb-2">No tasks yet</p>
                    <p className="text-sm">Create your first task to get started</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 text-gray-600">
                      <Search size={64} />
                    </div>
                    <p className="text-lg mb-2">No tasks match your filters</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </>
                )}
              </div>
              {tasks.length === 0 && (
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Task
                </button>
              )}
            </div>
          )}
        </div>

        {/* Task Form Modal */}
        {showTaskForm && (
          <TaskForm 
            onClose={closeForm} 
            editTask={editTask} 
          />
        )}
      </div>
    </DashboardLayout>
  );
}