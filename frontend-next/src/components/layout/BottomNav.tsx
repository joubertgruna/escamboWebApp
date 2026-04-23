"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Home, Heart, Plus, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/feed", icon: Home, label: "Feed" },
  { href: "/likes", icon: Heart, label: "Curtidas" },
  { href: "/items/new", icon: Plus, label: "Novo", isMain: true },
  { href: "/matches", icon: MessageCircle, label: "Matches" },
  { href: "/profile", icon: User, label: "Perfil" },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Check if we're on chat pages
  const isChatPage = typeof pathname === 'string' && pathname.startsWith('/chat');

  useEffect(() => {
    // Don't add scroll listener on chat pages
    if (isChatPage) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      
      // Clear any existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Hide when scrolling down, show when scrolling up
      if (scrollDelta > 10 && currentScrollY > 100) {
        setIsVisible(false);
      } else if (scrollDelta < -10) {
        setIsVisible(true);
      }

      // Auto-show after user stops scrolling
      scrollTimeout.current = setTimeout(() => {
        setIsVisible(true);
      }, 1500);

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [lastScrollY, isChatPage]);

  // Hide bottom nav on chat pages to avoid overlapping the message input
  if (isChatPage) {
    return null;
  }

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "flex justify-center",
      "bg-white/95 backdrop-blur-lg",
      "border-t border-gray-100",
      "px-2 pb-[env(safe-area-inset-bottom)]",
      "transition-transform duration-300 ease-out",
      isVisible ? "translate-y-0" : "translate-y-full"
    )}>
      <div className="w-full max-w-[640px] lg:max-w-[720px] xl:max-w-[800px]">
        <div className="flex items-center justify-around h-14">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            if (item.isMain) {
              return (
                <button
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  className={cn(
                    "relative -mt-3 flex items-center justify-center",
                    "w-11 h-11 rounded-xl",
                    "bg-escambo-primary text-white",
                    "shadow-md shadow-escambo-primary/25",
                    "hover:bg-[#30b350] hover:shadow-lg",
                    "active:scale-95",
                    "transition-all duration-200"
                  )}
                >
                  <Icon className="w-5 h-5" strokeWidth={2.5} />
                </button>
              );
            }

            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5",
                  "w-14 py-1.5 rounded-lg",
                  "transition-all duration-200",
                  isActive 
                    ? "text-escambo-primary" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <div className="relative">
                  <Icon 
                    className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} 
                  />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-escambo-primary rounded-full" />
                  )}
                </div>
                <span className={cn(
                  "text-[9px] font-medium leading-tight",
                  isActive && "font-semibold"
                )}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
