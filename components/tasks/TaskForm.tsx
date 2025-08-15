"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useTask, Task } from "@/contexts/TaskContext";

const isoDate = (d: Date) => new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString();

const TaskForm: React.FC<{ onClose: () => void; editTask?: Task | null }> = ({ onClose, editTask }) => {
  const { addTask, updateTask } = useTask();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<string | "">("");
  const [priority, setPriority] = useState("medium");

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description || "");
      setDueDate(editTask.dueDate ? editTask.dueDate.slice(0, 10) : "");
      setPriority(editTask.priority || "medium");
    }
  }, [editTask]);

  const isEdit = !!editTask;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEdit && editTask) {
      updateTask(editTask.id, {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        priority: priority as any,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        priority: priority as any,
      });
    }
    onClose();
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
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded border border-white/10 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded border border-white/10 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Due date</label>
              <input 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Priority</option>
                <option value="low" className="bg-slate-700 text-white">Low</option>
                <option value="medium" className="bg-slate-700 text-white">Medium</option>
                <option value="high" className="bg-slate-700 text-white">High</option>
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
