"use client";

import { ReactNode } from "react";
import { BottomNav } from "@/components/layout/BottomNav";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-escambo-light pb-20">
      {children}
      <BottomNav />
    </div>
  );
}
