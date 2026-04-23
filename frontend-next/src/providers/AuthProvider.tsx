"use client";

import { createContext, useContext, useEffect, ReactNode, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { LoadingScreen } from "@/components/ui/Loading";

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isAuthenticated: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

// Routes that don't require authentication
const publicRoutes = ["/login", "/register", "/"];

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Get store state
  const { isAuthenticated, _hasHydrated, checkAuth } = useAuthStore();

  // Only run auth logic after hydration and mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check auth status after hydration completes
  useEffect(() => {
    if (!mounted || !_hasHydrated) return;

    // Call checkAuth to validate token
    checkAuth();
    setInitialCheckDone(true);
  }, [mounted, _hasHydrated, checkAuth]);

  // Handle redirects after initial check
  useEffect(() => {
    if (!mounted || !initialCheckDone) return;

    const isPublicRoute = publicRoutes.includes(pathname);

    // If not authenticated and trying to access protected route
    if (!isAuthenticated && !isPublicRoute) {
      router.push("/login");
      return;
    }

    // If authenticated and on public route, go to feed
    if (isAuthenticated && pathname === "/login") {
      router.push("/feed");
      return;
    }

    if (isAuthenticated && pathname === "/register") {
      router.push("/feed");
      return;
    }

    if (isAuthenticated && pathname === "/") {
      router.push("/feed");
      return;
    }
  }, [mounted, initialCheckDone, isAuthenticated, pathname, router]);

  // Show loading screen while hydrating or checking auth
  if (!mounted || !initialCheckDone) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        isLoading: false,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
