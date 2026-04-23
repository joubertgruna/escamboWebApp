"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Camera, User, Mail, Phone, MapPin, Save } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Avatar } from "@/components/ui/Avatar";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuthStore } from "@/store/auth";
import { authService } from "@/services/auth";
import { getImageUrl } from "@/lib/api";

export default function EditProfilePage() {
  const router = useRouter();
  const { success, error } = useToast();
  const { user, checkAuth, updateUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    city: user?.city || "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getAvatarUrl = () => {
    if (avatarPreview) return avatarPreview;
    return getImageUrl(user?.avatar_url);
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      error("A imagem deve ter no máximo 5MB");
      return;
    }

    setAvatarFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.name.trim()) {
      error("Informe seu nome");
      return;
    }

    setLoading(true);

    try {
      // Update profile and merge into store
      const profileRes = await authService.updateProfile({
        name: formData.name,
        phone: formData.phone,
        city: formData.city,
      });

      if (profileRes?.data) {
        updateUser(profileRes.data);
      }

      // Update avatar if changed and merge avatar_url into store
      if (avatarFile) {
        const avatarRes = await authService.updateAvatar(avatarFile);
        if (avatarRes?.data?.avatar_url) {
          updateUser({ avatar_url: avatarRes.data.avatar_url });
        }
      }

      // Ensure local auth state is consistent (fallback)
      await checkAuth();

      success("Perfil atualizado com sucesso!");
      router.back();
    } catch (err: any) {
      console.error("Error updating profile:", err);
      error(err.response?.data?.message || "Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-escambo-light">
      <Header showLogo showNotifications showBack />

      <div className="flex-1 p-4">
        <form onSubmit={handleSubmit}>
          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <Avatar
                src={getAvatarUrl()}
                size="xl"
                className="ring-4 ring-white shadow-xl w-28 h-28"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 bg-escambo-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-escambo-secondary transition-colors"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              className="hidden"
            />
            <p className="text-sm text-gray-500 mt-3">
              Toque para alterar a foto
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
            <Input
              label="Nome completo"
              placeholder="Seu nome"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={<User className="w-5 h-5" />}
            />

            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              disabled
              icon={<Mail className="w-5 h-5" />}
              className="opacity-60"
            />

            <Input
              label="Telefone"
              type="tel"
              placeholder="(00) 00000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              icon={<Phone className="w-5 h-5" />}
            />

            <Input
              label="Cidade"
              placeholder="Sua cidade"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              icon={<MapPin className="w-5 h-5" />}
            />
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              <Save className="w-5 h-5 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
