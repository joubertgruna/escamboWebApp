"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Camera, X, Tag, Package, Plus } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuthStore } from "@/store/auth";
import { itemService } from "@/services/items";

const PLACEHOLDER_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoGSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCABoAGgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9k=";

const categories = [
  { value: "eletrônicos", label: "Eletrônicos" },
  { value: "móveis", label: "Móveis" },
  { value: "roupas", label: "Roupas" },
  { value: "esportes", label: "Esportes" },
  { value: "livros", label: "Livros" },
  { value: "games", label: "Games" },
  { value: "veículos", label: "Veículos" },
  { value: "outros", label: "Outros" },
];

const conditions = [
  { value: "novo", label: "Novo", description: "Nunca usado, com embalagem" },
  { value: "seminovo", label: "Seminovo", description: "Usado poucas vezes, como novo" },
  { value: "usado", label: "Usado", description: "Usado normalmente, bom estado" },
  { value: "desgastado", label: "Desgastado", description: "Com sinais de uso, funcional" },
];

export default function NewItemPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const { isAuthenticated } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    trade_for: "",
  });

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalPhotos = photos.length + files.length;

    if (totalPhotos > 5) {
      error("Máximo de 5 fotos");
      return;
    }

    setPhotos((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.title.trim()) {
      error("Informe o título do item");
      return;
    }
    if (!formData.category) {
      error("Selecione uma categoria");
      return;
    }
    if (!formData.condition) {
      error("Selecione a condição do item");
      return;
    }
    if (photos.length === 0) {
      error("Adicione pelo menos uma foto");
      return;
    }

    setSaving(true);

    try {
      // Create FormData with item info and photos
      const data = new FormData();
      data.append("title", formData.title.trim());
      data.append("description", formData.description || "");
      data.append("category", formData.category);
      data.append("condition", formData.condition);
      if (formData.trade_for) {
        data.append("trade_for", formData.trade_for);
      }
      
      // Append photos
      photos.forEach((photo) => {
        data.append("photos", photo);
      });

      await itemService.create(data);

      success("Item criado com sucesso!");
      router.push("/my-items");
    } catch (err: any) {
      console.error("Error creating item:", err);
      error(err.response?.data?.message || "Erro ao criar item");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-8 px-2">
      <Header showLogo showNotifications showBack />
      <form
        className="w-full max-w-md flex flex-col gap-8 mt-6"
        onSubmit={e => { e.preventDefault(); handleSubmit(); }}
        autoComplete="off"
      >
        {/* Fotos */}
        <div>
          <label className="block text-base font-semibold text-gray-800 mb-2">Fotos <span className="text-gray-400 font-normal text-xs">({photos.length}/5)</span></label>
          <div className="flex gap-2 mb-2">
            {photoPreview.map((preview, index) => (
              <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
                <Image src={preview} alt={`Foto ${index + 1}`} fill className="object-cover" />
                {index === 0 && (
                  <span className="absolute top-1 left-1 bg-escambo-primary text-white text-[10px] px-2 py-0.5 rounded-full">Principal</span>
                )}
                <button type="button" onClick={() => removePhoto(index)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {photos.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-escambo-primary hover:text-escambo-primary bg-gray-50"
              >
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-xs">Adicionar</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoSelect}
            className="hidden"
          />
          <p className="text-xs text-gray-500 mt-1">A primeira foto será a principal do anúncio</p>
        </div>

        <Input
          label="Título *"
          placeholder="Ex: iPhone 12 Pro Max"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          icon={<Tag className="w-4 h-4" />}
        />

        <div>
          <label className="block text-base font-semibold text-gray-800 mb-2">Descrição</label>
          <textarea
            placeholder="Descreva seu item em detalhes: estado de conservação, acessórios inclusos, motivo da troca..."
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-escambo-primary focus:ring-2 focus:ring-escambo-primary/10 transition-all"
          />
        </div>

        <div>
          <label className="block text-base font-semibold text-gray-800 mb-2">Categoria *</label>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat.value })}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${formData.category === cat.value ? "border-escambo-primary bg-escambo-primary/10 text-escambo-primary" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-base font-semibold text-gray-800 mb-2">Condição *</label>
          <div className="flex flex-col gap-2">
            {conditions.map(cond => (
              <button
                key={cond.value}
                type="button"
                onClick={() => setFormData({ ...formData, condition: cond.value })}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${formData.condition === cond.value ? "border-escambo-primary bg-escambo-primary/10" : "border-gray-200 hover:border-gray-300"}`}
              >
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.condition === cond.value ? "border-escambo-primary" : "border-gray-300"}`}>{formData.condition === cond.value && <span className="w-2 h-2 rounded-full bg-escambo-primary block" />}</span>
                <span className="flex flex-col">
                  <span className={`text-sm font-medium ${formData.condition === cond.value ? "text-escambo-primary" : "text-gray-700"}`}>{cond.label}</span>
                  <span className="text-xs text-gray-500">{cond.description}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <Input
          label="O que você gostaria em troca? (opcional)"
          placeholder="Ex: Console de videogame, celular..."
          value={formData.trade_for}
          onChange={e => setFormData({ ...formData, trade_for: e.target.value })}
          icon={<Package className="w-4 h-4" />}
        />

        <button
          type="submit"
          disabled={saving}
          className="mt-2 w-full py-3 rounded-full bg-escambo-primary text-white font-bold text-lg shadow-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          {saving ? "Publicando..." : "Publicar Item"}
        </button>
      </form>
    </div>
  );
}
