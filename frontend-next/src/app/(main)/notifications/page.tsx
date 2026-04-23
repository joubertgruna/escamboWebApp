"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Trash2, Check } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Spinner } from "@/components/ui/Loading";
import { useToast } from "@/components/ui/Toast";
import api from "@/lib/api";

interface Notification {
  id: number;
  type: "match" | "like" | "message" | "mention";
  title: string;
  message: string;
  image_url?: string;
  user_id?: number;
  item_id?: number;
  read_at?: string;
  created_at: string;
}

export default function NotificationsPage() {
  const { success, error } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifications?limit=20");
        setNotifications(response.data.data || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        error("Erro ao carregar notificações");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [error]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n
        )
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      success("Notificação removida");
    } catch (err) {
      console.error("Error deleting notification:", err);
      error("Erro ao remover notificação");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header showLogo showNotifications showBack />
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-escambo-light pb-20">
      <Header showLogo showNotifications showBack />

      <div className="flex justify-center w-full">
        <main className="flex-1 p-4 max-w-[640px] lg:max-w-[720px] xl:max-w-[800px] w-full">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Bell className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Nenhuma notificação
            </h2>
            <p className="text-gray-500">
              Você está em dia com suas notificações
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-xl p-4 flex gap-3 ${
                  !notif.read_at ? "border-l-4 border-escambo-primary" : ""
                }`}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">
                    {notif.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(notif.created_at).toLocaleString("pt-BR")}
                  </p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {!notif.read_at && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Marcar como lida"
                    >
                      <Check className="w-5 h-5 text-gray-400" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Deletar"
                  >
                    <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
