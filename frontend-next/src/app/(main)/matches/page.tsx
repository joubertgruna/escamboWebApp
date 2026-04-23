"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MessageCircle, Clock, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Spinner, MatchCardSkeleton } from "@/components/ui/Loading";
import { useToast } from "@/components/ui/Toast";
import { matchService } from "@/services/matches";
import { Match } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function MatchesPage() {
  const router = useRouter();
  const { error } = useToast();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await matchService.getAll();
        setMatches(response.data || []);
      } catch (err) {
        console.error("Error fetching matches:", err);
        error("Erro ao carregar matches");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [error]);

  const getOtherUser = (match: Match) => {
    // Return the other user object
    return match.other_user;
  };

  const getMatchItems = (match: Match) => {
    return {
      myItem: match.my_item,
      theirItem: match.other_item,
    };
  };

  const formatTime = (date: string | Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR });
    } catch {
      return "";
    }
  };

  // Modern loading skeleton
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f5f5f7]">
        <Header showLogo showNotifications showBack />
        <div className="modern-feed-container pb-24">
          <div className="modern-feed-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                    <div className="h-3 bg-gray-200 rounded w-24" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-10 bg-gray-100 rounded-xl" />
                  <div className="h-10 bg-gray-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (matches.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f5f5f7]">
        <Header showLogo showNotifications showBack />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl flex items-center justify-center mb-6 mx-auto">
              <MessageCircle className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Nenhum match ainda</h2>
            <p className="text-sm text-gray-500 max-w-[280px] leading-relaxed">
              Continue curtindo itens para encontrar matches e começar a trocar!
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Modern grid of matches
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f7]">
      <Header showLogo showNotifications showBack />
      
      <div className="modern-feed-container pb-24">
        {/* Matches list */}
        <div className="modern-feed-grid">
          {matches.map((match, index) => {
            const otherUser = getOtherUser(match);
            const { myItem, theirItem } = getMatchItems(match);
            return (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                onClick={() => router.push(`/chat/${match.id}`)}
                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 cursor-pointer group"
              >
                {/* User info */}
                <div className="flex items-center gap-3 mb-4">
                  <Avatar src={otherUser?.avatar_url} size="lg" ring />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-base truncate group-hover:text-blue-600 transition-colors">
                      {otherUser?.name}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      {formatTime(match.created_at)}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
                </div>

                {/* Items info */}
                <div className="space-y-2.5">
                  <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                    <p className="text-[10px] font-semibold text-green-600 uppercase tracking-wide mb-1">
                      Seu item
                    </p>
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {myItem?.title}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                    <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide mb-1">
                      Item do match
                    </p>
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {theirItem?.title}
                    </p>
                  </div>
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/chat/${match.id}`);
                  }}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-[#34c759] to-[#30d158] text-white font-semibold py-3 rounded-xl hover:from-[#30d158] hover:to-[#34c759] transition-all shadow-sm"
                >
                  <MessageCircle className="w-4.5 h-4.5" />
                  <span>Iniciar conversa</span>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
