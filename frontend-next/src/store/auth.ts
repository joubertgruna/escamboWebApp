import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  login: (user: User, token: string) => void;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setHasHydrated: (state: boolean) => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,

      login: (user, token) => {
        localStorage.setItem("escambo_token", token);
        localStorage.setItem("escambo_user", JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
      },

      setAuth: (user, token) => {
        localStorage.setItem("escambo_token", token);
        localStorage.setItem("escambo_user", JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem("escambo_token");
        localStorage.removeItem("escambo_user");
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          localStorage.setItem("escambo_user", JSON.stringify(updatedUser));
          set({ user: updatedUser });
        }
      },

      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },

      checkAuth: () => {
        // Validate token exists and is not expired
        const token = localStorage.getItem("escambo_token");
        const userStr = localStorage.getItem("escambo_user");

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({ user, token, isAuthenticated: true });
          } catch {
            // Clear invalid data
            localStorage.removeItem("escambo_token");
            localStorage.removeItem("escambo_user");
            set({ user: null, token: null, isAuthenticated: false });
          }
        } else {
          set({ user: null, token: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "escambo-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
        }
      },
    }
  )
);
