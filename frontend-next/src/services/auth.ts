import api from "@/lib/api";
import { AuthResponse, User } from "@/types";

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await api.post("/auth/login", { email, password });
    const { data } = response.data as AuthResponse;
    return {
      user: data.user,
      token: data.token,
    };
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    city?: string;
    state?: string;
  }): Promise<{ user: User; token: string }> {
    const response = await api.post("/auth/register", data);
    const { data: authData } = response.data as AuthResponse;
    return {
      user: authData.user,
      token: authData.token,
    };
  },

  async getProfile(): Promise<{ data: User }> {
    const response = await api.get("/users/me");
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<{ data: User }> {
    const response = await api.put("/users/me", data);
    return response.data;
  },

  async updateAvatar(file: File): Promise<{ data: { avatar_url: string } }> {
    const formData = new FormData();
    formData.append("avatar", file);
    // Don't set Content-Type manually - Axios will set it with the correct boundary
    const response = await api.put("/users/me/avatar", formData);
    return response.data;
  },
};
