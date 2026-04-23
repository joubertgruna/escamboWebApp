"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Eye, MoreVertical, Package } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/Modal";
import { Spinner, ItemCardSkeleton } from "@/components/ui/Loading";
import { useToast } from "@/components/ui/Toast";
import { itemService } from "@/services/items";
import { Item } from "@/types";
import { getImageUrl } from "@/lib/api";

const PLACEHOLDER_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoGSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCABoAGgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWm5ybnJ2eoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlbaWmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q==";

const conditionLabels: Record<string, string> = {
  novo: "Novo",
  seminovo: "Seminovo",
  usado: "Usado",
  desgastado: "Desgastado",
};

const conditionVariants: Record<string, "success" | "info" | "warning" | "danger"> = {
  novo: "success",
  seminovo: "info",
  usado: "warning",
  desgastado: "danger",
};

export default function MyItemsPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteItem, setDeleteItem] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await itemService.getMyItems();
        setItems(response.data || []);
      } catch (err) {
        console.error("Error fetching items:", err);
        error("Erro ao carregar seus itens");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [error]);

  const handleDelete = async () => {
    if (!deleteItem) return;

    setDeleting(true);

    try {
      await itemService.delete(deleteItem.id);
      setItems((prev) => prev.filter((i) => i.id !== deleteItem.id));
      success("Item excluído com sucesso!");
      setDeleteItem(null);
    } catch (err) {
      console.error("Error deleting item:", err);
      error("Erro ao excluir item");
    } finally {
      setDeleting(false);
    }
  };

  const getPhotoUrl = (item: Item) => {
    const photo = item.photos?.find((p) => p.is_primary) || item.photos?.[0];
    return getImageUrl(photo?.url);
  };

  // Debug: log photo urls in dev to help troubleshooting
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug('[MyItems] items photo urls:', items.map((it) => ({ id: it.id, photo: it.photos?.[0]?.url || null })));
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header showLogo showNotifications showBack />
        <div className="flex-1 p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 bg-white rounded-xl p-3">
              <div className="w-24 h-24 bg-gray-200 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-escambo-light">
      <Header
        showLogo
        showNotifications
        showBack
        rightContent={
          <Button
            size="sm"
            onClick={() => router.push("/create-item")}
            className="flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Novo
          </Button>
        }
      />

      <div className="flex-1 px-3 py-4 sm:px-4 sm:py-5">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-10 sm:py-12 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
              <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-escambo-dark mb-1.5 sm:mb-2">
              Nenhum item cadastrado
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
              Cadastre seu primeiro item para começar a trocar!
            </p>
            <Button onClick={() => router.push("/create-item")}>
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              Cadastrar Item
            </Button>
          </div>
        ) : (
          <div className="space-y-2.5 sm:space-y-3">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-sm relative"
              >
                <div className="flex gap-2.5 sm:gap-3">
                  {/* Image */}
                  <div
                    onClick={() => router.push(`/items/${item.id}`)}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg sm:rounded-xl overflow-hidden cursor-pointer flex-shrink-0 relative"
                  >
                    {/* Use plain <img> to avoid Next.js image optimization/proxy issues in some dev setups */}
                    <img
                      src={getPhotoUrl(item)}
                      alt={item.title}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div
                        onClick={() => router.push(`/items/${item.id}`)}
                        className="cursor-pointer flex-1"
                      >
                        <h3 className="text-sm sm:text-base font-semibold text-escambo-dark truncate">
                          {item.title}
                        </h3>
                        <Badge
                          variant={conditionVariants[item.condition] || "default"}
                          className="mt-0.5 sm:mt-1"
                        >
                          {conditionLabels[item.condition] || item.condition}
                        </Badge>
                      </div>

                      {/* Menu button */}
                      <button
                        onClick={() => setMenuOpen(menuOpen === item.id ? null : item.id)}
                        className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100"
                      >
                        <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1.5 sm:gap-2 mt-2.5 sm:mt-3">
                      <button
                        onClick={() => router.push(`/items/${item.id}`)}
                        className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs sm:text-sm hover:bg-gray-200 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Ver
                      </button>
                      <button
                        onClick={() => router.push(`/edit-item/${item.id}`)}
                        className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-escambo-primary/10 text-escambo-primary text-xs sm:text-sm hover:bg-escambo-primary/20 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => setDeleteItem(item)}
                        className="flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-red-50 text-escambo-danger text-xs sm:text-sm hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Dropdown menu */}
                {menuOpen === item.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-10 sm:top-12 right-2.5 sm:right-3 bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-100 py-0.5 sm:py-1 z-10"
                  >
                    <button
                      onClick={() => {
                        setMenuOpen(null);
                        router.push(`/edit-item/${item.id}`);
                      }}
                      className="w-full flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(null);
                        setDeleteItem(item);
                      }}
                      className="w-full flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-escambo-danger hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Excluir
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={handleDelete}
        title="Excluir item"
        message={`Tem certeza que deseja excluir "${deleteItem?.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
