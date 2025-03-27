"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FloatingInputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export const FloatingInputField = React.forwardRef<
  HTMLInputElement,
  FloatingInputFieldProps
>(({ label, className, value, id, icon, ...props }, ref) => {
  const hasValue = typeof value === "string" && value.length > 0;

  const inputId = id || React.useId(); // fallback if id not provided

  return (
    <div className="relative w-full">
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
          {icon}
        </div>
      )}

      <Input
        id={inputId}
        ref={ref}
        value={value}
        placeholder=" "
        className={cn(
          "peer h-12 w-full text-base placeholder-transparent",
          icon && "pl-10",
          className
        )}
        {...props}
      />
      <label
        htmlFor={inputId}
        className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-all duration-200",
          icon && "left-10",
          "peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base",
          "peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600",
          hasValue && "!-top-2.5 !text-sm !text-blue-600"
        )}
      >
        {label}
      </label>
    </div>
  );
});

FloatingInputField.displayName = "FloatingInputField";
