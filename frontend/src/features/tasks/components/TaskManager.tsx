"use client";

import React, { useState, useEffect } from "react";
import { Task, TaskRequest } from "../types";
import { taskApi } from "../api";
import { TaskItem } from "./TaskItem";
import { TaskModal } from "./TaskModal";
import {
  Plus,
  Search,
  Loader2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const completedFilter =
        filter === "all" ? undefined : filter === "completed";
      const res = await taskApi.getTasks(search, completedFilter, page, 3);
      setTasks(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Reset page on search or filter change
  useEffect(() => {
    setPage(0);
  }, [search, filter]);

  useEffect(() => {
    // Add a debounce for searching
    const timer = setTimeout(() => {
      fetchTasks();
    }, 1000);
    return () => clearTimeout(timer);
  }, [search, filter, page]);

  const handleToggle = async (id: string, completed: boolean) => {
    // Optimistic update
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed } : t)));
    try {
      await taskApi.updateTaskStatus(id, completed);
    } catch (error) {
      console.error(error);
      fetchTasks(); // Revert on failure
    }
  };

  const handleDelete = async (id: string) => {
    // Optimistic update
    setTasks(tasks.filter((t) => t.id !== id));
    try {
      await taskApi.deleteTask(id);
    } catch (error) {
      console.error(error);
      fetchTasks(); // Revert on failure
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (request: TaskRequest) => {
    if (editingTask) {
      await taskApi.updateTask(editingTask.id, request);
    } else {
      await taskApi.createTask(request);
    }
    fetchTasks();
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-slate-200/60 shadow-sm">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm công việc..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-shadow text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div className="w-full md:w-auto">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="cursor-pointer w-full md:w-50 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-sky-500 outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-no-repeat bg-[position:right_16px_center]"
          >
            <option value="all">Tất cả</option>
            <option value="active">Chưa hoàn thành</option>
            <option value="completed">Hoàn thành</option>
          </select>
        </div>

        <div>
          <button
            onClick={handleCreateNew}
            className="cursor-pointer group flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-sky-400 text-slate-500 hover:text-sky-500 transition-all bg-white/50 hover:bg-sky-50/50 backdrop-blur-sm"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Tạo công việc mới</span>
          </button>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingTask}
      />

      {/* Task List */}
      <div className="flex flex-col gap-3">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4 opacity-60">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-slate-300" />
            </div>
            <p>Không có công việc cho hôm nay!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="group flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-2xl border border-slate-200/60 bg-white/80 hover:bg-sky-50 text-slate-600 hover:text-sky-600 hover:border-sky-200 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:hover:bg-white/80 disabled:hover:border-slate-200/60 disabled:hover:text-slate-600 disabled:hover:shadow-none disabled:active:scale-100 disabled:cursor-not-allowed cursor-pointer backdrop-blur-sm transition-all duration-300"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Trang trước
          </button>

          <div className="flex items-center justify-center px-5 py-2.5 rounded-2xl bg-white/80 border border-slate-200/60 shadow-sm backdrop-blur-sm min-w-[120px]">
            <span className="text-sm font-bold text-slate-700">
              {page + 1}{" "}
              <span className="text-slate-400 font-medium mx-1.5">/</span>{" "}
              {totalPages}
            </span>
          </div>

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="group flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-2xl border border-slate-200/60 bg-white/80 hover:bg-sky-50 text-slate-600 hover:text-sky-600 hover:border-sky-200 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:hover:bg-white/80 disabled:hover:border-slate-200/60 disabled:hover:text-slate-600 disabled:hover:shadow-none disabled:active:scale-100 disabled:cursor-not-allowed cursor-pointer backdrop-blur-sm transition-all duration-300"
          >
            Trang sau
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};
