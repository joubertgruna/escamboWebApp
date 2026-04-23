import axios from "axios";

// Detectar automaticamente a URL da API baseado na origem do acesso
const getApiUrl = () => {
  if (typeof window === "undefined") {
    // Server-side: usar variável de ambiente
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  }
  
  // Client-side: usar o mesmo host que está acessando o frontend
  const currentHost = window.location.hostname;
  const currentProtocol = window.location.protocol;
  
  // Se acessando via localhost, usar localhost
  if (currentHost === "localhost" || currentHost === "127.0.0.1") {
    return "http://localhost:3000";
  }
  
  // Se acessando via DevTunnels, usar a URL do túnel do backend
  if (currentHost.includes("devtunnels.ms")) {
    // Trocar a porta 5174 por 3000 na URL do túnel
    // Formato: https://XXXX-5174.brs.devtunnels.ms -> https://XXXX-3000.brs.devtunnels.ms
    const backendHost = currentHost.replace("-5174.", "-3000.");
    return `${currentProtocol}//${backendHost}`;
  }
  
  // Para qualquer outro host (IP local ou externo), usar o mesmo host na porta 3000
  return `${currentProtocol}//${currentHost}:3000`;
};

const API_URL = getApiUrl();

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add auth token and handle FormData
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("escambo_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Remove Content-Type for FormData so Axios can set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("escambo_token");
      localStorage.removeItem("escambo_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Função para obter a URL base da API (útil para imagens)
export const getBaseUrl = () => {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  }
  return getApiUrl();
};

// Função para construir URL de imagem corretamente
export const getImageUrl = (path: string | undefined | null): string => {
  if (!path) return "/placeholder-item.jpg";
  
  // Se já é uma URL completa (http/https), retornar como está
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  
  // Construir URL completa usando a base da API
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

export default api;
