"use client";

import React, { useEffect, useState } from "react";
import { useTask, Task } from "@/contexts/TaskContext";
import { useAuth } from '@/contexts/AuthContext';

type Priority = 'low' | 'medium' | 'high';
type Category = 'work' | 'study' | 'personal';

const TaskForm: React.FC<{ onClose: () => void; editTask?: Task | null }> = ({ onClose, editTask }) => {
  const { addTask, updateTask } = useTask();
  const { user } = useAuth();
  
  // Add this debug line
  console.log('🔍 TaskForm - useTask context:', { addTask, updateTask });
  console.log('🔍 Current user:', user?.email);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<string | "">("");
  const [dueTime, setDueTime] = useState<string | "">("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Category>("personal");

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description || "");
      
      if (editTask.dueDate) {
        const date = new Date(editTask.dueDate);
        setDueDate(date.toISOString().slice(0, 10));
        setDueTime(date.toTimeString().slice(0, 5));
      } else {
        setDueDate("");
        setDueTime("");
      }
      
      setPriority((editTask.priority as Priority) || "medium");
      setCategory((editTask.category as Category) || "personal");
    }
  }, [editTask]);

  const isEdit = !!editTask;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let dueDateTimeISO: string | undefined = undefined;
    if (dueDate) {
      const dateTime = dueTime 
        ? new Date(`${dueDate}T${dueTime}:00`)
        : new Date(dueDate);
      dueDateTimeISO = dateTime.toISOString();
    }

    console.log('🔍 Submitting task:', {
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDateTimeISO,
      priority,
      category,
    });

    try {
      if (isEdit && editTask) {
        const result = await updateTask(editTask.id, {
          title: title.trim(),
          description: description.trim(),
          dueDate: dueDateTimeISO,
          priority: priority,
          category: category,
        });
        console.log('✅ Update task result:', result);
      } else {
        const result = await addTask({
          title: title.trim(),
          description: description.trim(),
          dueDate: dueDateTimeISO,
          priority: priority,
          category: category,
        });
        console.log('✅ Add task result:', result);
      }
      onClose();
    } catch (error) {
      console.error('❌ Error submitting task:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-zinc-900 p-6 shadow-xl text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{isEdit ? "Edit Task" : "New Task"}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full rounded border border-white/10 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full rounded border border-white/10 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" 
              rows={3} 
            />
          </div>
          
          {/* Due Date and Time Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Time</label>
              <input 
                type="time" 
                value={dueTime} 
                onChange={(e) => setDueTime(e.target.value)} 
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
          </div>

          {/* Priority and Category Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low" className="bg-slate-700 text-white">Low</option>
                <option value="medium" className="bg-slate-700 text-white">Medium</option>
                <option value="high" className="bg-slate-700 text-white">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="work" className="bg-slate-700 text-white">Work</option>
                <option value="study" className="bg-slate-700 text-white">Study</option>
                <option value="personal" className="bg-slate-700 text-white">Personal</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border border-white/10">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">{isEdit ? "Save" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
