import api from "@/lib/api";
import { Match, Message, ApiResponse } from "@/types";

export const matchService = {
  async getAll(): Promise<ApiResponse<Match[]>> {
    const response = await api.get("/matches");
    return response.data;
  },

  async getById(id: number): Promise<ApiResponse<Match>> {
    const response = await api.get(`/matches/${id}`);
    return response.data;
  },

  async getMessages(matchId: number): Promise<ApiResponse<{ messages: Message[]; total: number } | Message[]>> {
    const response = await api.get(`/matches/${matchId}/messages`);
    return response.data;
  },

  async sendMessage(
    matchId: number,
    content: string
  ): Promise<ApiResponse<Message>> {
    const response = await api.post(`/matches/${matchId}/messages`, { content });
    return response.data;
  },

  async markAsRead(matchId: number): Promise<void> {
    await api.post(`/matches/${matchId}/read`);
  },

  async updateStatus(
    matchId: number,
    status: "accepted" | "rejected" | "completed"
  ): Promise<ApiResponse<Match>> {
    const response = await api.put(`/matches/${matchId}`, { status });
    return response.data;
  },
};
