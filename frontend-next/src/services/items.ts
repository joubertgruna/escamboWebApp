import api from "@/lib/api";
import { Item, ApiResponse } from "@/types";

export const itemService = {
  async getAll(params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Item[]>> {
    const response = await api.get("/items", { params });
    return response.data;
  },

  async getFeed(params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<Item[]>> {
    const response = await api.get("/items/feed", { params });
    return response.data;
  },

  async getById(id: number): Promise<ApiResponse<Item>> {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  async getMyItems(): Promise<ApiResponse<Item[]>> {
    const response = await api.get("/items/mine");
    return response.data;
  },

  async create(data: FormData): Promise<ApiResponse<Item>> {
    // Don't set Content-Type manually - Axios will set it with the correct boundary
    const response = await api.post("/items", data);
    return response.data;
  },

  async update(
    id: number,
    data: Partial<Item>
  ): Promise<ApiResponse<Item>> {
    const response = await api.put(`/items/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/items/${id}`);
  },

  async addPhoto(
    id: number,
    file: File
  ): Promise<ApiResponse<{ id: number; url: string }>> {
    const formData = new FormData();
    formData.append("photos", file);
    // Don't set Content-Type manually - Axios will set it with the correct boundary
    const response = await api.post(`/items/${id}/photos`, formData);
    return response.data;
  },

  async removePhoto(itemId: number, photoId: number): Promise<void> {
    await api.delete(`/items/${itemId}/photos/${photoId}`);
  },
};
