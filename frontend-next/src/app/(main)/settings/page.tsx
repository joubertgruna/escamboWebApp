"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Lock, User, Bell, Eye, HelpCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { useAuthStore } from "@/store/auth";
import api from "@/lib/api";

export default function SettingsPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const { logout, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  // Profile tab states
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await api.put("/users/profile", {
        name,
        email,
        phone,
      });
      success("Perfil atualizado com sucesso!");
    } catch (err) {
      error("Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Limpar token
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      logout();
      router.push("/login");
      success("Desconectado com sucesso");
    } catch (err) {
      error("Erro ao desconectar");
    }
  };

  const tabs = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "preferences", label: "Preferências", icon: Bell },
    { id: "security", label: "Segurança", icon: Lock },
    { id: "privacy", label: "Privacidade", icon: Eye },
    { id: "help", label: "Ajuda", icon: HelpCircle },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-escambo-light pb-20">
      <Header showLogo showNotifications showBack />

      <main className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-escambo-primary text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Editar Perfil</h3>
              <Input
                label="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                disabled
              />
              <Input
                label="Telefone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+55 85 99999-9999"
              />
              <Button
                fullWidth
                onClick={handleSaveProfile}
                loading={loading}
                className="mt-6"
              >
                Salvar Mudanças
              </Button>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Preferências</h3>
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="checkbox" defaultChecked className="w-5 h-5" />
                <div>
                  <p className="font-medium text-gray-900">Notificações</p>
                  <p className="text-sm text-gray-500">Receber notificações</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="checkbox" defaultChecked className="w-5 h-5" />
                <div>
                  <p className="font-medium text-gray-900">Sons</p>
                  <p className="text-sm text-gray-500">Sons de notificação</p>
                </div>
              </label>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Segurança</h3>
              <Input
                label="Senha Atual"
                type="password"
                placeholder="••••••••"
              />
              <Input
                label="Nova Senha"
                type="password"
                placeholder="••••••••"
              />
              <Input
                label="Confirmar Senha"
                type="password"
                placeholder="••••••••"
              />
              <Button fullWidth className="mt-6">
                Mudar Senha
              </Button>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === "privacy" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Privacidade</h3>
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="privacy" defaultChecked className="w-5 h-5" />
                <div>
                  <p className="font-medium text-gray-900">Perfil Público</p>
                  <p className="text-sm text-gray-500">Qualquer um pode ver</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="privacy" className="w-5 h-5" />
                <div>
                  <p className="font-medium text-gray-900">Perfil Privado</p>
                  <p className="text-sm text-gray-500">Apenas amigos veem</p>
                </div>
              </label>
            </div>
          )}

          {/* Help Tab */}
          {activeTab === "help" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Ajuda</h3>
              <Button fullWidth variant="outline" onClick={() => router.push("/help")}>
                Ver FAQ
              </Button>
              <Button fullWidth variant="outline">
                Contactar Suporte
              </Button>
              <Button
                fullWidth
                variant="danger"
                onClick={handleLogout}
                className="mt-6"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
