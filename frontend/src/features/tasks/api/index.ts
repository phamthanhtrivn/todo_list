import axios from "axios";
import { Task, TaskRequest, PageResponse, ApiResponse } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Tạo axios instance tự động gửi kèm cookie (HttpOnly cookie cho sessionId)
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const taskApi = {
  getTasks: async (
    search?: string,
    completed?: boolean,
    page = 0,
    size = 5,
  ): Promise<ApiResponse<PageResponse<Task>>> => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (completed !== undefined)
      params.append("completed", completed.toString());
    params.append("page", page.toString());
    params.append("size", size.toString());

    const response = await apiClient.get<ApiResponse<PageResponse<Task>>>(
      `/tasks?${params.toString()}`,
    );
    return response.data;
  },

  createTask: async (request: TaskRequest): Promise<ApiResponse<Task>> => {
    const response = await apiClient.post<ApiResponse<Task>>("/tasks", request);
    return response.data;
  },

  updateTask: async (
    id: string,
    request: TaskRequest,
  ): Promise<ApiResponse<Task>> => {
    const response = await apiClient.put<ApiResponse<Task>>(
      `/tasks/${id}`,
      request,
    );
    return response.data;
  },

  updateTaskStatus: async (
    id: string,
    completed: boolean,
  ): Promise<ApiResponse<Task>> => {
    const response = await apiClient.patch<ApiResponse<Task>>(
      `/tasks/${id}/status`,
      { completed },
    );
    return response.data;
  },

  deleteTask: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/tasks/${id}`);
    return response.data;
  },
};
