"use client";

import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AuthLayout({
  children,
  title = "Chào mừng trở lại",
  subtitle = "Đăng nhập để kết nối với cộng đồng của bạn",
}: AuthLayoutProps) {
  return (
    <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="text-gray-300 mt-2">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}