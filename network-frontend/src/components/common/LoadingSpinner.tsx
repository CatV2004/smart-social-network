import React from "react";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingSpinner({
  fullScreen = false,
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={`${className} flex justify-center items-center  ${
        fullScreen ? "fixed inset-0 bg-white bg-opacity-80 z-50" : ""
      }`}
      role="status"
      aria-label="Loading"
    >
      <div
        className={`rounded-full animate-spin-slow border-t-transparent border-blue-600 shadow-lg ${sizeMap[size]}`}
      />
    </div>
  );
}
