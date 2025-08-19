"use client";

import React from "react";
import { useTask, Task } from "@/contexts/TaskContext";
import { Pencil, Trash2, CheckCircle2, Circle, Clock3 } from "lucide-react";

const chip = (text: string, color: string) => (
  <span className={`px-2 py-0.5 text-xs rounded-full ${color}`}>{text}</span>
);

const TaskItem: React.FC<{ task: Task; onEdit?: (t: Task) => void }> = ({ task, onEdit }) => {
  const { updateTask, deleteTask } = useTask();
  const due = task.dueDate ? new Date(task.dueDate) : null;
  const now = new Date();
  const overdue = !!due && !task.completed && due.getTime() < now.getTime();

  const handleToggleComplete = () => {
    updateTask(task.id, { ...task, completed: !task.completed });
  };

  const dueBadge = due
    ? chip(
        due.toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        overdue ? "bg-rose-500/15 text-rose-300 border border-rose-500/30" : "bg-blue-500/15 text-blue-300 border border-blue-500/30"
      )
    : null;

  const priorityBadge = task.priority
    ? chip(
        task.priority,
        task.priority === "high"
          ? "bg-red-500/15 text-red-300 border border-red-500/30"
          : task.priority === "medium"
          ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
          : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
      )
    : null;

  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900 p-5 text-white">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <button
            aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
            onClick={handleToggleComplete}
            className="mt-0.5 text-gray-400 hover:text-emerald-400"
          >
            {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
          </button>
          <div>
            <div className={`font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </div>
            {task.description && (
              <div className={`text-sm mt-0.5 ${task.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}>
                {task.description}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-400">
              <span className="inline-flex items-center gap-1">
                <Clock3 className="w-3.5 h-3.5" /> Created {new Date(task.createdAt).toLocaleString()}
              </span>
              {dueBadge}
              {priorityBadge}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button aria-label="Edit" onClick={() => onEdit(task)} className="p-2 hover:bg-white/5 rounded-lg">
              <Pencil className="w-4 h-4" />
            </button>
          )}
          <button aria-label="Delete" onClick={() => deleteTask(task.id)} className="p-2 hover:bg-rose-500/10 text-rose-400 rounded-lg">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
