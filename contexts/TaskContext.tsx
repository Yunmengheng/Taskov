"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import { useAuth } from './AuthContext';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type Priority = "low" | "medium" | "high";
export type Category = "work" | "personal" | "study";
export type Status = "pending" | "in_progress" | "completed";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  inProgress?: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: 'work' | 'personal' | 'study';
  dueDate?: string;
  createdAt: string;
  completedAt?: string; // Add this line
  userId: string;
}

type TaskInput = {
  title: string;
  description?: string;
  dueDate?: string | null;
  priority?: Priority;
  category?: Category;
};

type TaskContextValue = {
  tasks: Task[];
  addTask: (input: TaskInput) => Promise<Task | null>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  loading: boolean;
  refreshTasks: () => Promise<void>;
};

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadTasks();
    } else {
      setTasks([]);
      setLoading(false);
    }
  }, [user]);

  const transformTask = (dbTask: any): Task => ({
    ...dbTask,
    completed: dbTask.status === 'completed',
    dueDate: dbTask.due_date,
    createdAt: dbTask.created_at,
    completedAt: dbTask.completed_at,
    inProgress: dbTask.status === 'in_progress',
    userId: dbTask.assigned_to // Add this missing field
  });

  const loadTasks = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedTasks = data?.map(transformTask) || [];
      setTasks(transformedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (input: TaskInput): Promise<Task | null> => {
    if (!user) return null;

    console.log('🔍 Adding task with user:', user.id);
    console.log('🔍 Task input:', input);

    try {
      const taskData = {
        title: input.title.trim(),
        description: input.description?.trim() || '',
        status: 'pending' as Status,
        priority: input.priority || 'medium',
        category: input.category || 'personal', // Changed from 'work' to 'personal'
        due_date: input.dueDate,
        assigned_to: user.id
      };

      console.log('🔍 Inserting task data:', taskData);

      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single();

      if (error) {
        console.error('❌ Database insert error:', error);
        throw error;
      }

      console.log('✅ Task inserted successfully:', data);

      const newTask = transformTask(data);
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (error) {
      console.error('❌ Error adding task:', error);
      return null;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) return;

    try {
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;

      // Convert Task properties to database status
      if (updates.completed !== undefined || updates.inProgress !== undefined) {
        if (updates.completed === true) {
          dbUpdates.status = 'completed';
        } else if (updates.inProgress === true) {
          dbUpdates.status = 'in_progress';
        } else {
          dbUpdates.status = 'pending';
        }
      }

      const { error } = await supabase
        .from('tasks')
        .update(dbUpdates)
        .eq('id', id)
        .eq('assigned_to', user.id);

      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, ...updates } : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const toggleTaskCompletion = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    await updateTask(id, { 
      completed: !task.completed
    });
  };

  const deleteTask = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('assigned_to', user.id);

      if (error) throw error;

      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const clearAll = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('assigned_to', user.id);

      if (error) throw error;

      setTasks([]);
    } catch (error) {
      console.error('Error clearing tasks:', error);
    }
  };

  const refreshTasks = loadTasks;

  const value = useMemo(() => ({
    tasks,
    addTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask,
    clearAll,
    loading,
    refreshTasks
  }), [tasks, loading]);

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTask = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTask must be used within a TaskProvider");
  return ctx;
};