"use client";

import Image from "next/image";
import { Item } from "@/types";
import { Heart, MessageCircle, Share2, Repeat2, MapPin, Sparkles, Clock, Eye } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getImageUrl } from "@/lib/api";

const PLACEHOLDER_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoGSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCABoAGgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWm5ybnJ2eoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlbaWmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q==";

// Primary green color
const PRIMARY_GREEN = "#34c759";

interface FeedCardProps {
  item: Item;
  onLike?: () => void;
  onTradeClick?: () => void;
  onUserClick?: () => void;
  onCardClick?: () => void;
  isLiked?: boolean;
}

export const FeedCard: React.FC<FeedCardProps> = ({
  item,
  onLike,
  onTradeClick,
  onUserClick,
  onCardClick,
  isLiked = false,
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);

  const currentPhoto = item.photos?.[currentPhotoIndex];
  const photoUrl = getImageUrl(currentPhoto?.url);

  const handlePhotoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isRightHalf = clickX > rect.width / 2;

    if (isRightHalf && currentPhotoIndex < (item.photos?.length || 1) - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    } else if (!isRightHalf && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLiked) {
      setShowLikeAnimation(true);
      onLike?.();
      setTimeout(() => setShowLikeAnimation(false), 800);
    }
  };

  // Condition styles - more modern with subtle gradients
  const conditionStyles = {
    novo: { bg: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)", text: "#047857", border: "#6ee7b7" },
    seminovo: { bg: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", text: "#1d4ed8", border: "#93c5fd" },
    usado: { bg: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)", text: "#b45309", border: "#fcd34d" },
    desgastado: { bg: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)", text: "#b91c1c", border: "#fca5a5" },
  };

  const condition = conditionStyles[item.condition as keyof typeof conditionStyles] || conditionStyles.usado;

  // Format time ago
  const getTimeAgo = () => {
    if (!item.created_at) return "Agora";
    const now = new Date();
    const created = new Date(item.created_at);
    const diffMs = now.getTime() - created.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}d`;
    if (diffHours > 0) return `${diffHours}h`;
    return "Agora";
  };

  return (
    <motion.div
      className="modern-feed-card"
      onClick={onCardClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {/* Header - User Info */}
      <div className="modern-card-header">
        <div
          className="modern-card-user"
          onClick={(e) => {
            e.stopPropagation();
            onUserClick?.();
          }}
        >
          <div className="modern-avatar-wrapper">
            <Avatar
              src={item.user?.avatar_url}
              alt={item.user?.name || "User"}
              className="w-11 h-11"
            />
            <div className="modern-avatar-ring" />
          </div>
          <div className="modern-user-info">
            <p className="modern-user-name">
              {item.user?.name || "Usuário"}
            </p>
            <div className="modern-user-meta">
              {item.user?.city && (
                <span className="modern-location">
                  <MapPin className="w-3 h-3" />
                  {item.user.city}
                </span>
              )}
              <span className="modern-time">
                <Clock className="w-3 h-3" />
                {getTimeAgo()}
              </span>
            </div>
          </div>
        </div>

        {/* Condition Badge - Modern Pill */}
        <motion.div
          className="modern-condition-badge"
          style={{
            background: condition.bg,
            color: condition.text,
            borderColor: condition.border,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles className="w-3 h-3" />
          {item.condition === "novo"
            ? "Novo"
            : item.condition === "seminovo"
              ? "Seminovo"
              : item.condition === "usado"
                ? "Usado"
                : "Desgastado"}
        </motion.div>
      </div>

      {/* Photo Section - Modern with Rounded Corners */}
      <div
        className="modern-photo-container"
        onClick={handlePhotoClick}
      >
        <Image
          src={photoUrl}
          alt={item.title}
          fill
          className="modern-photo"
          placeholder="blur"
          blurDataURL={PLACEHOLDER_BLUR}
          priority={currentPhotoIndex === 0}
          onDoubleClick={handleDoubleTap}
        />

        {/* Gradient Overlay */}
        <div className="modern-photo-gradient" />

        {/* Like Animation - Heart Burst */}
        <AnimatePresence>
          {showLikeAnimation && (
            <motion.div
              className="modern-like-burst"
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Heart className="w-24 h-24 text-white fill-white drop-shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Photo Indicators - Modern Pills */}
        {item.photos && item.photos.length > 1 && (
          <div className="modern-photo-indicators">
            {item.photos.map((_, i) => (
              <motion.div
                key={i}
                className="modern-indicator"
                animate={{
                  width: i === currentPhotoIndex ? 24 : 8,
                  opacity: i === currentPhotoIndex ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        )}

        {/* Photo Counter Badge */}
        {item.photos && item.photos.length > 1 && (
          <div className="modern-photo-counter">
            <Eye className="w-3 h-3" />
            {currentPhotoIndex + 1}/{item.photos.length}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="modern-card-content">
        {/* Title */}
        <h3 className="modern-card-title">
          {item.title}
        </h3>

        {/* Description */}
        {item.description && (
          <p className="modern-card-description">
            {item.description}
          </p>
        )}

        {/* Category Tag - Modern Chip */}
        <div className="modern-tags">
          <span className="modern-category-tag">
            {item.category}
          </span>
        </div>

        {/* Trade For Info - Modern Card */}
        {item.trade_for && (
          <motion.div 
            className="modern-trade-for"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="modern-trade-icon">
              <Repeat2 className="w-4 h-4" />
            </div>
            <div className="modern-trade-content">
              <span className="modern-trade-label">Aceita trocar por</span>
              <span className="modern-trade-text">{item.trade_for}</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Actions - Modern Footer */}
      <div className="modern-card-footer">
        <div className="modern-actions-left">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onLike?.();
            }}
            className={`modern-action-btn ${isLiked ? "liked" : ""}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart
              className="w-5 h-5"
              fill={isLiked ? "currentColor" : "none"}
            />
          </motion.button>

          <motion.button
            onClick={(e) => e.stopPropagation()}
            className="modern-action-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MessageCircle className="w-5 h-5" />
          </motion.button>

          <motion.button
            onClick={(e) => e.stopPropagation()}
            className="modern-action-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Trade Button - Primary CTA */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onTradeClick?.();
          }}
          className="modern-trade-btn"
          whileHover={{ scale: 1.02, boxShadow: `0 12px 28px -8px rgba(52, 199, 89, 0.5)` }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="modern-trade-btn-bg" />
          <Repeat2 className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Propor Troca</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
