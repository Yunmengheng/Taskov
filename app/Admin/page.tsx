'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from '@/lib/supabase';
import {
  Users,
  Calendar,
  Settings,
  Shield,
  ClipboardList,
  Target,
  Clock,
  Trash2,
  Edit3,
  X
} from "lucide-react";

// Define types for our data
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
}

interface Assignment {
  id: number;
  user_id: string;
  task_id: string;
  assigned_date: string;
  due_date: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  // State for the new simplified form
  const [userEmail, setUserEmail] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');

  // State for editing an assignment
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [editDueDate, setEditDueDate] = useState('');

  // Fetch data from Supabase
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: usersData, error: usersError } = await supabase.from('profiles').select('id, name, email, role');
      if (usersError) throw usersError;
      setUsers(usersData || []);

      const { data: tasksData, error: tasksError } = await supabase.from('tasks').select('id, title, description, priority, status');
      if (tasksError) throw tasksError;
      setTasks(tasksData || []);

      const { data: assignmentsData, error: assignmentsError } = await supabase.from('task_assignments').select('id, user_id, task_id, assigned_date, due_date');
      if (assignmentsError) throw assignmentsError;
      setAssignments(assignmentsData || []);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (userId: string) => users.find(user => user.id === userId)?.name || 'Unknown';
  const getTaskTitle = (taskId: string) => tasks.find(task => task.id === taskId)?.title || 'Unknown';

  const handleCreateAndAssignTaskByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail || !taskTitle || !taskDeadline) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const response = await fetch('/api/assign-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userEmail, 
          taskTitle, 
          taskDeadline 
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      alert('Task created and assigned successfully!');
      setUserEmail('');
      setTaskTitle('');
      setTaskDeadline('');
      fetchData(); // Refresh all data
    } catch (error) {
      console.error("Error creating and assigning task:", error);
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const handleDeleteAssignment = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;

    try {
      const { error } = await supabase.from('task_assignments').delete().eq('id', id);
      if (error) throw error;
      setAssignments(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
  };

  const handleEditClick = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setEditDueDate(assignment.due_date);
  };

  const handleUpdateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAssignment) return;

    try {
      const { data, error } = await supabase
        .from('task_assignments')
        .update({ due_date: editDueDate })
        .eq('id', editingAssignment.id)
        .select()
        .single();

      if (error) throw error;

      setAssignments(prev => prev.map(a => (a.id === editingAssignment.id ? data : a)));
      setEditingAssignment(null);
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };

  const priorityStyles: { [key: string]: string } = {
    low: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    medium: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    high: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  };

  const statusStyles: { [key: string]: string } = {
    pending: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
    in_progress: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    completed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  };

  const roleStyles: { [key: string]: string } = {
    Developer: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    Designer: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    Manager: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    user: "bg-gray-500/10 text-gray-400 border border-gray-500/20",
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full"><p className="text-white">Loading...</p></div>
      </DashboardLayout>
    );
  }

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
            <p className="text-slate-400">Manage task assignments and user responsibilities</p>
          </div>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white mt-1">{users.length}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-xl"><Users size={24} className="text-blue-400" /></div>
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Tasks</p>
                <p className="text-3xl font-bold text-white mt-1">{tasks.length}</p>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-xl"><ClipboardList size={24} className="text-emerald-400" /></div>
            </div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Assignments</p>
                <p className="text-3xl font-bold text-white mt-1">{assignments.length}</p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-xl"><Target size={24} className="text-amber-400" /></div>
            </div>
          </div>
        </div>

        {/* Simplified Task Assignment Form */}
        <form onSubmit={handleCreateAndAssignTaskByEmail} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg"><Settings size={20} className="text-blue-400" /></div>
            <h2 className="text-xl font-semibold text-white">Create and Assign Task</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">User Email</label>
              <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white" placeholder="user@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Task Title</label>
              <input type="text" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white" placeholder="Enter task title..." required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Deadline</label>
              <input type="date" value={taskDeadline} onChange={(e) => setTaskDeadline(e.target.value)} className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white" required />
            </div>
          </div>
          <button type="submit" className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">
            <Calendar size={20} className="mr-2" />
            Assign Task
          </button>
        </form>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg"><Target size={20} className="text-emerald-400" /></div>
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
                            <h3 className="font-medium text-white">{getUserName(assignment.user_id)}</h3>
                            <span className="text-slate-400">→</span>
                            <h3 className="font-medium text-white">{getTaskTitle(assignment.task_id)}</h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <div className="flex items-center gap-1"><Calendar size={12} /><span>Assigned: {new Date(assignment.assigned_date).toLocaleDateString()}</span></div>
                            <div className="flex items-center gap-1"><Clock size={12} /><span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEditClick(assignment)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors"><Edit3 size={14} /></button>
                          <button onClick={() => handleDeleteAssignment(assignment.id)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-600 rounded-lg transition-colors"><Trash2 size={14} /></button>
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

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/10 rounded-lg"><Users size={20} className="text-blue-400" /></div>
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
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${roleStyles[user.role] || roleStyles.user}`}>{user.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Assignment Modal */}
        {editingAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-slate-800 rounded-2xl border border-slate-700/50 p-8 w-full max-w-md m-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Edit Assignment</h2>
                <button onClick={() => setEditingAssignment(null)} className="p-2 text-slate-400 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={handleUpdateAssignment}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">User</label>
                    <input type="text" readOnly value={`${getUserName(editingAssignment.user_id)}`} className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Task</label>
                    <input type="text" readOnly value={`${getTaskTitle(editingAssignment.task_id)}`} className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Due Date</label>
                    <input type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                  <button type="button" onClick={() => setEditingAssignment(null)} className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors">Cancel</button>
                  <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">Update Assignment</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}