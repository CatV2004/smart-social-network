"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "ghost"
    | "link"
    | "primary"
    | "secondary"
    | "disabled";
  size?: "sm" | "md" | "lg" | "icon";
}

// Variant styles
const buttonVariants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-teal-500 hover:bg-teal-600 text-white",
  destructive: "bg-red-500 hover:bg-red-600 text-white",
  outline: "border border-gray-300 text-gray-200 hover:bg-gray-800",
  ghost: "bg-transparent hover:bg-gray-800 text-gray-200",
  link: "text-teal-400 underline-offset-4 hover:underline",
  primary: "bg-teal-500 text-white hover:bg-teal-600",
  secondary: "bg-cyan-500 text-white hover:bg-cyan-600",
  disabled: "bg-gray-700 text-gray-400 cursor-not-allowed",
};

// Size styles
const sizeVariants: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-1 text-sm rounded-md",
  md: "px-4 py-2 text-base rounded-lg",
  lg: "px-5 py-3 text-lg rounded-xl",
  icon: "p-2 rounded-full",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "md", asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:pointer-events-none",
          buttonVariants[variant],
          sizeVariants[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
