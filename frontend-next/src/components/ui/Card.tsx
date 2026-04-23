"use client";

import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({ 
  children, 
  className, 
  hover = false, 
  onClick,
  padding = "none"
}: CardProps) {
  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div
      className={cn(
        "bg-white rounded-2xl",
        "shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.03)]",
        "border border-gray-100/80",
        "transition-all duration-300 ease-out",
        hover && "cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5",
        onClick && "cursor-pointer",
        paddings[padding],
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ 
  children, 
  className,
  noBorder = false
}: { 
  children: React.ReactNode; 
  className?: string;
  noBorder?: boolean;
}) {
  return (
    <div className={cn(
      "px-5 py-4",
      !noBorder && "border-b border-gray-100",
      className
    )}>
      {children}
    </div>
  );
}

export function CardContent({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string 
}) {
  return <div className={cn("p-5", className)}>{children}</div>;
}

export function CardFooter({ 
  children, 
  className,
  noBorder = false
}: { 
  children: React.ReactNode; 
  className?: string;
  noBorder?: boolean;
}) {
  return (
    <div className={cn(
      "px-5 py-4",
      !noBorder && "border-t border-gray-100",
      className
    )}>
      {children}
    </div>
  );
}
