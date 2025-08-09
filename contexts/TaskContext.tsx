"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Priority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string; // ISO string
  dueDate?: string | null; // ISO string or null
  priority?: Priority;
};

type TaskInput = {
  title: string;
  description?: string;
  dueDate?: string | null;
  priority?: Priority;
};

type TaskContextValue = {
  tasks: Task[];
  addTask: (input: TaskInput) => Task;
  updateTask: (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => void;
  toggleComplete: (id: string) => void;
  deleteTask: (id: string) => void;
  clearAll: () => void;
};

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

const STORAGE_KEY = "taskov.tasks";

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: Task[] = JSON.parse(raw);
        setTasks(parsed);
      }
    } catch (_e) {
      // ignore parse errors
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (_e) {
      // ignore write errors
    }
  }, [tasks]);

  const addTask = (input: TaskInput): Task => {
    const now = new Date().toISOString();
    const task: Task = {
      id: crypto.randomUUID(),
      title: input.title.trim(),
      description: input.description?.trim() || "",
      completed: false,
      createdAt: now,
      dueDate: input.dueDate || null,
      priority: input.priority || "medium",
    };
    setTasks((prev) => [task, ...prev]);
    return task;
  };

  const updateTask = (
    id: string,
    updates: Partial<Omit<Task, "id" | "createdAt">>
  ) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const toggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const clearAll = () => setTasks([]);

  const value = useMemo(
    () => ({ tasks, addTask, updateTask, toggleComplete, deleteTask, clearAll }),
    [tasks]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTask = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTask must be used within a TaskProvider");
  return ctx;
};
