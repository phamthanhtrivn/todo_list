"use client";

import React, { useState } from "react";
import { Task } from "../types";
import { CheckCircle2, Circle, Trash2, Edit2, Clock } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Swal from "sweetalert2";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Bạn sẽ không thể khôi phục lại công việc này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0284c7",
      cancelButtonColor: "#f43f5e",
      confirmButtonText: "Có, xóa nó!",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      setIsDeleting(true);
      await onDelete(task.id);
      Swal.fire({
        title: "Đã xóa!",
        text: "Công việc đã được xóa thành công.",
        icon: "success",
        confirmButtonColor: "#0284c7",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div
      className={cn(
        "group flex items-start gap-4 p-4 md:p-5 rounded-2xl transition-all duration-300",
        "bg-white/80 border border-slate-200/60 shadow-sm",
        "hover:shadow-md hover:bg-white hover:border-sky-200",
        isDeleting ? "opacity-0 scale-95" : "opacity-100 scale-100",
      )}
    >
      <button
        onClick={() => onToggle(task.id, !task.completed)}
        className="mt-1 flex-shrink-0 text-slate-300 hover:text-sky-500 transition-colors cursor-pointer"
      >
        {task.completed ? (
          <CheckCircle2 className="w-6 h-6 text-sky-500" />
        ) : (
          <Circle className="w-6 h-6" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <h3
          className={cn(
            "text-lg font-medium transition-all duration-300",
            task.completed ? "text-slate-400 line-through" : "text-slate-800",
          )}
        >
          {task.title}
        </h3>
        {task.description && (
          <p
            className={cn(
              "mt-1 text-sm transition-all duration-300",
              task.completed ? "text-slate-400/60" : "text-slate-500",
            )}
          >
            {task.description}
          </p>
        )}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {task.completed
              ? `Hoàn thành lúc: ${new Date(task.updatedAt).toLocaleString("vi-VN")}`
              : `Tạo lúc: ${new Date(task.createdAt).toLocaleString("vi-VN")}`}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(task)}
          className="cursor-pointer p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={handleDelete}
          className="cursor-pointer p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
