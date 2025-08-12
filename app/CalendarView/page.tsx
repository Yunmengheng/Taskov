'use client';

import React, { useState } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  color?: string;
}

const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1)); // July 2025
  const [events] = useState<CalendarEvent[]>(
    [{ id: '1', title: 'Read', date: new Date(2025, 6, 16), color: '#64748b' },]
  );

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const getNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventsForDate = (day: number) => {
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.filter(event => 
      event.date.getDate() === day &&
      event.date.getMonth() === currentDate.getMonth() &&
      event.date.getFullYear() === currentDate.getFullYear()
    );
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-20 bg-slate-700"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);

      days.push(
        <div
          key={day}
          className="h-20 bg-slate-700 p-2 border-r border-b border-slate-600 relative"
        >
          <div className="text-xs text-slate-300 font-medium">
            {day}
          </div>
          <div className="mt-1">
            {dayEvents.map(event => (
              <div
                key={event.id}
                className="text-xs px-1 py-0.5 bg-slate-600 text-slate-300 rounded text-center"
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-slate-800">
      {/* Header */}
      <div className="bg-slate-700 px-6 py-4 border-b border-slate-600">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium text-white">Task Manager</h1>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-300 hover:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="flex items-center space-x-2 bg-slate-600 px-3 py-1.5 rounded-lg">
              <div className="w-6 h-6 bg-slate-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-medium">G</span>
              </div>
              <span className="text-sm text-slate-300">Google User</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-slate-700 min-h-screen border-r border-slate-600">
          <div className="p-4">
            <h2 className="text-lg font-medium text-white mb-2">Calendar View</h2>
            <p className="text-sm text-slate-400">View your tasks by due date</p>
          </div>
        </div>

        {/* Main Calendar */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-medium text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={getPreviousMonth}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={getNextMonth}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Days of the week header */}
            <div className="grid grid-cols-7 bg-slate-700 border border-slate-600">
              {daysOfWeek.map(day => (
                <div
                  key={day}
                  className="py-3 px-4 text-center text-sm font-medium text-slate-300 border-r border-slate-600 last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 border-l border-t border-slate-600">
              {renderCalendarDays()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;