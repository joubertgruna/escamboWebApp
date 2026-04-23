"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Mail,
  Edit2,
  Package,
  Heart,
  MessageCircle,
  LogOut,
  ChevronRight,
  Settings,
  Bell,
  HelpCircle,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Avatar } from "@/components/ui/Avatar";
import { ConfirmModal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useAuthStore } from "@/store/auth";
import { itemService } from "@/services/items";
import { matchService } from "@/services/matches";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/api";

interface Stats {
  items: number;
  matches: number;
  likes: number;
}

const menuItems = [
  { icon: Package, label: "Meus Itens", href: "/my-items", bgColor: "bg-escambo-primary/10", color: "text-escambo-primary" },
  { icon: Heart, label: "Curtidas", href: "/likes", bgColor: "bg-red-50", color: "text-red-500" },
  { icon: MessageCircle, label: "Matches", href: "/matches", bgColor: "bg-blue-50", color: "text-blue-500" },
  { icon: Bell, label: "Notificações", href: "/notifications", bgColor: "bg-amber-50", color: "text-amber-500" },
  { icon: Settings, label: "Configurações", href: "/settings", bgColor: "bg-gray-100", color: "text-gray-600" },
  { icon: HelpCircle, label: "Ajuda", href: "/help", bgColor: "bg-gray-100", color: "text-gray-600" },
];

export default function ProfilePage() {
  const router = useRouter();
  const { success } = useToast();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState<Stats>({ items: 0, matches: 0, likes: 0 });
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [items, matches] = await Promise.all([
          itemService.getMyItems(),
          matchService.getAll(),
        ]);

        setStats({
          items: items.data ? items.data.length : 0,
          matches: matches.data ? matches.data.length : 0,
          likes: 0,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    success("Logout realizado com sucesso!");
    router.push("/login");
  };

  const getAvatarUrl = () => {
    return getImageUrl(user?.avatar_url);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f7]">
      <Header showLogo showNotifications showSettings />

      {/* Centralized Container */}
      <div className="flex justify-center w-full">
        <div className="flex-1 max-w-[640px] lg:max-w-[720px] xl:max-w-[800px] px-4 py-6 space-y-5 pb-24">
          
          {/* Profile Header Card - Redesigned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <Avatar
                  src={getAvatarUrl()}
                  size="2xl"
                  ring
                  className="shadow-xl"
                />
                <button
                  onClick={() => router.push("/edit-profile")}
                  className="absolute -bottom-1 -right-1 w-9 h-9 flex items-center justify-center rounded-full bg-escambo-primary text-white shadow-lg hover:bg-[#30b350] active:scale-95 transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {user?.name}
                </h1>
                {user?.city && (
                  <p className="flex items-center gap-1.5 text-sm text-gray-600 mt-1">
                    <MapPin className="w-4 h-4" />
                    {user.city}
                  </p>
                )}
                {user?.email && (
                  <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </p>
                )}
              </div>
            </div>

            {/* Stats Cards - Inside header with better spacing */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: stats.items, label: "Itens", color: "text-escambo-primary", bgColor: "bg-escambo-primary/10", icon: Package },
                { value: stats.matches, label: "Matches", color: "text-blue-500", bgColor: "bg-blue-50", icon: MessageCircle },
                { value: stats.likes, label: "Curtidas", color: "text-red-500", bgColor: "bg-red-50", icon: Heart },
              ].map((stat, i) => (
                <div 
                  key={i} 
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
                >
                  <div className={cn("w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center", stat.bgColor)}>
                    <stat.icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <p className={cn("text-2xl sm:text-3xl font-bold", stat.color)}>{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Menu - Grid layout for better space usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {menuItems.map((item) => (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className="flex items-center gap-3 px-4 py-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all group"
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", item.bgColor, item.color)}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <span className="font-semibold text-sm text-gray-900 block">
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" />
              </button>
            ))}
          </motion.div>

          {/* Logout Button - Full width, more prominent */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white rounded-2xl shadow-sm border-2 border-red-100 hover:bg-red-50 hover:border-red-200 transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-colors">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="flex-1 text-center font-bold text-base text-red-500">
              Sair da conta
            </span>
          </motion.button>

          {/* App Version */}
          <p className="text-center text-xs text-gray-400 pt-2">
            Escambo v1.0.0
          </p>
        </div>
      </div>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Sair da conta"
        message="Tem certeza que deseja sair?"
        confirmText="Sair"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
