"use client";

import React from "react";
import { useTask, type Task } from "@/contexts/TaskContext";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";

type KanbanStatus = "todo" | "inProgress" | "completed";

interface KanbanColumn {
  id: KanbanStatus;
  title: string;
  count: number;
}

const KanbanBoard: React.FC = () => {
  const { tasks, updateTask, deleteTask, addTask } = useTask();

  // Group tasks by status
  const getTasksByStatus = (status: KanbanStatus) => {
    switch (status) {
      case "todo":
        return tasks.filter(task => !task.completed && !task.inProgress);
      case "inProgress":
        return tasks.filter(task => !task.completed && task.inProgress);
      case "completed":
        return tasks.filter(task => task.completed);
      default:
        return [];
    }
  };

  const columns: KanbanColumn[] = [
    {
      id: "todo",
      title: "To do",
      count: getTasksByStatus("todo").length,
    },
    {
      id: "inProgress", 
      title: "In-progress",
      count: getTasksByStatus("inProgress").length,
    },
    {
      id: "completed",
      title: "Completed", 
      count: getTasksByStatus("completed").length,
    },
  ];

  const moveTask = (taskId: string, newStatus: KanbanStatus) => {
    const updates: Partial<Task> = {};
    
    switch (newStatus) {
      case "todo":
        updates.completed = false;
        updates.inProgress = false;
        break;
      case "inProgress":
        updates.completed = false;
        updates.inProgress = true;
        break;
      case "completed":
        updates.completed = true;
        updates.inProgress = false;
        break;
    }

    updateTask(taskId, updates);
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const taskId = draggableId;
    const newStatus = destination.droppableId as KanbanStatus;

    moveTask(taskId, newStatus);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const priorityStyles: { [key: string]: string } = {
    low: "bg-green-500 text-white",
    medium: "bg-orange-500 text-white", 
    high: "bg-red-500 text-white",
  };

  const categoryStyles: { [key: string]: string } = {
    work: "bg-blue-500 text-white",
    personal: "bg-purple-500 text-white",
    study: "bg-pink-500 text-white",
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 h-full">
        {columns.map((column) => (
          <div key={column.id} className="flex-1 bg-slate-700 rounded-lg min-h-[500px]">
            {/* Column Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-600">
              <div className="flex items-center gap-3">
                <h3 className="font-medium text-white">{column.title}</h3>
                <span className="bg-slate-600 text-gray-300 text-sm px-2 py-1 rounded-full">
                  {column.count}
                </span>
              </div>
              <button className="text-gray-400 hover:text-white">
                <MoreHorizontal size={16} />
              </button>
            </div>

            {/* Column Content */}
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-4 min-h-[400px] transition-colors ${
                    snapshot.isDraggingOver ? "bg-slate-600/50" : ""
                  }`}
                >
                  <div className="space-y-3">
                    {getTasksByStatus(column.id).map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-slate-800 rounded-lg p-4 cursor-grab active:cursor-grabbing transition-all ${
                              snapshot.isDragging ? "shadow-lg rotate-2 scale-105" : "hover:bg-slate-750"
                            } ${
                              task.priority === "high" ? "border-l-4 border-red-500" :
                              task.priority === "medium" ? "border-l-4 border-orange-500" :
                              task.priority === "low" ? "border-l-4 border-green-500" : ""
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-white text-sm">{task.title}</h4>
                              <div className="flex items-center gap-1">
                                <button className="text-gray-400 hover:text-white p-1">
                                  <Edit size={12} />
                                </button>
                                <button 
                                  onClick={() => deleteTask(task.id)}
                                  className="text-gray-400 hover:text-red-400 p-1"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                            
                            {task.description && (
                              <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                                {task.description}
                              </p>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {task.priority && (
                                  <span className={`text-xs px-2 py-1 rounded ${priorityStyles[task.priority] || 'bg-gray-600'}`}>
                                    {task.priority}
                                  </span>
                                )}
                                {task.category && (
                                  <span className={`text-xs px-2 py-1 rounded ${categoryStyles[task.category] || 'bg-gray-600'}`}>
                                    {task.category}
                                  </span>
                                )}
                              </div>
                              
                              {task.dueDate && (
                                <span className="text-xs text-red-400">
                                  {formatDate(task.dueDate)}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;