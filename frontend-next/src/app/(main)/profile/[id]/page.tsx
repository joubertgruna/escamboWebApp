"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Avatar } from "@/components/ui/Avatar";
import { FeedCard } from "@/components/feed/FeedCard";
import { ItemCard } from "@/components/items/ItemCard";
import { Spinner } from "@/components/ui/Loading";
import { api, getImageUrl } from "@/lib/api";
import { List, LayoutGrid } from "lucide-react";

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [view, setView] = useState<'feed'|'grid'>('feed');

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/users/${userId}`);
        const payload = res.data?.data || res.data;
        const u = payload.user || payload;
        const its = Array.isArray(payload.items) ? payload.items : [];
        setUser(u);
        setItems(its);
      } catch (err) {
        console.error('Error fetching public profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const getAvatarUrl = () => {
    return getImageUrl(user?.avatar_url);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f7]">
      <Header showLogo showNotifications showBack />

      <div className="flex-1 pb-24">
        {/* Centered container - using same class as feed */}
        <div className="modern-feed-container">
          {loading ? (
            <div className="flex-1 py-10">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
                </div>
              </div>
              <div className="mt-6">
                <Spinner />
              </div>
            </div>
          ) : (
            <>
              {/* Profile header - modern card */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl overflow-hidden mb-8"
                style={{ 
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
                }}
              >
                {/* User info section */}
                <div className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="shrink-0">
                      <Avatar src={getAvatarUrl()} size="lg" ring />
                    </div>
                    {user?.bio && (
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600 leading-relaxed">{user.bio}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* View toggle */}
                <div className="px-5 pb-5">
                  <div className="flex items-center bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setView('feed')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        view === 'feed' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <List className="w-4 h-4" />
                      <span>Feed</span>
                    </button>
                    <button
                      onClick={() => setView('grid')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        view === 'grid' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                      <span>Grid</span>
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Items count - Outside card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between px-2 mb-6"
              >
                <span className="text-base font-semibold text-gray-800">Itens publicados</span>
                <span className="text-base font-bold text-[#34c759] bg-green-50 px-3 py-1 rounded-full">{items.length}</span>
              </motion.div>

              {/* Items */}
              {items.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 px-8 bg-white rounded-3xl"
                  style={{ 
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
                  }}
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
                    <span className="text-4xl">📦</span>
                  </div>
                  <p className="text-gray-500 font-medium">Este usuário ainda não publicou itens.</p>
                </motion.div>
              ) : view === 'feed' ? (
                <div className="modern-feed-grid">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <FeedCard
                        item={{
                          ...item,
                          user: user
                        }}
                        onCardClick={() => router.push(`/items/${item.id}`)}
                        onUserClick={() => {}}
                        onTradeClick={() => router.push(`/items/${item.id}`)}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ItemCard
                        item={item}
                        showActions={false}
                        onClick={() => router.push(`/items/${item.id}`)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
