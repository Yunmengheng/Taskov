"use client";

import React from "react";
import { useTask, Task } from "@/contexts/TaskContext";
import { Pencil, Trash2, CheckCircle2, Circle } from "lucide-react";

const TaskItem: React.FC<{ task: Task; onEdit?: (t: Task) => void }> = ({ task, onEdit }) => {
  const { toggleComplete, deleteTask } = useTask();
  return (
    <div className="flex items-start justify-between rounded-lg border p-4">
      <div className="flex items-start gap-3">
        <button
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
          onClick={() => toggleComplete(task.id)}
          className="mt-0.5 text-gray-500 hover:text-blue-600"
        >
          {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
        </button>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {task.title}
          </div>
          {task.description && (
            <div className="text-sm text-gray-600 dark:text-gray-300">{task.description}</div>
          )}
          <div className="text-xs text-gray-500">
            Created: {new Date(task.createdAt).toLocaleString()}
            {task.dueDate && ` · Due: ${new Date(task.dueDate).toLocaleDateString()}`}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onEdit && (
          <button aria-label="Edit" onClick={() => onEdit(task)} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded">
            <Pencil className="w-4 h-4" />
          </button>
        )}
        <button aria-label="Delete" onClick={() => deleteTask(task.id)} className="p-2 hover:bg-red-50 text-red-600 rounded">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
