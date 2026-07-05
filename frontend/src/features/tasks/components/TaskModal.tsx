"use client";

import React, { useState, useEffect } from "react";
import { Task, TaskRequest } from "../types";
import { Loader2, X } from "lucide-react";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: TaskRequest) => Promise<void>;
  initialData?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || "");
      setDescription(initialData?.description || "");
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ title, description });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={() => !isSubmitting && onClose()}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white p-6 md:p-8 rounded-3xl shadow-2xl shadow-sky-900/5 border border-slate-100 animate-in zoom-in-95 fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          {initialData ? "Cập nhật công việc" : "Thêm công việc mới"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Công việc <span className="text-red-500">*</span>
            </label>
            <input
              autoFocus
              type="text"
              placeholder="Công việc cần thực hiện"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mô tả (Tùy chọn)
            </label>
            <textarea
              placeholder="Thêm mô tả cho công việc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none resize-none min-h-[120px] transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!title.trim() || isSubmitting}
              className="cursor-pointer px-6 py-2.5 rounded-xl bg-sky-500 text-white font-medium hover:bg-sky-600 focus:ring-4 focus:ring-sky-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-sky-500/30"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {initialData ? "Lưu thay đổi" : "Tạo công việc"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
