"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Camera, X, Tag, Package, Save, Trash2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Loading";
import { ConfirmModal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { useAuthStore } from "@/store/auth";
import { itemService } from "@/services/items";
import { Item, ItemPhoto } from "@/types";
import { getImageUrl } from "@/lib/api";

const PLACEHOLDER_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoGSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCABoAGgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWm5ybnJ2eoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlbaWmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q==";

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

// Mapeamento de categorias em inglês para português
const categoryMapping: Record<string, string> = {
  electronics: "eletrônicos",
  furniture: "móveis",
  clothes: "roupas",
  sports: "esportes",
  books: "livros",
  games: "games",
  vehicles: "veículos",
  other: "outros",
};

const normalizeCategory = (category: string): string => {
  const lower = category?.toLowerCase() || "";
  return categoryMapping[lower] || lower;
};

const conditions = [
  { value: "novo", label: "Novo", description: "Nunca usado, com embalagem" },
  { value: "seminovo", label: "Seminovo", description: "Usado poucas vezes, como novo" },
  { value: "usado", label: "Usado", description: "Usado normalmente, bom estado" },
  { value: "desgastado", label: "Desgastado", description: "Com sinais de uso, funcional" },
];

export default function EditItemPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error } = useToast();
  const { isAuthenticated } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const itemId = Number(params.id);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photos, setPhotos] = useState<ItemPhoto[]>([]);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [newPhotoPreview, setNewPhotoPreview] = useState<string[]>([]);
  const [photosToDelete, setPhotosToDelete] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  // Fetch item data
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchItem = async () => {
      try {
        if (!itemId || itemId === 0) {
          error("ID do item inválido");
          router.back();
          return;
        }
        
        const response = await itemService.getById(itemId);
        const item = response.data;
        setFormData({
          title: item.title || "",
          description: item.description || "",
          category: normalizeCategory(item.category || ""),
          condition: item.condition?.toLowerCase() || "",
          trade_for: item.trade_for || "",
        });
        setPhotos(item.photos || []);
      } catch (err) {
        console.error("Error fetching item:", err);
        error("Erro ao carregar item");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId, isAuthenticated, error, router]);

  const getPhotoUrl = (photo: ItemPhoto) => {
    return getImageUrl(photo?.url);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalPhotos = photos.length - photosToDelete.length + newPhotos.length + files.length;

    if (totalPhotos > 5) {
      error("Máximo de 5 fotos");
      return;
    }

    setNewPhotos((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhotoPreview((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingPhoto = (photoId: number) => {
    setPhotosToDelete((prev) => [...prev, photoId]);
  };

  const removeNewPhoto = (index: number) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index));
    setNewPhotoPreview((prev) => prev.filter((_, i) => i !== index));
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

    const remainingPhotos = photos.length - photosToDelete.length + newPhotos.length;
    if (remainingPhotos === 0) {
      error("Adicione pelo menos uma foto");
      return;
    }

    setSaving(true);

    try {
      // Update item
      await itemService.update(itemId, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        condition: formData.condition,
        trade_for: formData.trade_for,
      });

      // Delete photos
      for (const photoId of photosToDelete) {
        await itemService.removePhoto(itemId, photoId);
      }

      // Upload new photos
      for (let i = 0; i < newPhotos.length; i++) {
        await itemService.addPhoto(itemId, newPhotos[i]);
      }

      success("Item atualizado com sucesso!");
      router.push("/my-items");
    } catch (err: any) {
      console.error("Error updating item:", err);
      error(err.response?.data?.message || "Erro ao atualizar item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await itemService.delete(itemId);
      success("Item excluído com sucesso!");
      router.push("/my-items");
    } catch (err) {
      console.error("Error deleting item:", err);
      error("Erro ao excluir item");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-escambo-light">
      <Header
        title="Editar Item"
        showBack
        rightContent={
          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-2 rounded-full text-escambo-danger hover:bg-red-50"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        }
      />

      <div className="flex-1 p-4">
        {/* Photos */}
        <div className="mb-6">
          <h3 className="font-semibold text-escambo-dark mb-3">Fotos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {/* Existing photos */}
            {photos
              .filter((p) => !photosToDelete.includes(p.id))
              .map((photo, index) => (
                <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden group">
                  <Image
                    src={getPhotoUrl(photo)}
                    alt={`Photo ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                    placeholder="blur"
                    blurDataURL={PLACEHOLDER_BLUR}
                  />
                  {photo.is_primary && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-escambo-primary text-white text-xs rounded-full">
                      Principal
                    </div>
                  )}
                  <button
                    onClick={() => removeExistingPhoto(photo.id)}
                    className="absolute -top-2 -right-2 w-6 sm:w-7 h-6 sm:h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

            {/* New photos */}
            {newPhotoPreview.map((preview, index) => (
              <div key={`new-${index}`} className="relative aspect-square rounded-xl overflow-hidden group">
                <Image
                  src={preview}
                  alt={`New photo ${index + 1}`}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-escambo-info text-white text-xs rounded-full">
                  Nova
                </div>
                <button
                  onClick={() => removeNewPhoto(index)}
                  className="absolute -top-2 -right-2 w-6 sm:w-7 h-6 sm:h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Add photo button */}
            {photos.length - photosToDelete.length + newPhotos.length < 5 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-escambo-primary hover:text-escambo-primary transition-colors"
              >
                <Camera className="w-8 h-8" />
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
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
          <Input
            label="Título"
            placeholder="Ex: iPhone 12 Pro Max"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            icon={<Tag className="w-5 h-5" />}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              placeholder="Descreva seu item em detalhes..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-escambo-primary focus:ring-2 focus:ring-escambo-primary/20 outline-none resize-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.value })}
                  className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                    formData.category === cat.value
                      ? "border-escambo-primary bg-escambo-primary/10 text-escambo-primary"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condição
            </label>
            <div className="space-y-2">
              {conditions.map((cond) => (
                <button
                  key={cond.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, condition: cond.value })}
                  className={`w-full flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                    formData.condition === cond.value
                      ? "border-escambo-primary bg-escambo-primary/10"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      formData.condition === cond.value
                        ? "border-escambo-primary"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.condition === cond.value && (
                      <div className="w-2.5 h-2.5 rounded-full bg-escambo-primary" />
                    )}
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        formData.condition === cond.value
                          ? "text-escambo-primary"
                          : "text-gray-700"
                      }`}
                    >
                      {cond.label}
                    </p>
                    <p className="text-sm text-gray-500">{cond.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Input
            label="O que você gostaria em troca? (opcional)"
            placeholder="Ex: Console de videogame, celular..."
            value={formData.trade_for}
            onChange={(e) => setFormData({ ...formData, trade_for: e.target.value })}
            icon={<Package className="w-5 h-5" />}
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <Button onClick={handleSubmit} loading={saving} className="w-full" size="lg">
            <Save className="w-5 h-5 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Excluir item"
        message={`Tem certeza que deseja excluir "${formData.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
