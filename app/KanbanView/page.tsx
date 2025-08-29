'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import TaskForm from '@/components/tasks/TaskForm';
import { PlusIcon } from 'lucide-react';
import { Task } from '@/contexts/TaskContext';

const KanbanView: React.FC = () => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const closeForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Task Board
            </h1>
            <p className="text-sm text-gray-400">
              Drag tasks between columns to update their status
            </p>
          </div>
          <button
            onClick={() => setShowTaskForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon size={16} className="mr-2" />
            New Task
          </button>
        </div>
        <div className="flex-1">
          <KanbanBoard onEditTask={handleEditTask} />
        </div>
      </div>

      {/* Task Form Modal */}
      {showTaskForm && <TaskForm onClose={closeForm} editTask={editingTask} />}
    </DashboardLayout>
  );
};

export default KanbanView;