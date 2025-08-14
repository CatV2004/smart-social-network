import React from "react";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

export default function LoadingSpinner({ fullScreen = false }: LoadingSpinnerProps) {
  return (
    <div
      className={`flex justify-center items-center ${
        fullScreen ? "fixed inset-0 bg-white bg-opacity-80 z-50" : ""
      }`}
      role="status"
      aria-label="Loading"
    >
      <div className="w-12 h-12 rounded-full animate-spin-slow border-4 border-t-transparent border-blue-600 shadow-lg" />
    </div>
  );
}
