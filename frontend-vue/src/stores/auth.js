import { defineStore } from 'pinia';
import authService from '@/services/authService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: authService.getCurrentUser(),
    token: authService.getToken(),
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
  },

  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authService.login(credentials);
        this.token = response.token;
        this.user = response.user;
        return response;
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authService.register(userData);
        this.token = response.token;
        this.user = response.user;
        return response;
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao criar conta.';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      await authService.logout();
      this.user = null;
      this.token = null;
    },
  },
});
