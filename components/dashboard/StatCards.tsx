"use client";

import React from "react";
import { useTask } from "@/contexts/TaskContext";

const StatCards: React.FC = () => {
  const { tasks } = useTask();
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[{ label: "Total", value: total }, { label: "Completed", value: completed }, { label: "Pending", value: pending }].map(
        (s) => (
          <div key={s.label} className="rounded-lg border bg-white/50 dark:bg-zinc-900/50 p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">{s.label}</div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-white">{s.value}</div>
          </div>
        )
      )}
    </div>
  );
};

export default StatCards;
