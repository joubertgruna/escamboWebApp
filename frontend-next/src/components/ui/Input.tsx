
"use client";

import { forwardRef, InputHTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helper?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helper, icon, type = "text", ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label 
            className={cn(
              "block text-sm font-medium transition-colors duration-200",
              isFocused ? "text-escambo-primary" : "text-gray-700",
              error && "text-escambo-danger"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative w-full">
          {icon && (
            <div 
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 flex-shrink-0 pointer-events-none",
                isFocused ? "text-escambo-primary" : "text-gray-400"
              )}
            >
              {icon}
            </div> 
          )}
          <input
            ref={ref}
            type={type}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={cn(
              "w-full h-11 sm:h-12 px-4 py-2.5 rounded-xl",
              "bg-white border border-gray-200",
              "text-[15px] sm:text-base text-gray-900",
              "placeholder:text-gray-400",
              "transition-all duration-200 ease-out",
              "focus:outline-none focus:border-escambo-primary focus:ring-2 focus:ring-escambo-primary/10",
              "hover:border-gray-300",
              "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:border-gray-200",
              icon && "pl-10",
              error && "border-escambo-danger focus:border-escambo-danger focus:ring-escambo-danger/10",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-escambo-danger flex items-center gap-1 mt-1">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {helper && !error && (
          <p className="text-xs text-gray-500 mt-1">{helper}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
