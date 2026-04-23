"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FeedCard } from "@/components/feed/FeedCard";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Loading";
import { useToast } from "@/components/ui/Toast";
import { useAuthStore } from "@/store/auth";
import { itemService } from "@/services/items";
import { likeService } from "@/services/likes";
import { Item } from "@/types";

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error } = useToast();
  const { user } = useAuthStore();

  const itemId = Number(params.id);
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await itemService.getById(itemId);
        setItem(response.data);
      } catch (err) {
        error("Erro ao carregar item");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId, error]);

  const handleLike = async () => {
    if (!item || liking || liked) return;
    setLiking(true);
    try {
      const result = await likeService.like(item.id);
      setLiked(true);
      if (result.data?.matched) {
        success("🎉 Match! Vocês têm interesse mútuo!", "Novo Match!");
      } else {
        success("Item curtido!");
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        setLiked(true);
      } else {
        error(err.response?.data?.message || "Erro ao curtir item");
      }
    } finally {
      setLiking(false);
    }
  };

  const handleProposeTrade = async () => {
    if (!item) return;
    if (liked) {
      router.push('/matches');
      return;
    }
    if (liking) return;
    setLiking(true);
    try {
      const result = await likeService.like(item.id);
      setLiked(true);
      if (result.data?.matched && result.data?.match_id) {
        success("🎉 Match! Iniciando conversa...", "Novo Match!");
        setTimeout(() => {
          router.push(`/chat/${result.data.match_id}`);
        }, 1000);
      } else if (result.data?.matched) {
        success("🎉 Match! Vá para Matches para conversar!", "Novo Match!");
        setTimeout(() => {
          router.push('/matches');
        }, 1500);
      } else {
        success("Interesse registrado! Aguarde o outro usuário curtir seu item para iniciar uma conversa.");
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        setLiked(true);
        router.push('/matches');
      } else {
        error(err.response?.data?.message || "Erro ao propor troca");
      }
    } finally {
      setLiking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fafafa] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fafafa] items-center justify-center p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Item não encontrado</h2>
        <Button onClick={() => router.back()}>Voltar</Button>
      </div>
    );
  }

  const isOwner = user?.id === item?.user_id;

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      <div className="flex-1 flex flex-col items-center justify-start py-4">
        <div className="w-full max-w-[600px] px-4">
          <FeedCard
            item={item}
            isLiked={liked}
            onLike={handleLike}
            onTradeClick={liked ? () => router.push('/matches') : handleProposeTrade}
            onUserClick={() => router.push(`/profile/${item.user_id}`)}
          />
        </div>
      </div>
      {isOwner && (
        <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 px-4 py-4 sm:px-6 sm:py-5 safe-bottom z-20">
          <Button
            onClick={() => router.push(`/edit-item/${item.id}`)}
            className="w-full py-4 text-lg font-bold"
            size="lg"
          >
            Editar Item
          </Button>
        </div>
      )}
    </div>
  );
}
