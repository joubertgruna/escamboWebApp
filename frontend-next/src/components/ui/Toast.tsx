"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles = {
  success: {
    container: "bg-white border-green-100",
    icon: "text-green-500 bg-green-50",
    title: "text-green-900",
    message: "text-green-700",
  },
  error: {
    container: "bg-white border-red-100",
    icon: "text-red-500 bg-red-50",
    title: "text-red-900",
    message: "text-red-700",
  },
  info: {
    container: "bg-white border-blue-100",
    icon: "text-blue-500 bg-blue-50",
    title: "text-blue-900",
    message: "text-blue-700",
  },
  warning: {
    container: "bg-white border-amber-100",
    icon: "text-amber-500 bg-amber-50",
    title: "text-amber-900",
    message: "text-amber-700",
  },
};

interface ToastItemProps {
  toast: Toast;
  onRemove: () => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const Icon = icons[toast.type];
  const style = styles[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 400 }}
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border",
        "shadow-[0_4px_12px_rgba(0,0,0,0.08)]",
        "min-w-[320px] max-w-[400px]",
        "backdrop-blur-sm",
        style.container
      )}
    >
      <div className={cn("p-1.5 rounded-lg flex-shrink-0", style.icon)}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className={cn("font-semibold text-sm", style.title)}>{toast.title}</p>
        )}
        <p className={cn("text-sm", toast.title ? "mt-0.5" : "", style.message)}>
          {toast.message}
        </p>
      </div>
      <button
        onClick={onRemove}
        className={cn(
          "p-1 rounded-lg flex-shrink-0",
          "text-gray-400 hover:text-gray-600",
          "hover:bg-gray-100",
          "transition-colors duration-200"
        )}
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const success = useCallback((message: string, title?: string) => {
    addToast({ type: "success", message, title });
  }, [addToast]);

  const error = useCallback((message: string, title?: string) => {
    addToast({ type: "error", message, title });
  }, [addToast]);

  const info = useCallback((message: string, title?: string) => {
    addToast({ type: "info", message, title });
  }, [addToast]);

  const warning = useCallback((message: string, title?: string) => {
    addToast({ type: "warning", message, title });
  }, [addToast]);

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, removeToast, success, error, info, warning }}
    >
      {children}

      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col-reverse gap-3">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onRemove={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
