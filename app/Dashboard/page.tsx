"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTask, type Task } from "@/contexts/TaskContext";
import StatCards from "@/components/dashboard/StatCards";
import TaskItem from "@/components/tasks/TaskItem";
import TaskForm from "@/components/tasks/TaskForm";
import { PlusIcon } from "lucide-react";

const Dashboard: React.FC = () => {
  const { tasks } = useTask();

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  // Get recent tasks (latest createdAt)
  const recentTasks: Task[] = [...tasks]
    .sort((a: Task, b: Task) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Get upcoming tasks (nearest dueDate and not completed)
  const upcomingTasks: Task[] = tasks
    .filter((task: Task) => !task.completed && !!task.dueDate)
    .sort((a: Task, b: Task) => (new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime()))
    .slice(0, 3);

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setShowTaskForm(true);
  };

  const closeForm = () => {
    setShowTaskForm(false);
    setEditTask(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <button
          onClick={() => setShowTaskForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md 
                     hover:bg-blue-700 focus:outline-none focus:ring-2 
                     focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon size={18} className="mr-1" />
          New Task
        </button>
      </div>

      {/* Stats */}
      <StatCards />

      {/* Tasks Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Recent Tasks
            </h2>
            <Link
              href="/tasks"
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 py-4">
                No tasks yet
              </p>
            )}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Upcoming Tasks
            </h2>
            <Link
              href="/tasks"
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 py-4">
                No upcoming tasks
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Task Form */}
      {showTaskForm && (
        <TaskForm onClose={closeForm} editTask={editTask} />
      )}
    </div>
  );
};

export default Dashboard;
