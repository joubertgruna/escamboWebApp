"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-semibold
      transition-all duration-200 ease-out
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      disabled:pointer-events-none disabled:opacity-50
      active:scale-[0.98]
    `;

    const variants = {
      primary: `
        bg-escambo-primary text-white
        hover:bg-[#30b350]
        focus-visible:ring-escambo-primary
        shadow-sm hover:shadow-md
        rounded-xl
      `,
      secondary: `
        bg-white text-foreground
        border border-gray-200
        hover:bg-gray-50
        focus-visible:ring-escambo-primary
        rounded-xl
      `,
      outline: `
        bg-transparent text-escambo-primary
        border-2 border-escambo-primary
        hover:bg-escambo-primary hover:text-white
        focus-visible:ring-escambo-primary
        rounded-xl
      `,
      ghost: `
        bg-transparent text-gray-600
        hover:bg-gray-100 hover:text-gray-900
        focus-visible:ring-gray-400
        rounded-xl
      `,
      danger: `
        bg-escambo-danger text-white
        hover:bg-[#e5342b]
        focus-visible:ring-escambo-danger
        shadow-sm hover:shadow-md
        rounded-xl
      `,
    };

    const sizes = {
      sm: "h-9 px-3.5 text-sm",
      md: "h-10 sm:h-11 px-4 sm:px-5 text-sm sm:text-base",
      lg: "h-11 sm:h-12 px-5 sm:px-6 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Carregando...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
