"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Sparkles, Filter, TrendingUp, Clock, Grid3X3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { FeedCard } from "@/components/feed/FeedCard";
import { Spinner } from "@/components/ui/Loading";
import { useToast } from "@/components/ui/Toast";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { itemService } from "@/services/items";
import { likeService } from "@/services/likes";
import { Item } from "@/types";

const ITEMS_PER_PAGE = 10;

// Filter chips data
const filterChips = [
  { id: "all", label: "Todos", icon: Grid3X3 },
  { id: "recent", label: "Recentes", icon: Clock },
  { id: "trending", label: "Em Alta", icon: TrendingUp },
];

export default function FeedPage() {
  const router = useRouter();
  const { success, error } = useToast();
  
  const [items, setItems] = useState<Item[]>([]);
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch items
  const fetchItems = useCallback(async (pageNum: number) => {
    try {
      setIsLoading(true);
      const response = await itemService.getFeed({
        page: pageNum,
        limit: ITEMS_PER_PAGE,
      });

      if (!response.data || response.data.length === 0) {
        setHasMore(false);
        return;
      }

      setItems((prev) =>
        pageNum === 0 ? response.data : [...prev, ...response.data]
      );

      if (response.data.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching items:", err);
      error("Erro ao carregar itens");
    } finally {
      setIsLoading(false);
      setInitialLoading(false);
    }
  }, [error]);

  // Initial load
  useEffect(() => {
    fetchItems(0);
  }, [fetchItems]);

  // Infinite scroll observer
  const observerTarget = useInfiniteScroll({
    onLoadMore: () => {
      setPage((prev) => prev + 1);
      fetchItems(page + 1);
    },
    hasMore,
    isLoading,
    threshold: 500,
  });

  // Like handler
  const handleLike = async (itemId: number) => {
    try {
      const result = await likeService.like(itemId);
      
      setLikedItems((prev) => new Set([...prev, itemId]));
      
      if (result.data?.matched) {
        success("🎉 Match! Vocês têm interesse mútuo!", "Novo Match!");
      } else {
        success("Item curtido com sucesso!");
      }
    } catch (err) {
      console.error("Error liking item:", err);
      error("Erro ao curtir item");
    }
  };

  // Trade handler
  const handleTrade = (itemId: number) => {
    // Aqui pode-se navegar para criar uma conversa ou ver o item do usuário
    router.push(`/items/${itemId}`);
  };

  // User profile handler
  const handleUserClick = (userId: number) => {
    router.push(`/profile/${userId}`);
  };

  // Card click handler
  const handleCardClick = (itemId: number) => {
    router.push(`/items/${itemId}`);
  };

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setPage(0);
    setHasMore(true);
    setLikedItems(new Set());
    await fetchItems(0);
    setIsRefreshing(false);
  };

  if (initialLoading) {
    return (
      <div className="modern-feed-page">
        <Header showLogo showNotifications />
        <div className="modern-feed-loading">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modern-loading-content"
          >
            <Spinner size="lg" />
            <p>Carregando itens...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-feed-page">
      <Header showLogo showNotifications />

      {/* Subtle Background Pattern */}
      <div className="modern-feed-bg">
        <div className="modern-feed-gradient" />
      </div>

      <main className="modern-feed-container">
        {/* Filter Chips */}
        <motion.div 
          className="modern-filter-section"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="modern-filter-chips">
            {filterChips.map((chip) => (
              <motion.button
                key={chip.id}
                onClick={() => setActiveFilter(chip.id)}
                className={`modern-chip ${activeFilter === chip.id ? "active" : ""}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <chip.icon className="w-4 h-4" />
                <span>{chip.label}</span>
              </motion.button>
            ))}
          </div>
          
          <motion.button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="modern-refresh-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
            transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
          >
            <RefreshCw className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {items.length === 0 ? (
          <motion.div 
            className="modern-empty-state"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="modern-empty-icon">
              <Sparkles className="w-12 h-12" />
            </div>
            <h2>Nenhum item disponível</h2>
            <p>Volte mais tarde para ver novos itens disponíveis para troca.</p>
            <motion.button
              onClick={handleRefresh}
              className="modern-empty-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-5 h-5" />
              <span>Atualizar</span>
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Cards Grid */}
            <motion.div 
              className="modern-feed-grid"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.08,
                  },
                },
              }}
            >
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    variants={{
                      hidden: { opacity: 0, y: 30, scale: 0.95 },
                      visible: { opacity: 1, y: 0, scale: 1 },
                    }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
                  >
                    <FeedCard
                      item={item}
                      isLiked={likedItems.has(item.id)}
                      onLike={() => handleLike(item.id)}
                      onTradeClick={() => handleTrade(item.id)}
                      onUserClick={() => handleUserClick(item.user_id)}
                      onCardClick={() => handleCardClick(item.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Infinite scroll trigger */}
            {hasMore && (
              <div
                ref={observerTarget}
                className="modern-load-more"
              >
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="modern-loading-indicator"
                  >
                    <Spinner size="md" />
                    <span>Carregando mais...</span>
                  </motion.div>
                )}
              </div>
            )}

            {/* End message */}
            {!hasMore && items.length > 0 && (
              <motion.div 
                className="modern-end-message"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <p>Você viu todos os itens disponíveis</p>
                <motion.button
                  onClick={handleRefresh}
                  className="modern-refresh-cta"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Atualizar Feed</span>
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
