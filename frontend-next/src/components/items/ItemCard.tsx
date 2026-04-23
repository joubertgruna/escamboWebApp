"use client";

import Image from "next/image";
import { Item } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Heart, MessageCircle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { getImageUrl } from "@/lib/api";

const PLACEHOLDER_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoGSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCABoAGgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWm5ybnJ2eoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlbaWmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q==";

interface ItemCardProps {
  item: Item;
  onLike?: () => void;
  onDislike?: () => void;
  onClick?: () => void;
  showActions?: boolean;
  liked?: boolean;
  className?: string;
}

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

export function ItemCard({
  item,
  onLike,
  onDislike,
  onClick,
  showActions = true,
  liked = false,
  className,
}: ItemCardProps) {
  const primaryPhoto = item.photos?.find((p) => p.is_primary) || item.photos?.[0];
  const photoUrl = getImageUrl(primaryPhoto?.url);

  // Debug helper: log photoUrl in development to help troubleshoot loading issues
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug('[ItemCard] photoUrl ->', photoUrl, 'itemId:', item.id);
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Card hover onClick={onClick} className="overflow-hidden">
        {/* Image */}
        <div className="relative aspect-square">
          {/* Use plain <img> to avoid Next.js image optimization/proxy issues in some dev setups */}
          <img
            src={photoUrl}
            alt={item.title}
            className="w-full h-full object-cover"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant={conditionVariants[item.condition] || "default"}>
              {conditionLabels[item.condition] || item.condition}
            </Badge>
          </div>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold text-white truncate">{item.title}</h3>
            {item.user?.city && (
              <p className="flex items-center gap-1 text-sm text-white/80 mt-1">
                <MapPin className="w-3 h-3" />
                {item.user.city}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-center gap-4 p-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDislike?.();
              }}
              className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-gray-200 text-gray-400 hover:border-escambo-danger hover:text-escambo-danger hover:bg-escambo-danger/5 transition-all"
            >
              <span className="text-2xl">✕</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLike?.();
              }}
              className={cn(
                "w-16 h-16 flex items-center justify-center rounded-full transition-all shadow-lg",
                liked
                  ? "bg-escambo-primary text-white shadow-escambo-primary/30"
                  : "bg-gradient-to-r from-escambo-primary to-escambo-secondary text-white shadow-escambo-primary/30 hover:shadow-xl hover:shadow-escambo-primary/40"
              )}
            >
              <Heart className={cn("w-7 h-7", liked && "fill-current")} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
              className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-gray-200 text-gray-400 hover:border-escambo-info hover:text-escambo-info hover:bg-escambo-info/5 transition-all"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
