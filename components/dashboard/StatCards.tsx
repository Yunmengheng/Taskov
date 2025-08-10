"use client";

import React from "react";
import { useTask } from "@/contexts/TaskContext";
import { ClipboardList, CheckCircle2, Clock3, AlertTriangle } from "lucide-react";

const StatCards: React.FC = () => {
  const { tasks } = useTask();
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const now = Date.now();
  const overdue = tasks.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate).getTime() < now).length;
  const pending = tasks.filter((t) => !t.completed).length - overdue;

  const cards = [
    {
      label: "Total Tasks",
      value: total,
      icon: <ClipboardList className="w-6 h-6" />,
      bg: "bg-blue-600/20 border-blue-600/30",
      accent: "text-blue-400",
    },
    {
      label: "Completed",
      value: completed,
      icon: <CheckCircle2 className="w-6 h-6" />,
      bg: "bg-green-600/20 border-green-600/30",
      accent: "text-green-400",
    },
    {
      label: "Pending",
      value: pending,
      icon: <Clock3 className="w-6 h-6" />,
      bg: "bg-yellow-600/20 border-yellow-600/30",
      accent: "text-yellow-400",
    },
    {
      label: "Overdue",
      value: overdue,
      icon: <AlertTriangle className="w-6 h-6" />,
      bg: "bg-red-600/20 border-red-600/30",
      accent: "text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`rounded-xl border ${c.bg} p-6 flex items-center gap-4`}
        >
          <div className={`p-3 rounded-xl ${c.accent} bg-black/10`}>{c.icon}</div>
          <div>
            <div className="text-3xl font-bold text-white mb-1">{c.value}</div>
            <div className="text-sm text-gray-400">{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
