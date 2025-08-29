"use client";

import React from "react";
import { useTask, type Task } from "@/contexts/TaskContext";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { MoreHorizontal, Edit, Trash2, Calendar } from "lucide-react";

type KanbanStatus = "todo" | "inProgress" | "completed";

interface KanbanColumn {
  id: KanbanStatus;
  title: string;
  count: number;
}

interface KanbanBoardProps {
  onEditTask: (task: Task) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ onEditTask }) => {
  const { tasks, updateTask, deleteTask } = useTask();

  // Debug: log all tasks to see their current state
  React.useEffect(() => {
    console.log("📋 All tasks:", tasks.map(t => ({
      id: t.id,
      title: t.title,
      completed: t.completed,
      inProgress: t.inProgress
    })));
  }, [tasks]);

  // Group tasks by status - Fixed filtering logic
  const getTasksByStatus = (status: KanbanStatus) => {
    let filteredTasks: Task[] = []; // Initialize with empty array
    
    switch (status) {
      case "todo":
        filteredTasks = tasks.filter(task => !task.completed && !task.inProgress);
        break;
      case "inProgress":
        filteredTasks = tasks.filter(task => !task.completed && !!task.inProgress);
        break;
      case "completed":
        filteredTasks = tasks.filter(task => !!task.completed);
        break;
      default:
        filteredTasks = [];
    }
    
    console.log(`📊 ${status} tasks:`, filteredTasks.length, filteredTasks.map(t => t.title));
    return filteredTasks;
  };

  const columns: KanbanColumn[] = [
    {
      id: "todo",
      title: "To Do",
      count: getTasksByStatus("todo").length,
    },
    {
      id: "inProgress", 
      title: "In Progress",
      count: getTasksByStatus("inProgress").length,
    },
    {
      id: "completed",
      title: "Completed", 
      count: getTasksByStatus("completed").length,
    },
  ];

  const moveTask = async (taskId: string, newStatus: KanbanStatus) => {
    console.log(`🔄 Moving task ${taskId} to ${newStatus}`);
    
    const currentTask = tasks.find(t => t.id === taskId);
    console.log(`📝 Current task state:`, {
      id: currentTask?.id,
      title: currentTask?.title,
      completed: currentTask?.completed,
      inProgress: currentTask?.inProgress
    });
    
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
        // Removed completedAt since the column doesn't exist
        break;
    }

    console.log(`📤 Sending updates:`, updates);

    try {
      await updateTask(taskId, updates);
      console.log(`✅ Task ${taskId} moved to ${newStatus}`);
    } catch (error) {
      console.error(`❌ Failed to move task ${taskId} to ${newStatus}:`, error);
    }
  };

  const onDragEnd = (result: DropResult) => {
    console.log("🎯 Drag ended:", result);
    
    const { destination, source, draggableId } = result;

    // If no destination, return
    if (!destination) {
      console.log("❌ No destination");
      return;
    }

    // If dropped in same position, return
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      console.log("❌ Same position");
      return;
    }

    const taskId = draggableId;
    const newStatus = destination.droppableId as KanbanStatus;

    console.log(`🔄 Moving task ${taskId} from ${source.droppableId} to ${newStatus}`);
    
    // Move the task
    moveTask(taskId, newStatus);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const priorityStyles: { [key: string]: string } = {
    low: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    medium: "bg-amber-500/10 text-amber-400 border border-amber-500/20", 
    high: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  };

  const categoryStyles: { [key: string]: string } = {
    work: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    personal: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
    study: "bg-pink-500/10 text-pink-400 border border-pink-500/20",
  };

  return (
    <div className="h-full p-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 h-full overflow-x-auto">
          {columns.map((column) => (
            <div key={column.id} className="flex-1 min-w-[320px] bg-slate-800/50 rounded-2xl border border-slate-700/50">
              {/* Column Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-white text-lg">{column.title}</h3>
                  <span className="bg-slate-600/50 text-slate-300 text-sm px-3 py-1 rounded-full">
                    {column.count}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-white p-2 hover:bg-slate-600 rounded-lg transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {/* Column Content */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-4 min-h-[600px] transition-all duration-200 ${
                      snapshot.isDraggingOver ? "bg-slate-700/30 ring-2 ring-blue-500/30" : ""
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
                              className={`bg-slate-800/80 rounded-xl p-4 cursor-grab active:cursor-grabbing transition-colors duration-200 hover:bg-slate-700/80 group border border-slate-600/50 ${
                                snapshot.isDragging ? "shadow-2xl z-50 ring-2 ring-blue-500/50" : ""
                              } ${
                                task.priority === "high" ? "border-l-4 border-rose-500" :
                                task.priority === "medium" ? "border-l-4 border-amber-500" :
                                task.priority === "low" ? "border-l-4 border-emerald-500" : ""
                              } ${
                                task.completed ? "opacity-80" : ""
                              }`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <h4 className={`font-medium text-base leading-tight pr-2 ${
                                  task.completed ? "line-through text-slate-400" : "text-white"
                                }`}>
                                  {task.title}
                                </h4>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onEditTask(task);
                                    }}
                                    className="text-slate-400 hover:text-white p-1.5 hover:bg-slate-600 rounded-lg transition-colors"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteTask(task.id);
                                    }}
                                    className="text-slate-400 hover:text-rose-400 p-1.5 hover:bg-slate-600 rounded-lg transition-colors"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                              
                              {task.description && (
                                <p className={`text-sm mb-4 line-clamp-2 leading-relaxed ${
                                  task.completed ? "line-through text-slate-500" : "text-slate-400"
                                }`}>
                                  {task.description}
                                </p>
                              )}

                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {task.priority && (
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityStyles[task.priority]}`}>
                                      {task.priority}
                                    </span>
                                  )}
                                  {task.category && (
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${categoryStyles[task.category]}`}>
                                      {task.category}
                                    </span>
                                  )}
                                  {task.completed && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                      ✓ Done
                                    </span>
                                  )}
                                </div>
                                
                                {task.dueDate && (
                                  <div className="flex items-center gap-1 text-xs text-rose-400 font-medium">
                                    <Calendar size={12} />
                                    <span>{formatDate(task.dueDate)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {provided.placeholder}
                    
                    {/* Empty State */}
                    {getTasksByStatus(column.id).length === 0 && (
                      <div className="flex items-center justify-center h-40 text-slate-500 text-sm">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-slate-600/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                            <div className="w-6 h-6 bg-slate-600/40 rounded"></div>
                          </div>
                          <p>Drop tasks here</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;