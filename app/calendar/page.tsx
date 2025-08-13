"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTask } from "@/contexts/TaskContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Home,
  BarChart3,
  Settings
} from "lucide-react";

const Calendar: React.FC = () => {
  const { tasks } = useTask();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get tasks for calendar view
  const tasksWithDates = tasks.filter(task => task.dueDate);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getTasksForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasksWithDates.filter(task => task.dueDate?.startsWith(dateStr));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Calendar</h1>
          <p className="text-gray-400 text-sm">View statistics and insights about your tasks</p>
        </div>

        {/* Calendar Grid */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-4 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-gray-400 font-medium py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-4">
            {/* Empty cells for first week */}
            {Array.from({ length: firstDay }).map((_, index) => (
              <div key={`empty-${index}`} className="h-24"></div>
            ))}
            
            {/* Calendar days */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dayTasks = getTasksForDate(day);
              const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
              
              return (
                <div
                  key={day}
                  className={`h-24 p-2 border border-slate-600 rounded-lg ${
                    isToday ? 'bg-blue-600/20 border-blue-500' : 'bg-slate-700/30'
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? 'text-blue-400' : 'text-white'
                  }`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayTasks.slice(0, 2).map(task => (
                      <div
                        key={task.id}
                        className={`text-xs px-2 py-1 rounded truncate ${
                          task.completed 
                            ? 'bg-green-500/20 text-green-400' 
                            : task.priority === 'high' 
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-blue-500/20 text-blue-400'
                        }`}
                      >
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="text-xs text-gray-400">
                        +{dayTasks.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tasks Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center mb-4">
              <CalendarIcon size={20} className="text-blue-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">This Month</h3>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              {tasksWithDates.filter(task => {
                const taskDate = new Date(task.dueDate!);
                return taskDate.getMonth() === currentDate.getMonth() && 
                       taskDate.getFullYear() === currentDate.getFullYear();
              }).length}
            </div>
            <p className="text-gray-400">Total tasks</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center mb-4">
              <CalendarIcon size={20} className="text-green-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Completed</h3>
            </div>
            <div className="text-2xl font-bold text-green-400">
              {tasksWithDates.filter(task => {
                const taskDate = new Date(task.dueDate!);
                return task.completed &&
                       taskDate.getMonth() === currentDate.getMonth() && 
                       taskDate.getFullYear() === currentDate.getFullYear();
              }).length}
            </div>
            <p className="text-gray-400">Tasks completed</p>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex items-center mb-4">
              <CalendarIcon size={20} className="text-red-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Overdue</h3>
            </div>
            <div className="text-2xl font-bold text-red-400">
              {tasksWithDates.filter(task => {
                return !task.completed && new Date(task.dueDate!) < new Date();
              }).length}
            </div>
            <p className="text-gray-400">Tasks overdue</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Calendar;