"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useToast } from "@/components/ui/Toast";
import { likeService } from "@/services/likes";
import { Item, Like } from "@/types";
import { getImageUrl } from "@/lib/api";
import { Avatar } from "@/components/ui/Avatar";

const PLACEHOLDER_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoGSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCABoAGgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWm5ybnJ2eoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlbaWmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q==";

// Condition styling
const conditionStyles: Record<string, { bg: string; text: string }> = {
  novo: { bg: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)", text: "#047857" },
  seminovo: { bg: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", text: "#1d4ed8" },
  usado: { bg: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", text: "#b45309" },
  desgastado: { bg: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)", text: "#b91c1c" },
};

const conditionLabels: Record<string, string> = {
  novo: "Novo",
  seminovo: "Seminovo",
  usado: "Usado",
  desgastado: "Desgastado",
};

type TabType = "sent" | "received";

interface LikeWithDetails extends Like {
  item?: Item;
  user?: any;
  matched?: boolean;
}

export default function LikesPage() {
  const router = useRouter();
  const { error } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>("sent");
  const [sentLikes, setSentLikes] = useState<LikeWithDetails[]>([]);
  const [receivedLikes, setReceivedLikes] = useState<LikeWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllLikes = async () => {
      setLoading(true);
      try {
        const [sentResponse, receivedResponse] = await Promise.all([
          likeService.getMyLikes(),
          likeService.getLikesOnMyItems(),
        ]);
        
        setSentLikes(sentResponse.data || []);
        setReceivedLikes(receivedResponse.data || []);
      } catch (err) {
        console.error("Error fetching likes:", err);
        error("Erro ao carregar curtidas");
      } finally {
        setLoading(false);
      }
    };

    fetchAllLikes();
  }, [error]);

  const getPhotoUrl = (item?: Item) => {
    if (!item) return "/placeholder-item.jpg";
    const photo = item.photos?.find((p) => p.is_primary) || item.photos?.[0];
    return getImageUrl(photo?.url);
  };

  const currentLikes = activeTab === "sent" ? sentLikes : receivedLikes;
  const sentCount = sentLikes.length;
  const receivedCount = receivedLikes.length;

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fafafa]">
        <Header showLogo showNotifications showBack />
        
        {/* Filter Chips Skeleton */}
        <div className="w-full bg-[#fafafa] py-4">
          <div className="w-full max-w-[640px] lg:max-w-[720px] xl:max-w-[800px] mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        <div className="w-full max-w-[640px] lg:max-w-[720px] xl:max-w-[800px] mx-auto px-4 sm:px-6 py-6">
          {/* Card grid skeleton */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                <div className="aspect-square bg-gray-200 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      <Header showLogo showNotifications showBack />

      {/* Centered Container for Desktop (uses Feed's centered container) */}
      <main className="modern-feed-container">
        {/* Filter Chips - same structure as Feed */}
        <motion.div
          className="modern-filter-section centered"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="modern-filter-chips">
            <motion.button
              onClick={() => setActiveTab("sent")}
              className={`modern-chip ${activeTab === "sent" ? "active" : ""}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Heart className={`w-4 h-4 ${activeTab === "sent" ? "fill-white" : ""}`} />
              <span>Meus Likes</span>
              {sentCount > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === "sent" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                }`}>
                  {sentCount}
                </span>
              )}
            </motion.button>

            <motion.button
              onClick={() => setActiveTab("received")}
              className={`modern-chip ${activeTab === "received" ? "active" : ""}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Recebidos</span>
              {receivedCount > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === "received" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                }`}>
                  {receivedCount}
                </span>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="w-full">
          <div className="max-w-[640px] lg:max-w-[720px] xl:max-w-[800px] mx-auto px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentLikes.length === 0 ? (
              <EmptyState type={activeTab} />
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {currentLikes.map((like, index) => {
                  const item = like.item as any;
                  const itemOwner = item?.owner || item?.user;
                  const displayUser = activeTab === "received" ? like.user : itemOwner;
                  
                  return (
                    <LikeCard
                      key={like.id || index}
                      item={item}
                      displayUser={displayUser}
                      type={activeTab}
                      index={index}
                      matched={like.matched}
                      onCardClick={() => {
                        if (item?.id) {
                          router.push(`/items/${item.id}`);
                        }
                      }}
                      onUserClick={() => {
                        const userId = displayUser?.id;
                        if (userId) {
                          router.push(`/profile/${userId}`);
                        }
                      }}
                      getPhotoUrl={getPhotoUrl}
                    />
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

// Empty State Component
function EmptyState({ type }: { type: TabType }) {
  const isReceived = type === "received";
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5">
        {isReceived ? (
          <Sparkles className="w-10 h-10 text-gray-400" />
        ) : (
          <Heart className="w-10 h-10 text-gray-400" />
        )}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        {isReceived ? "Nenhuma curtida recebida" : "Nenhum item curtido"}
      </h3>
      <p className="text-sm text-gray-500 max-w-[280px]">
        {isReceived
          ? "Quando alguém curtir seus itens, você verá aqui."
          : "Explore o feed e curta itens que você gostaria de trocar."}
      </p>
    </div>
  );
}

// Like Card Component - Grid Style
interface LikeCardProps {
  item: any;
  displayUser: any;
  type: TabType;
  index: number;
  matched?: boolean;
  onCardClick: () => void;
  onUserClick: () => void;
  getPhotoUrl: (item?: Item) => string;
}

function LikeCard({ item, displayUser, type, index, matched, onCardClick, onUserClick, getPhotoUrl }: LikeCardProps) {
  const condition = conditionStyles[item?.condition as keyof typeof conditionStyles] || conditionStyles.usado;
  const conditionLabel = conditionLabels[item?.condition || "usado"] || "Usado";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      onClick={onCardClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200 cursor-pointer group"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={getPhotoUrl(item)}
          alt={item?.title || "Item"}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          placeholder="blur"
          blurDataURL={PLACEHOLDER_BLUR}
        />
        
        {/* Condition badge */}
        <div
          className="absolute top-2 left-2 px-2 py-1 rounded-lg text-[10px] sm:text-xs font-semibold backdrop-blur-sm"
          style={{ background: condition.bg, color: condition.text }}
        >
          {conditionLabel}
        </div>

        {/* Heart indicator */}
        <div className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
          <Heart className="w-4 h-4 text-[#34c759] fill-[#34c759]" />
        </div>

        {/* Match badge */}
        {type === "received" && matched && (
          <div className="absolute bottom-2 left-2 right-2 bg-[#34c759] text-white px-2 py-1.5 rounded-lg flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">Match!</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm truncate mb-2">
          {item?.title || "Item não encontrado"}
        </h3>
        
        {/* User info */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onUserClick();
          }}
          className="flex items-center gap-2 group/user"
        >
          <Avatar
            src={displayUser?.avatar_url}
            alt={displayUser?.name || "Usuário"}
            size="xs"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 leading-tight">
              {type === "received" ? "Curtido por" : "De"}
            </p>
            <p className="text-xs font-medium text-gray-700 truncate group-hover/user:text-[#34c759] transition-colors">
              {displayUser?.name || "Usuário"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
