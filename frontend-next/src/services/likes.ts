import api from "@/lib/api";
import { Like, ApiResponse } from "@/types";

export const likeService = {
  async like(itemId: number): Promise<ApiResponse<{ matched: boolean; match_id?: number }>> {
    // Backend expects POST /api/likes with body { itemId }
    const response = await api.post(`/likes`, { itemId });
    return response.data;
  },

  async pass(itemId: number): Promise<void> {
    // Pass action - currently just a no-op, but can be extended to track passes
    // This would allow the backend to learn about user preferences
  },

  async unlike(itemId: number): Promise<void> {
    await api.delete(`/likes/${itemId}`);
  },

  async getMyLikes(): Promise<ApiResponse<Like[]>> {
    const response = await api.get("/likes/my");
    return response.data;
  },

  async getLikesOnMyItems(): Promise<ApiResponse<Like[]>> {
    const response = await api.get("/likes/received");
    return response.data;
  },
};
