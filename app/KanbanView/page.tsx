import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import KanbanBoard from '@/components/kanban/KanbanBoard';

const KanbanView: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">
            Task Board
          </h1>
          <p className="text-sm text-gray-400">
            Drag tasks between columns to update their status
          </p>
        </div>
        <div className="flex-1">
          <KanbanBoard />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KanbanView;