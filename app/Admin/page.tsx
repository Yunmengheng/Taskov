'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from "@/components/layout/DashboardLayout";
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Users,
  Calendar,
  Settings,
  Shield,
  ClipboardList,
  Target,
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
  user_id?: string; // Who owns/created the task
  assigned_to?: string; // Who the task is assigned to
  due_date?: string; // Due date
  created_at?: string; // Creation timestamp
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
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  // State for the new simplified form
  const [userEmail, setUserEmail] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');

  // State for editing an assignment
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [editDueDate, setEditDueDate] = useState('');

  // Initialize Supabase client
  useEffect(() => {
    const initSupabase = () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        const client = createClient(supabaseUrl, supabaseKey);
        setSupabase(client);
      }
    };

    initSupabase();
  }, []);

  // Fetch data from Supabase
  const fetchData = useCallback(async () => {
    if (!supabase) return;
    
    setLoading(true);
    try {
      // Fetch ALL users (remove any filters)
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, name, email, role');
      
      if (usersError) {
        console.error('Users error:', usersError);
        throw usersError;
      }
      setUsers(usersData || []);
      console.log("Fetched users:", usersData);

      // Fetch ALL tasks (remove any filters) - include assigned_to field
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('id, title, description, priority, status, user_id, assigned_to, due_date, created_at');
      
      if (tasksError) {
        console.error('Tasks error:', tasksError);
        throw tasksError;
      }
      setTasks(tasksData || []);
      console.log("Fetched tasks:", tasksData);

      // Fetch all assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('task_assignments')
        .select('id, user_id, task_id, assigned_date, due_date');
      
      if (assignmentsError) {
        console.error('Assignments error:', assignmentsError);
        throw assignmentsError;
      }
      setAssignments(assignmentsData || []);
      console.log("Fetched assignments:", assignmentsData);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (supabase) {
      fetchData();
    }
  }, [supabase, fetchData]);

  const getUserName = (userId: string) => users.find(user => user.id === userId)?.name || 'Unknown';
  const getTaskTitle = (taskId: string) => tasks.find(task => task.id === taskId)?.title || 'Unknown';

  const handleCreateAndAssignTaskByEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail || !taskTitle || !taskDeadline || !supabase) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      // First, find the user by email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', userEmail)
        .single();

      if (userError || !userData) {
        throw new Error('User not found with this email');
      }

      // Create the task with all required fields including assigned_to
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .insert({
          title: taskTitle,
          description: `Task assigned by admin to ${userEmail}`,
          priority: 'medium', // Default priority
          status: 'pending', // Default status
          user_id: userData.id, // User who owns the task
          assigned_to: userData.id, // Add this - who the task is assigned to
          due_date: taskDeadline, // Store due date in tasks table
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (taskError) {
        console.error('Task creation error:', taskError);
        throw taskError;
      }

      // Create the assignment relationship
      const { error: assignmentError } = await supabase
        .from('task_assignments')
        .insert({
          user_id: userData.id,
          task_id: taskData.id,
          assigned_date: new Date().toISOString().split('T')[0],
          due_date: taskDeadline
        });

      if (assignmentError) {
        console.error('Assignment creation error:', assignmentError);
        throw assignmentError;
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

  const handleDeleteAssignmentOnly = async (id: number) => {
    if (!supabase) return;
    
    if (!window.confirm("Are you sure you want to delete this assignment and remove the task from the user?")) {
      return;
    }

    try {
      const assignment = assignments.find(a => a.id === id);
      if (!assignment) {
        alert("Assignment not found");
        return;
      }

      console.log("Deleting assignment and task:", assignment);

      // Step 1: Delete the assignment first
      const { error: assignmentError } = await supabase
        .from('task_assignments')
        .delete()
        .eq('id', id);
      
      if (assignmentError) {
        console.error("Assignment deletion error:", assignmentError);
        throw assignmentError;
      }

      console.log("Assignment deleted successfully");

      // Step 2: Delete the associated task so it disappears from user's view
      const { error: taskError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', assignment.task_id);
      
      if (taskError) {
        console.error("Task deletion error:", taskError);
        // Don't throw here since assignment is already deleted
        console.warn("Assignment deleted but task removal failed");
      } else {
        console.log("Task deleted successfully");
        // Update tasks state
        setTasks(prev => prev.filter(t => t.id !== assignment.task_id));
      }

      // Update assignments state
      setAssignments(prev => prev.filter(a => a.id !== id));
      
      alert("Assignment and task deleted successfully!");
      
      // Refresh data to ensure consistency
      await fetchData();
      
    } catch (error) {
      console.error("Error deleting assignment:", error);
      alert(`Error: ${(error as Error).message}`);
    }
  };

  const handleEditClick = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setEditDueDate(assignment.due_date);
  };

  const handleUpdateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAssignment || !supabase) return;

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

  if (loading || !supabase) {
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
            {/* Current Assignments List View */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/10 rounded-lg"><Target size={20} className="text-emerald-400" /></div>
                <h2 className="text-xl font-semibold text-white">Current Assignments</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-slate-300">Task Title</th>
                      <th className="px-4 py-2 text-left text-slate-300">Assigned To</th>
                      <th className="px-4 py-2 text-left text-slate-300">Deadline</th>
                      <th className="px-4 py-2 text-left text-slate-300">Status</th>
                      <th className="px-4 py-2 text-left text-slate-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.length > 0 ? (
                      assignments.map(assignment => {
                        const user = users.find(u => u.id === assignment.user_id);
                        const task = tasks.find(t => t.id === assignment.task_id);

                        return (
                          <tr key={assignment.id} className="hover:bg-slate-700/50">
                            <td className="px-4 py-2 text-white">{task?.title || 'Unknown Task'}</td>
                            <td className="px-4 py-2 text-white">{user?.name || 'Unknown User'}</td>
                            <td className="px-4 py-2 text-slate-300">{new Date(assignment.due_date).toLocaleDateString()}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 rounded ${task ? statusStyles[task.status] : ''}`}>
                                {task?.status || 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleEditClick(assignment)} 
                                  className="text-blue-400 hover:text-white"
                                  title="Edit assignment"
                                >
                                  <Edit3 size={16} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteAssignmentOnly(assignment.id)} 
                                  className="text-rose-400 hover:text-white"
                                  title="Delete assignment"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-6 text-slate-400">No assignments yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
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