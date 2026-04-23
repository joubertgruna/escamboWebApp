"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showNotifications?: boolean;
  showSettings?: boolean;
  showLogo?: boolean;
  rightContent?: React.ReactNode;
  transparent?: boolean;
  large?: boolean;
  className?: string;
}

export function Header({
  title,
  subtitle,
  showBack = false,
  showNotifications = false,
  showSettings = false,
  showLogo = false,
  rightContent,
  transparent = false,
  large = false,
  className,
}: HeaderProps) {
  const router = useRouter();

  return (
    <header
      className={cn(
        "sticky top-0 z-40",
        "flex justify-center",
        "pt-[env(safe-area-inset-top)]",
        !transparent && "bg-white border-b border-gray-100",
        "shadow-sm",
        className
      )}
    >
      <div className="w-full max-w-[640px] lg:max-w-[720px] xl:max-w-[800px] px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between gap-3">
        {/* Left Side */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {showBack && (
            <button
              onClick={() => router.back()}
              className={cn(
                "flex-shrink-0",
                "w-9 h-9 flex items-center justify-center",
                "rounded-full",
                "text-gray-600 hover:text-gray-900",
                "hover:bg-gray-100",
                "active:scale-95",
                "transition-all duration-200"
              )}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          
          {showLogo && (
            <Logo size="sm" showText={true} textColor="dark" href="/feed" />
          )}
          
          {!showLogo && (title || subtitle) && (
            <div className="min-w-0">
              {title && (
                <h1 className={cn(
                  "font-bold text-gray-900 truncate tracking-tight",
                  large ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
                )}>
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-xs sm:text-sm text-gray-500 truncate mt-0.5">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {showNotifications && (
            <button
              onClick={() => router.push("/notifications")}
              className={cn(
                "relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center",
                "rounded-full",
                "text-gray-600 hover:text-gray-900",
                "hover:bg-gray-100",
                "active:scale-95",
                "transition-all duration-200"
              )}
            >
              <Bell className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
              <span className={cn(
                "absolute top-2 right-2 sm:top-2.5 sm:right-2.5",
                "w-2 h-2 bg-[#34c759] rounded-full",
                "ring-2 ring-white"
              )} />
            </button>
          )}
          {showSettings && (
            <button
              onClick={() => router.push("/settings")}
              className={cn(
                "w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center",
                "rounded-xl",
                "text-gray-500",
                "hover:bg-gray-100 hover:text-gray-700",
                "active:scale-95",
                "transition-all duration-200"
              )}
            >
              <Settings className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
            </button>
          )}
          {rightContent}
        </div>
      </div>
    </header>
  );
}
