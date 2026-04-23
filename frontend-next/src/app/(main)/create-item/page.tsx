"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Camera,
  X,
  Plus,
  Tag,
  FileText,
  Package,
  ArrowLeft,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { itemService } from "@/services/items";

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

export default function CreateItemPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    trade_for: "",
  });

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 5) {
      error("Máximo de 5 fotos");
      return;
    }

    const newPhotos = [...photos, ...files];
    setPhotos(newPhotos);

    // Create previews
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

    setLoading(true);

    try {
      // Create FormData
      const createFormData = new FormData();
      createFormData.append("title", formData.title);
      createFormData.append("description", formData.description);
      createFormData.append("category", formData.category);
      createFormData.append("condition", formData.condition);
      createFormData.append("trade_for", formData.trade_for);

      // Create item
      const response = await itemService.create(createFormData);

      const item = response.data;

      // Upload photos
      for (let i = 0; i < photos.length; i++) {
        await itemService.addPhoto(item.id, photos[i]);
      }

      success("Item cadastrado com sucesso!");
      router.push("/my-items");
    } catch (err: any) {
      console.error("Error creating item:", err);
      error(err.response?.data?.message || "Erro ao criar item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-escambo-light">
      <Header
        title="Novo Item"
        showBack
      />

      {/* Progress */}
      <div className="px-3 sm:px-4 py-1.5 sm:py-2">
        <div className="flex gap-1.5 sm:gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 sm:h-1.5 flex-1 rounded-full transition-all ${
                s <= step ? "bg-escambo-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 px-3 py-4 sm:p-4">
        {/* Step 1: Photos */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-lg sm:text-xl font-bold text-escambo-dark mb-1.5 sm:mb-2">
              Fotos do item
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
              Adicione até 5 fotos do seu item. A primeira será a foto principal.
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
              {photoPreview.map((preview, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden group"
                >
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                  {index === 0 && (
                    <div className="absolute top-1 left-1 sm:top-2 sm:left-2 px-1.5 sm:px-2 py-0.5 bg-escambo-primary text-white text-[10px] sm:text-xs rounded-full">
                      Principal
                    </div>
                  )}
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-7 sm:h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              ))}

              {photos.length < 5 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg sm:rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5 sm:gap-2 text-gray-400 hover:border-escambo-primary hover:text-escambo-primary transition-colors"
                >
                  <Camera className="w-6 h-6 sm:w-8 sm:h-8" />
                  <span className="text-[10px] sm:text-xs">Adicionar</span>
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

            <Button
              onClick={() => setStep(2)}
              disabled={photos.length === 0}
              className="w-full"
              size="lg"
            >
              Continuar
            </Button>
          </motion.div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-lg sm:text-xl font-bold text-escambo-dark mb-1.5 sm:mb-2">
              Detalhes do item
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
              Informe os detalhes do item que você quer trocar.
            </p>

            <div className="space-y-3 sm:space-y-4">
              <Input
                label="Título"
                placeholder="Ex: iPhone 12 Pro Max"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                icon={<Tag className="w-4 h-4" />}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Descrição
                </label>
                <textarea
                  placeholder="Descreva seu item em detalhes..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 text-[15px] sm:text-base focus:border-escambo-primary focus:ring-2 focus:ring-escambo-primary/20 outline-none resize-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Categoria
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.value })}
                      className={`px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-lg border text-xs sm:text-sm font-medium transition-all ${
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
            </div>

            <div className="flex gap-2.5 sm:gap-3 mt-5 sm:mt-6">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1" size="lg">
                Voltar
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!formData.title || !formData.category}
                className="flex-1"
                size="lg"
              >
                Continuar
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Condition & Preferences */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-lg sm:text-xl font-bold text-escambo-dark mb-1.5 sm:mb-2">
              Condição e preferências
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
              Informe a condição do item e o que você gostaria em troca.
            </p>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Condição do item
                </label>
                <div className="space-y-1.5 sm:space-y-2">
                  {conditions.map((cond) => (
                    <button
                      key={cond.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, condition: cond.value })}
                      className={`w-full flex items-start gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border text-left transition-all ${
                        formData.condition === cond.value
                          ? "border-escambo-primary bg-escambo-primary/10"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          formData.condition === cond.value
                            ? "border-escambo-primary"
                            : "border-gray-300"
                        }`}
                      >
                        {formData.condition === cond.value && (
                          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-escambo-primary" />
                        )}
                      </div>
                      <div>
                        <p
                          className={`text-sm sm:text-base font-medium ${
                            formData.condition === cond.value
                              ? "text-escambo-primary"
                              : "text-gray-700"
                          }`}
                        >
                          {cond.label}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">{cond.description}</p>
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
                icon={<Package className="w-4 h-4" />}
              />
            </div>

            <div className="flex gap-2.5 sm:gap-3 mt-5 sm:mt-6">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1" size="lg">
                Voltar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.condition}
                loading={loading}
                className="flex-1"
                size="lg"
              >
                Publicar Item
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
